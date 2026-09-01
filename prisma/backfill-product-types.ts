/**
 * One-off, idempotent backfill for the `productType` column.
 *
 * Products that existed before product types were introduced all land on the
 * "OTHER" default. Their category already says what they are, so derive the
 * type from it. Also makes sure the catch-all "others" category exists, since
 * new "Other" products are auto-filed there.
 *
 * Run after `npm run db:push`:  npm run db:backfill-types
 */
import { PrismaClient } from "@prisma/client";
import { productTypeFromCategorySlug } from "../src/lib/types";

const prisma = new PrismaClient();

async function main() {
  const others = await prisma.category.findUnique({ where: { slug: "others" } });
  if (!others) {
    await prisma.category.create({
      data: {
        name: "Other Items",
        slug: "others",
        description:
          "Everything else — dupattas, trousers, shawls and unstitched fabric.",
        icon: "✨",
      },
    });
    console.log('✅ Created the "others" category.');
  }

  // Only touch rows still sitting on the default — never overwrite a type an
  // admin has already chosen.
  const pending = await prisma.product.findMany({
    where: { productType: "OTHER", customType: null },
    select: { id: true, name: true, category: { select: { slug: true } } },
  });

  let updated = 0;
  for (const product of pending) {
    const productType = productTypeFromCategorySlug(product.category.slug);
    if (productType === "OTHER") continue; // genuinely uncategorised — leave it
    await prisma.product.update({
      where: { id: product.id },
      data: { productType },
    });
    updated++;
  }

  console.log(
    `✅ Backfilled ${updated} of ${pending.length} product(s) without an explicit product type.`
  );
}

main()
  .catch((e) => {
    console.error("❌ Backfill failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
