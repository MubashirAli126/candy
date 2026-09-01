import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { effectiveUnitPrice, lineTotal, shippingFor } from "@/lib/pricing";
import { findSizeOption, hasSizePrices, parseSizeOptions } from "@/lib/sizes";

const orderSchema = z.object({
  customer: z.object({
    customerName: z.string().min(2, "Name is required"),
    phone: z.string().min(7, "Valid phone required"),
    email: z.string().email().optional().or(z.literal("")),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    notes: z.string().optional(),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        // Bulk orders are expected (50+ earns a discount), so the cap is well
        // above the old 99 — stock is what really bounds a line.
        quantity: z.number().int().min(1).max(9999),
        size: z.string().optional(),
      })
    )
    .min(1, "Cart is empty"),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid data" },
      { status: 400 }
    );
  }

  const { customer, items } = parsed.data;

  // Fetch products from DB — never trust prices from the client.
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const orderItems: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    size?: string;
  }[] = [];

  let subtotal = 0;
  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return NextResponse.json(
        { error: `A product in your cart is no longer available.` },
        { status: 400 }
      );
    }
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `Not enough stock for "${product.name}".` },
        { status: 400 }
      );
    }
    // Sizes can be priced individually, so the price comes from the size the
    // shopper chose — never from the client payload.
    const sizeOptions = parseSizeOptions(product.size);
    const chosenSize = findSizeOption(sizeOptions, item.size);
    if (hasSizePrices(sizeOptions) && !chosenSize) {
      return NextResponse.json(
        {
          error: `Please choose a size for "${product.name}" — its price depends on the size.`,
        },
        { status: 400 }
      );
    }

    const unitPrice = chosenSize?.price ?? product.salePrice ?? product.price;
    subtotal += lineTotal(unitPrice, item.quantity);
    orderItems.push({
      productId: product.id,
      productName: product.name,
      // Snapshot the unit price *after* the line's bulk discount so
      // `price × quantity` always reconciles with the order subtotal.
      price: effectiveUnitPrice(unitPrice, item.quantity),
      quantity: item.quantity,
      // Snapshot the label as the admin wrote it, not the client's casing.
      size: chosenSize?.label ?? item.size,
    });
  }

  subtotal = Math.round(subtotal * 100) / 100;
  const shipping = shippingFor(subtotal);
  const total = Math.round((subtotal + shipping) * 100) / 100;

  // Generate order number from current count.
  const count = await prisma.order.count();
  const orderNumber = generateOrderNumber(count + 1);

  try {
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          customerName: customer.customerName,
          phone: customer.phone,
          email: customer.email || null,
          address: customer.address,
          city: customer.city,
          notes: customer.notes || null,
          subtotal,
          shipping,
          total,
          items: { create: orderItems },
        },
      });

      // Decrement stock.
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
      return created;
    });

    return NextResponse.json(
      { orderNumber: order.orderNumber, id: order.id, total },
      { status: 201 }
    );
  } catch (err) {
    console.error("Order creation failed:", err);
    return NextResponse.json(
      { error: "Could not place order. Please try again." },
      { status: 500 }
    );
  }
}
