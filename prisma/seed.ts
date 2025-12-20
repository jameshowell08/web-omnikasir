import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Start seeding...")

  // --- SeqNo ---
  await prisma.seqNo.upsert({
    where: { name: "user_id" },
    update: {},
    create: { name: "user_id", format: "US", seqno: 1 },
  })

  // --- Users ---
  // Create 5 users (US000 as admin, US001-US005)
  const users = ["US000", "US001", "US002", "US003", "US004", "US005"]
  for (const userId of users) {
    const username = userId === "US000" ? "admin" : `user_${userId.toLowerCase()}`
    await prisma.users.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        username,
        password: bcrypt.hashSync("password123", 10),
      },
    })
  }
  console.log("Seeded Users")

  // --- Categories ---
  const categoryNames = ["Laptop", "Aksesoris", "Smartphone", "PC", "Pulsa"]
  const categories = []
  for (let i = 0; i < categoryNames.length; i++) {
    const catName = categoryNames[i]
    const catId = `cat-00${i + 1}`
    const result = await prisma.productCategory.upsert({
      where: { categoryId: catId },
      update: { categoryName: catName },
      create: {
        categoryId: catId,
        categoryName: catName,
        description: `${catName} category`,
        createdBy: { connect: { userId: "US000" } },
      },
    })
    categories.push(result)
  }
  console.log("Seeded Categories")

  // --- Products ---
  // 10 Products: 5 IMEI (Smartphone/Laptop/PC), 5 No IMEI (Aksesoris/Pulsa)
  const products = []

  // IMEI Products
  for (let i = 1; i <= 5; i++) {
    const sku = `sku-imei-00${i}`
    // Assign category: 1=Laptop, 2=Smartphone, 3=PC, 4=Laptop, 5=Smartphone
    const catIndex = (i % 3) // 0 (Laptop), 1 (Aksesoris - skip), 2 (Smartphone), etc. Let's map explicitly.
    // Map: 1->Laptop(0), 2->Smartphone(2), 3->PC(3), 4->Laptop(0), 5->Smartphone(2)
    const targetCat = categories[[0, 2, 3, 0, 2][i - 1]]

    const result = await prisma.product.upsert({
      where: { sku },
      update: {},
      create: {
        sku,
        productName: `Premium Product ${i}`,
        brand: i % 2 === 0 ? "Samsung" : "Apple",
        category: { connect: { categoryId: targetCat.categoryId } },
        createdBy: { connect: { userId: "US000" } },
        quantity: 0, // Will be updated by inventory
        sellingPrice: 1000 + (i * 100),
        buyingPrice: 800 + (i * 100),
        isNeedImei: true,
      },
    })
    products.push(result)
  }

  // Non-IMEI Products
  for (let i = 1; i <= 5; i++) {
    const sku = `sku-noimei-00${i}`
    // Map: 1->Aksesoris(1), 2->Pulsa(4), 3->Aksesoris(1), 4->Pulsa(4), 5->Aksesoris(1)
    const targetCat = categories[[1, 4, 1, 4, 1][i - 1]]

    const result = await prisma.product.upsert({
      where: { sku },
      update: {},
      create: {
        sku,
        productName: `Standard Product ${i}`,
        brand: "Generic",
        category: { connect: { categoryId: targetCat.categoryId } },
        createdBy: { connect: { userId: "US000" } },
        quantity: 0, // Will be updated by inventory
        sellingPrice: 50 + (i * 10),
        buyingPrice: 30 + (i * 10),
        isNeedImei: false,
      },
    })
    products.push(result)
  }
  console.log("Seeded Products")

  // --- Inventory Headers & Details ---
  for (let h = 1; h <= 5; h++) {
    const headerId = `invhdr-00${h}`

    const header = await prisma.productInventoryHeader.upsert({
      where: { id: headerId },
      update: {},
      create: {
        id: headerId,
        supplier: `Supplier ${h}`,
        status: "COMPLETED",
        totalPrice: 0, // Calculated later (simplified here)
        createdBy: { connect: { userId: "US000" } },
      },
    })

    // Create 5 details per header
    // Mix: 
    // Detail 1: No IMEI (qty 50)
    // Detail 2: 1 IMEI (qty 1)
    // Detail 3, 4, 5: >1 IMEI (same product, different IMEIs) - simulates multiple items

    // 1. No IMEI Product
    const noImeiProd = products[5 + (h % 5)] // Pick from non-IMEI list
    await prisma.productInventoryDetail.create({
      data: {
        headerId,
        sku: noImeiProd.sku,
        quantity: 50,
        price: Number(noImeiProd.buyingPrice),
      }
    })

    // 2. Single IMEI Product
    const imeiProd1 = products[0 + (h % 5)] // Pick from IMEI list
    const imeiCode1 = `IMEI-${h}-S-001`
    await prisma.imei.upsert({
      where: { imei: imeiCode1 },
      update: {},
      create: { sku: imeiProd1.sku, imei: imeiCode1 }
    })
    await prisma.productInventoryDetail.create({
      data: {
        headerId,
        sku: imeiProd1.sku,
        quantity: 1,
        price: Number(imeiProd1.buyingPrice),
        imeiCode: imeiCode1
      }
    })

    // 3. Multiple IMEI Product (3 items)
    const imeiProd2 = products[(1 + (h % 5)) % 5] // Another IMEI product
    for (let k = 1; k <= 3; k++) {
      const imeiCodeMulti = `IMEI-${h}-M-00${k}`
      await prisma.imei.upsert({
        where: { imei: imeiCodeMulti },
        update: {},
        create: { sku: imeiProd2.sku, imei: imeiCodeMulti }
      })
      await prisma.productInventoryDetail.create({
        data: {
          headerId,
          sku: imeiProd2.sku,
          quantity: 1,
          price: Number(imeiProd2.buyingPrice),
          imeiCode: imeiCodeMulti
        }
      })
    }

    // Calculate total price for this header
    const currentTotal = (50 * Number(noImeiProd.buyingPrice)) +
      (1 * Number(imeiProd1.buyingPrice)) +
      (3 * Number(imeiProd2.buyingPrice))

    await prisma.productInventoryHeader.update({
      where: { id: headerId },
      data: { totalPrice: currentTotal }
    })

    // Update Product Quantities Incrementally
    // 1. No IMEI Product (qty 50)
    await prisma.product.update({
      where: { sku: noImeiProd.sku },
      data: { quantity: { increment: 50 } }
    })

    // 2. Single IMEI Product (qty 1)
    await prisma.product.update({
      where: { sku: imeiProd1.sku },
      data: { quantity: { increment: 1 } }
    })

    // 3. Multi IMEI Product (qty 3)
    await prisma.product.update({
      where: { sku: imeiProd2.sku },
      data: { quantity: { increment: 3 } }
    })
  }
  console.log("Seeded Inventory")

  // --- Customers ---
  for (let i = 1; i <= 5; i++) {
    const custId = `cust-00${i}`
    await prisma.customer.upsert({
      where: { customerId: custId },
      update: {},
      create: {
        customerId: custId,
        customerName: `Customer ${i}`,
        customerEmail: `customer${i}@gmail.com`,
        customerPhoneNumber: `+62 812345678${i}`,
        customerAddress: `Address ${i}`,
        isActive: true,
      }
    })
  }
  console.log("Seeded Customers")

  // --- Payment Methods ---
  const payMethods = ["Cash", "Credit Card", "QRIS", "Transfer", "E-Wallet"]
  for (let i = 0; i < 5; i++) {
    const payId = `pay-00${i + 1}`
    await prisma.paymentMethod.upsert({
      where: { paymentId: payId },
      update: {},
      create: {
        paymentId: payId,
        paymentName: payMethods[i]
      }
    })
  }

  // --- Stores ---
  for (let i = 1; i <= 5; i++) {
    const storeId = `store-00${i}`
    await prisma.store.upsert({
      where: { id: storeId },
      update: {},
      create: {
        id: storeId,
        nama: `Omni Store ${i}`,
        alamat: `Jl. Demo No.${i}`,
        noHp: `081111111${i}`
      }
    })
  }

  console.log("Seeding completed.")
}

main()
  .catch((e) => {
    console.error("Error seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
