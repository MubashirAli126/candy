import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { ProductType } from "../src/lib/types";

const prisma = new PrismaClient();

interface SeedProduct {
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string;
  /** Sizes with their own prices — see src/lib/sizes.ts for the format. */
  size?: string;
  stock: number;
  featured: boolean;
  categoryId: string;
  tags: string;
  productType?: ProductType;
  customType?: string;
}

// Placeholder images (Unsplash). Replace with your own product photos later.
const IMG = {
  suit: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
  formal: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80",
  kurti: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
  casual: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
  fabric: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",
};

/** Stitched sizes every suit is offered in, all at the product's base price. */
const SUIT_SIZES = "Small, Medium, Large, XL";

async function main() {
  console.log("🌱 Seeding Candy database...");

  // ── Clean existing data ──
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // ── Categories ──
  const threePiece = await prisma.category.create({
    data: {
      name: "3 Piece Suits",
      slug: "3-piece",
      description:
        "Complete stitched 3 piece suits — shirt, trouser and dupatta — in lawn, linen and khaddar for every season.",
      icon: "👗",
    },
  });

  const twoPiece = await prisma.category.create({
    data: {
      name: "2 Piece Suits",
      slug: "2-piece",
      description:
        "Stitched 2 piece suits — shirt and trouser — light, easy and perfect for everyday wear.",
      icon: "🧵",
    },
  });

  const kurti = await prisma.category.create({
    data: {
      name: "Kurtis",
      slug: "kurti",
      description:
        "Casual, formal and embroidered kurtis — pair them with your own trouser or jeans.",
      icon: "👚",
    },
  });

  // Catch-all category for anything that isn't a 3 piece, 2 piece or kurti —
  // dupattas, trousers, shawls, unstitched fabric. Products created with type
  // "Other" land here automatically.
  const others = await prisma.category.create({
    data: {
      name: "Other Items",
      slug: "others",
      description:
        "Everything else — dupattas, trousers, shawls and unstitched fabric to mix and match.",
      icon: "✨",
    },
  });

  // ── Products ──
  // `productType` is derived from the category below, so only the "Other"
  // products need to spell it out (along with their custom label).
  const products: SeedProduct[] = [
    // 3 Piece
    {
      name: "Embroidered Lawn 3 Piece — Rose Blush",
      slug: "embroidered-lawn-3-piece-rose-blush",
      description:
        "Soft summer lawn 3 piece with an embroidered front, plain trouser and printed chiffon dupatta. Colour-fast, breathable and stitched for an easy fit.",
      price: 5500,
      salePrice: 4699,
      image: IMG.suit,
      size: SUIT_SIZES,
      stock: 40,
      featured: true,
      categoryId: threePiece.id,
      tags: "3 piece,lawn,embroidered,summer,dupatta",
    },
    {
      name: "Chikankari 3 Piece — Ivory",
      slug: "chikankari-3-piece-ivory",
      description:
        "Classic chikankari work on ivory cotton net, finished with a matching slip and organza dupatta. Light enough for day wear, dressy enough for an evening.",
      price: 7900,
      image: IMG.formal,
      size: "Small=7900 | Medium=7900 | Large=8300 | XL=8600",
      stock: 20,
      featured: true,
      categoryId: threePiece.id,
      tags: "3 piece,chikankari,formal,cotton net,ivory",
    },
    {
      name: "Printed Khaddar 3 Piece — Winter Plum",
      slug: "printed-khaddar-3-piece-winter-plum",
      description:
        "Warm khaddar 3 piece in a deep plum print with a wool-blend shawl. Made for cooler evenings and winter days up north.",
      price: 6200,
      salePrice: 5299,
      image: IMG.suit,
      size: SUIT_SIZES,
      stock: 30,
      featured: true,
      categoryId: threePiece.id,
      tags: "3 piece,khaddar,winter,printed,shawl",
    },
    {
      name: "Organza Formal 3 Piece — Candy Pink",
      slug: "organza-formal-3-piece-candy-pink",
      description:
        "Party-ready organza 3 piece with sequin detailing on the neckline and sleeves, raw-silk trouser and a scalloped dupatta.",
      price: 12500,
      image: IMG.formal,
      size: "Small=12500 | Medium=12500 | Large=13000 | XL=13500",
      stock: 12,
      featured: false,
      categoryId: threePiece.id,
      tags: "3 piece,organza,formal,party,sequin",
    },
    // 2 Piece
    {
      name: "Cotton 2 Piece — Everyday Sage",
      slug: "cotton-2-piece-everyday-sage",
      description:
        "Simple stitched cotton 2 piece in a soft sage tone. Shirt and trouser only — pair it with any dupatta you already own.",
      price: 3200,
      salePrice: 2699,
      image: IMG.casual,
      size: SUIT_SIZES,
      stock: 60,
      featured: true,
      categoryId: twoPiece.id,
      tags: "2 piece,cotton,casual,everyday,sage",
    },
    {
      name: "Printed Lawn 2 Piece — Summer Daisy",
      slug: "printed-lawn-2-piece-summer-daisy",
      description:
        "All-over daisy print on fine lawn with a straight trouser. Light, airy and easy to wear right through summer.",
      price: 3800,
      image: IMG.casual,
      size: SUIT_SIZES,
      stock: 55,
      featured: true,
      categoryId: twoPiece.id,
      tags: "2 piece,lawn,printed,summer,floral",
    },
    {
      name: "Linen 2 Piece — Office Charcoal",
      slug: "linen-2-piece-office-charcoal",
      description:
        "Crisp linen 2 piece in charcoal with a clean, minimal neckline. Holds its shape all day — made for work.",
      price: 4500,
      salePrice: 3999,
      image: IMG.suit,
      size: "Small=3999 | Medium=3999 | Large=4299 | XL=4499",
      stock: 35,
      featured: false,
      categoryId: twoPiece.id,
      tags: "2 piece,linen,office,formal,charcoal",
    },
    // Kurti
    {
      name: "Embroidered Kurti — Blush Bloom",
      slug: "embroidered-kurti-blush-bloom",
      description:
        "A-line embroidered kurti in blush with thread work across the front panel. Wear it with a trouser, tights or jeans.",
      price: 2600,
      salePrice: 2199,
      image: IMG.kurti,
      size: SUIT_SIZES,
      stock: 80,
      featured: true,
      categoryId: kurti.id,
      tags: "kurti,embroidered,casual,blush,a-line",
    },
    {
      name: "Straight Cut Kurti — Plain White",
      slug: "straight-cut-kurti-plain-white",
      description:
        "The everyday white kurti — straight cut, side slits and a plain round neck. Cotton that survives daily washing.",
      price: 1900,
      image: IMG.kurti,
      size: SUIT_SIZES,
      stock: 100,
      featured: true,
      categoryId: kurti.id,
      tags: "kurti,white,cotton,basic,straight cut",
    },
    {
      name: "Frock Style Kurti — Festive Maroon",
      slug: "frock-style-kurti-festive-maroon",
      description:
        "Flared frock-style kurti in festive maroon with gota detailing on the sleeves. Perfect for mehndi and family functions.",
      price: 4200,
      salePrice: 3599,
      image: IMG.kurti,
      size: "Small=3599 | Medium=3599 | Large=3899 | XL=4099",
      stock: 25,
      featured: false,
      categoryId: kurti.id,
      tags: "kurti,frock,festive,maroon,gota",
    },
    // Other — anything that isn't a 3 piece, 2 piece or kurti.
    {
      name: "Chiffon Dupatta — Printed Pastel",
      slug: "chiffon-dupatta-printed-pastel",
      description:
        "Lightweight chiffon dupatta in a pastel print with finished edges. Pairs with any 2 piece suit or kurti.",
      price: 1400,
      salePrice: 1099,
      image: IMG.fabric,
      stock: 90,
      featured: true,
      categoryId: others.id,
      productType: "OTHER",
      customType: "Dupatta",
      tags: "dupatta,chiffon,printed,pastel,accessory",
    },
    {
      name: "Cotton Trouser — Straight Fit",
      slug: "cotton-trouser-straight-fit",
      description:
        "Plain stitched cotton trouser with a straight fit and elasticated back. A basic worth keeping two of.",
      price: 1200,
      image: IMG.fabric,
      size: SUIT_SIZES,
      stock: 120,
      featured: false,
      categoryId: others.id,
      productType: "OTHER",
      customType: "Trouser",
      tags: "trouser,cotton,basic,straight,stitched",
    },
    {
      name: "Wool Blend Shawl — Deep Plum",
      slug: "wool-blend-shawl-deep-plum",
      description:
        "Soft wool-blend shawl in deep plum with a self-textured border. Warm without the weight.",
      price: 2800,
      salePrice: 2399,
      image: IMG.fabric,
      stock: 40,
      featured: false,
      categoryId: others.id,
      productType: "OTHER",
      customType: "Shawl",
      tags: "shawl,wool,winter,plum,accessory",
    },
  ];

  // Product type mirrors the category unless the product states its own.
  const typeByCategoryId: Record<string, ProductType> = {
    [threePiece.id]: "THREE_PIECE",
    [twoPiece.id]: "TWO_PIECE",
    [kurti.id]: "KURTI",
    [others.id]: "OTHER",
  };

  for (const p of products) {
    const productType = p.productType ?? typeByCategoryId[p.categoryId];
    await prisma.product.create({
      data: {
        ...p,
        productType,
        customType: productType === "OTHER" ? p.customType ?? null : null,
      },
    });
  }

  // ── Sample order ──
  const sampleProduct = await prisma.product.findFirst();
  if (sampleProduct) {
    await prisma.order.create({
      data: {
        orderNumber: "CN-2026-0001",
        customerName: "Ayesha Khan",
        phone: "03001234567",
        email: "ayesha@example.com",
        address: "House 12, Street 5, Gulshan-e-Iqbal",
        city: "Karachi",
        notes: "Please deliver in the evening.",
        status: "PENDING",
        subtotal: sampleProduct.salePrice ?? sampleProduct.price,
        shipping: 200,
        total: (sampleProduct.salePrice ?? sampleProduct.price) + 200,
        items: {
          create: [
            {
              productId: sampleProduct.id,
              productName: sampleProduct.name,
              price: sampleProduct.salePrice ?? sampleProduct.price,
              quantity: 1,
              size: "Medium",
            },
          ],
        },
      },
    });
  }

  console.log(`✅ Seeded ${products.length} products across 4 categories.`);
  console.log("✅ Created 1 sample order.");
  console.log(
    // No fake fallback here: src/lib/auth.ts refuses to sign anyone in unless
    // ADMIN_EMAIL is actually set, so printing a made-up address would mislead.
    `\n🔐 Admin login → email: ${
      process.env.ADMIN_EMAIL ?? "(set ADMIN_EMAIL in .env)"
    }  password: (see .env)`
  );
  // Silence unused import warning; bcrypt reserved for future hashed admin users.
  void bcrypt;
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
