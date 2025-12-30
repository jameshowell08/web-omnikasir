import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import fs from "fs"
import path from "path"

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
  const users = ["US000", "US001", "US002", "US003", "US004", "US005"]
  for (const userId of users) {
    const username =
      userId === "US000" ? "admin" : `user_${userId.toLowerCase()}`
    await prisma.users.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        username,
        password: bcrypt.hashSync("password123", 10),
        role: userId === "US000" ? "ADMIN" : "CASHIER",
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
  const products: any[] = []

  // IMEI Products (map to categories by index)
  const imeiCategoryMap = [0, 2, 3, 0, 2]
  for (let i = 1; i <= 5; i++) {
    const sku = `sku-imei-00${i}`
    const catIndex = imeiCategoryMap[i - 1]
    const targetCat = categories[catIndex]

    const result = await prisma.product.upsert({
      where: { sku },
      update: {},
      create: {
        sku,
        productName: `Premium Product ${i}`,
        brand: i % 2 === 0 ? "Samsung" : "Apple",
        category: { connect: { categoryId: targetCat.categoryId } },
        createdBy: { connect: { userId: "US000" } },
        quantity: 0,
        sellingPrice: (1000 + i * 100).toString(),
        buyingPrice: (800 + i * 100).toString(),
        isNeedImei: true,
      },
    })
    products.push(result)
  }

  // Non-IMEI Products
  const noImeiCategoryMap = [1, 4, 1, 4, 1]
  for (let i = 1; i <= 5; i++) {
    const sku = `sku-noimei-00${i}`
    const catIndex = noImeiCategoryMap[i - 1]
    const targetCat = categories[catIndex]

    const result = await prisma.product.upsert({
      where: { sku },
      update: {},
      create: {
        sku,
        productName: `Standard Product ${i}`,
        brand: "Generic",
        category: { connect: { categoryId: targetCat.categoryId } },
        createdBy: { connect: { userId: "US000" } },
        quantity: 0,
        sellingPrice: (50 + i * 10).toString(),
        buyingPrice: (30 + i * 10).toString(),
        isNeedImei: false,
      },
    })
    products.push(result)
  }
  console.log("Seeded Products")

  // --- Inventory Headers & Details ---
  for (let h = 1; h <= 5; h++) {
    const headerId = `invhdr-00${h}`

    await prisma.productInventoryHeader.upsert({
      where: { id: headerId },
      update: {},
      create: {
        id: headerId,
        supplier: `Supplier ${h}`,
        status: "COMPLETED",
        totalPrice: 0,
        createdBy: { connect: { userId: "US000" } },
      },
    })

    // Choose products from arrays above
    const noImeiProd = products[5 + ((h - 1) % 5)] // non-IMEI items are pushed after IMEI ones
    const imeiProd1 = products[(h - 1) % 5] // IMEI list
    const imeiProd2 = products[(1 + (h - 1)) % 5] // another IMEI product

    // 1. No IMEI Product (qty 50)
    await prisma.productInventoryDetail.create({
      data: {
        headerId,
        sku: noImeiProd.sku,
        quantity: 50,
        price: parseFloat(noImeiProd.buyingPrice),
      },
    })

    // 2. Single IMEI Product
    const imeiCode1 = `IMEI-${h}-S-001`
    await prisma.imei.upsert({
      where: { imei: imeiCode1 },
      update: {},
      create: { sku: imeiProd1.sku, imei: imeiCode1 },
    })
    await prisma.productInventoryDetail.create({
      data: {
        headerId,
        sku: imeiProd1.sku,
        quantity: 1,
        price: parseFloat(imeiProd1.buyingPrice),
        imeiCode: imeiCode1,
      },
    })

    // 3. Multiple IMEI Product (3 items)
    for (let k = 1; k <= 3; k++) {
      const imeiCodeMulti = `IMEI-${h}-M-00${k}`
      await prisma.imei.upsert({
        where: { imei: imeiCodeMulti },
        update: {},
        create: { sku: imeiProd2.sku, imei: imeiCodeMulti },
      })
      await prisma.productInventoryDetail.create({
        data: {
          headerId,
          sku: imeiProd2.sku,
          quantity: 1,
          price: parseFloat(imeiProd2.buyingPrice),
          imeiCode: imeiCodeMulti,
        },
      })
    }

    // Calculate total price and update header
    const currentTotal =
      50 * parseFloat(noImeiProd.buyingPrice) +
      1 * parseFloat(imeiProd1.buyingPrice) +
      3 * parseFloat(imeiProd2.buyingPrice)

    await prisma.productInventoryHeader.update({
      where: { id: headerId },
      data: { totalPrice: currentTotal },
    })

    // Update product quantities
    await prisma.product.update({
      where: { sku: noImeiProd.sku },
      data: { quantity: { increment: 50 } },
    })
    await prisma.product.update({
      where: { sku: imeiProd1.sku },
      data: { quantity: { increment: 1 } },
    })
    await prisma.product.update({
      where: { sku: imeiProd2.sku },
      data: { quantity: { increment: 3 } },
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
        customerPhoneNumber: `812345678${i}`,
        customerAddress: `Address ${i}`,
        isActive: true,
      },
    })
  }
  console.log("Seeded Customers")

  // --- Payment Methods ---
  const payMethods = ["Cash", "Credit Card", "QRIS", "Transfer", "E-Wallet"]
  for (let i = 0; i < payMethods.length; i++) {
    const payId = `pay-00${i + 1}`
    await prisma.paymentMethod.upsert({
      where: { paymentId: payId },
      update: {},
      create: {
        paymentId: payId,
        paymentName: payMethods[i],
      },
    })
  }

  // --- Stores ---
  const placeholderPath = path.join(
    process.cwd(),
    "public",
    "assets",
    "omnikasir-png.png"
  )
  let profilePicture: Buffer | undefined

  try {
    profilePicture = fs.readFileSync(placeholderPath)
  } catch (error) {
    console.warn(
      "Warning: Could not load placeholder image for seeding:",
      error
    )
  }

  await prisma.store.upsert({
    where: { id: "STORE" },
    update: {},
    create: {
      id: "STORE",
      nama: `Omni Store`,
      alamat: `Jakarta, Indonesia`,
      noHp: `8123456789`,
      profilePicture: profilePicture ? new Uint8Array(profilePicture) : null,
    },
  })
  console.log("Seeded Store")

  // --- Transactions (use upsert so seeding is idempotent) ---
  const transactionCount = 15
  const customers = ["cust-001", "cust-002", "cust-003", "cust-004", "cust-005"]

  for (let i = 1; i <= transactionCount; i++) {
    const txId = `TRX-${i.toString().padStart(4, "0")}`
    const randomUser = users[Math.floor(Math.random() * users.length)]
    const randomCustomer =
      customers[Math.floor(Math.random() * customers.length)]
    const randomPayment =
      payMethods[Math.floor(Math.random() * payMethods.length)]
    const paymentId = `pay-00${payMethods.indexOf(randomPayment) + 1}`

    // Random date within last 30 days
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    // Build transaction details (and upsert any SOLD IMEIs)
    const details = await Promise.all(
      Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map(
        async (_, idx) => {
          const randomProduct =
            products[Math.floor(Math.random() * products.length)]
          let qty = 1
          let imeiCode: string | null = null

          if (randomProduct.isNeedImei) {
            imeiCode = `SOLD-IMEI-${i}-${idx}`
            await prisma.imei.upsert({
              where: { imei: imeiCode },
              update: {},
              create: {
                imei: imeiCode,
                sku: randomProduct.sku,
                isSold: true,
              },
            })
          } else {
            qty = Math.floor(Math.random() * 5) + 1
          }

          return {
            quantity: qty,
            price: randomProduct.sellingPrice,
            sku: randomProduct.sku,
            imeiCode,
          }
        }
      )
    )

    // Upsert the header (if exists, do nothing/update as needed)
    await prisma.transactionHeader.upsert({
      where: { transactionHeaderId: txId },
      update: {},
      create: {
        transactionHeaderId: txId,
        transactionDate: date,
        paymentId: paymentId,
        userId: randomUser,
        transactionMethod: i % 2 == 0 ? "POS" : "ONLINE",
        customerId: randomCustomer,
        status: "SUCCESS",
        createdById: randomUser,
        transactionDetails: {
          create: details,
        },
      },
    })
  }
  console.log("Seeded Transactions")
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
