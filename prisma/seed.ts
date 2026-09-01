import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { StickerType } from "../src/lib/types";

const prisma = new PrismaClient();

interface SeedProduct {
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string;
  stock: number;
  featured: boolean;
  categoryId: string;
  tags: string;
  stickerType?: StickerType;
  customType?: string;
}

// Placeholder images (Unsplash). Replace with your own product photos later.
const IMG = {
  car: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
  bike: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  wall: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
  racing: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
  helmet: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=800&q=80",
};

async function main() {
  console.log("🌱 Seeding Asad Sticker & Auto Zone database...");

  // ── Clean existing data ──
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // ── Categories ──
  const car = await prisma.category.create({
    data: {
      name: "Car Stickers",
      slug: "car",
      description:
        "Premium vinyl stickers and decals for your car — racing stripes, side graphics, bumper stickers and more.",
      icon: "🚗",
    },
  });

  const bike = await prisma.category.create({
    data: {
      name: "Bike Stickers",
      slug: "bike",
      description:
        "Custom stickers and decals for motorcycles and bikes — tank graphics, helmet stickers, and body wraps.",
      icon: "🏍️",
    },
  });

  const wall = await prisma.category.create({
    data: {
      name: "Wall Stickers",
      slug: "wall",
      description:
        "Beautiful wall decals for home, kids rooms and offices — quotes, nature, cartoons and Islamic calligraphy.",
      icon: "🖼️",
    },
  });

  // Catch-all category for anything that isn't a car, bike or wall sticker —
  // other stickers as well as non-sticker products (engine spray, tyres,
  // polish). Products created with type "Other" land here automatically.
  const others = await prisma.category.create({
    data: {
      name: "Other Items",
      slug: "others",
      description:
        "Everything else — laptop, mobile, glass and custom stickers, plus bike and car accessories like engine spray, tyres and polish.",
      icon: "✨",
    },
  });

  // ── Products ──
  // `stickerType` is derived from the category below, so only the "Other"
  // products need to spell it out (along with their custom label).
  const products: SeedProduct[] = [
    // Car
    {
      name: "Racing Stripe Decal Set",
      slug: "racing-stripe-decal-set",
      description:
        "Bold dual racing stripes to give your car a sporty look. Made from premium weather-resistant vinyl that lasts for years. Easy to apply, bubble-free finish. Available in multiple colors.",
      price: 1500,
      salePrice: 1199,
      image: IMG.racing,
      stock: 50,
      featured: true,
      categoryId: car.id,
      tags: "racing,stripe,car,vinyl,sports",
    },
    {
      name: "Flame Accent Sticker Pack",
      slug: "flame-accent-sticker-pack",
      description:
        "A bold set of flame-themed vinyl stickers for cars that want extra attitude. Weatherproof, easy to apply, and available in multiple colors.",
      price: 1100,
      salePrice: 899,
      image: IMG.car,
      stock: 35,
      featured: true,
      categoryId: car.id,
      tags: "car,flame,accent,vinyl,custom",
    },
    {
      name: "Side Body Graphics Kit",
      slug: "side-body-graphics-kit",
      description:
        "Full side body vinyl graphics kit for a custom, aggressive look. UV-protected, fade-resistant, and removable without damaging paint.",
      price: 3500,
      image: IMG.car,
      stock: 25,
      featured: true,
      categoryId: car.id,
      tags: "car,body,graphics,custom,vinyl",
    },
    {
      name: "Windshield Banner Sticker",
      slug: "windshield-banner-sticker",
      description:
        "Stylish windshield sun strip banner. Customizable text available. Cut from durable outdoor vinyl.",
      price: 800,
      salePrice: 599,
      image: IMG.car,
      stock: 100,
      featured: false,
      categoryId: car.id,
      tags: "car,windshield,banner,sunstrip",
    },
    {
      name: "Funny Bumper Sticker Pack",
      slug: "funny-bumper-sticker-pack",
      description:
        "Pack of 5 hilarious bumper stickers to add personality to your ride. Waterproof and scratch-resistant.",
      price: 600,
      image: IMG.car,
      stock: 80,
      featured: false,
      categoryId: car.id,
      tags: "car,bumper,funny,pack",
    },
    // Bike
    {
      name: "Fuel Tank Graphics Wrap",
      slug: "fuel-tank-graphics-wrap",
      description:
        "Eye-catching fuel tank vinyl wrap for motorcycles. Precision-cut, heat-resistant, and made to fit smoothly on curved surfaces.",
      price: 2200,
      salePrice: 1799,
      image: IMG.bike,
      stock: 40,
      featured: true,
      categoryId: bike.id,
      tags: "bike,motorcycle,tank,wrap,graphics",
    },
    {
      name: "Helmet Sticker Bundle",
      slug: "helmet-sticker-bundle",
      description:
        "Cool helmet stickers bundle (10 pcs). Reflective options available for night visibility. Weatherproof and long-lasting.",
      price: 500,
      image: IMG.helmet,
      stock: 120,
      featured: true,
      categoryId: bike.id,
      tags: "bike,helmet,reflective,bundle",
    },
    {
      name: "Rim & Wheel Stripe Stickers",
      slug: "rim-wheel-stripe-stickers",
      description:
        "Reflective rim stripe stickers for both wheels. Boost safety and style at night. Fits most bike wheel sizes.",
      price: 700,
      salePrice: 549,
      image: IMG.bike,
      stock: 90,
      featured: false,
      categoryId: bike.id,
      tags: "bike,rim,wheel,reflective,stripe",
    },
    {
      name: "Custom Name Number Plate Sticker",
      slug: "custom-name-number-plate-sticker",
      description:
        "Personalized name/number stickers for your bike. Send us your text and we'll cut it in premium vinyl.",
      price: 400,
      image: IMG.bike,
      stock: 200,
      featured: false,
      categoryId: bike.id,
      tags: "bike,custom,name,number,personalized",
    },
    // Wall
    {
      name: "Motivational Quote Wall Decal",
      slug: "motivational-quote-wall-decal",
      description:
        "Inspire your space with a beautiful motivational quote decal. Matte finish, removable, and leaves no residue. Perfect for offices and study rooms.",
      price: 1200,
      salePrice: 899,
      image: IMG.wall,
      stock: 60,
      featured: true,
      categoryId: wall.id,
      tags: "wall,quote,motivational,decal,office",
    },
    {
      name: "Kids Room Cartoon Stickers",
      slug: "kids-room-cartoon-stickers",
      description:
        "Colorful cartoon wall stickers to brighten up your child's room. Safe, non-toxic, and easy to reposition.",
      price: 1000,
      image: IMG.wall,
      stock: 70,
      featured: true,
      categoryId: wall.id,
      tags: "wall,kids,cartoon,room,colorful",
    },
    {
      name: "Islamic Calligraphy Wall Art",
      slug: "islamic-calligraphy-wall-art",
      description:
        "Elegant Islamic calligraphy wall decal. Adds a spiritual, classy touch to any room. Premium matte black vinyl.",
      price: 1800,
      salePrice: 1499,
      image: IMG.wall,
      stock: 45,
      featured: false,
      categoryId: wall.id,
      tags: "wall,islamic,calligraphy,art,decal",
    },
    {
      name: "Nature Tree & Birds Decal",
      slug: "nature-tree-birds-decal",
      description:
        "Large nature-themed tree and birds wall decal. Transforms living rooms and bedrooms. Easy DIY application.",
      price: 1600,
      image: IMG.wall,
      stock: 35,
      featured: false,
      categoryId: wall.id,
      tags: "wall,nature,tree,birds,decal",
    },
    // Other — anything that isn't a car, bike or wall sticker.
    {
      name: "Laptop Sticker Pack",
      slug: "laptop-sticker-pack",
      description:
        "Pack of 15 die-cut laptop stickers — tech, gaming and minimal designs. Residue-free vinyl that peels off cleanly.",
      price: 650,
      salePrice: 499,
      image: IMG.wall,
      stock: 150,
      featured: true,
      categoryId: others.id,
      stickerType: "OTHER",
      customType: "Laptop",
      tags: "laptop,pack,diecut,tech,gaming",
    },
    {
      name: "Truck Art Panel Sticker",
      slug: "truck-art-panel-sticker",
      description:
        "Traditional Pakistani truck art panel in premium vinyl. Vivid colors, fully weatherproof, made to survive the road.",
      price: 2500,
      image: IMG.car,
      stock: 30,
      featured: false,
      categoryId: others.id,
      stickerType: "OTHER",
      customType: "Truck Art",
      tags: "truck,art,panel,traditional,pakistani",
    },
    // Other also covers non-sticker products — accessories and care items.
    {
      name: "Bike Engine Spray Paint",
      slug: "bike-engine-spray-paint",
      description:
        "High-temperature engine spray paint for bikes. Heat-resistant finish that resists rust, oil and fading.",
      price: 1200,
      salePrice: 950,
      image: IMG.bike,
      stock: 60,
      featured: false,
      categoryId: others.id,
      stickerType: "OTHER",
      customType: "Engine Spray",
      tags: "bike,engine,spray,paint,accessory",
    },
    {
      name: "Tyre Shine & Polish",
      slug: "tyre-shine-polish",
      description:
        "Deep-black tyre shine for bikes and cars. Non-greasy formula that restores colour and repels dust.",
      price: 850,
      image: IMG.car,
      stock: 80,
      featured: false,
      categoryId: others.id,
      stickerType: "OTHER",
      customType: "Tyre Care",
      tags: "tyre,polish,shine,care,accessory",
    },
  ];

  // Sticker type mirrors the category unless the product states its own.
  const typeByCategoryId: Record<string, StickerType> = {
    [car.id]: "CAR",
    [bike.id]: "BIKE",
    [wall.id]: "WALL",
    [others.id]: "OTHER",
  };

  for (const p of products) {
    const stickerType = p.stickerType ?? typeByCategoryId[p.categoryId];
    await prisma.product.create({
      data: {
        ...p,
        stickerType,
        customType: stickerType === "OTHER" ? p.customType ?? null : null,
      },
    });
  }

  // ── Sample order ──
  const sampleProduct = await prisma.product.findFirst();
  if (sampleProduct) {
    await prisma.order.create({
      data: {
        orderNumber: "CP-2026-0001",
        customerName: "Ali Khan",
        phone: "03001234567",
        email: "ali@example.com",
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
