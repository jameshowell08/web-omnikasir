import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Start seeding...")

  // 1. SeqNo - User ID
  const seqUser = await prisma.seqNo.upsert({
    where: { name: "user_id" },
    update: {},
    create: {
      name: "user_id",
      format: "US",
      seqno: 1,
    },
  })
  console.log(`Inserted seqNo: ${seqUser.name}`)

  // 2. SeqNo - Transaction ID (NEW: Required for your API)
  const seqTrx = await prisma.seqNo.upsert({
    where: { name: "TRANSACTION" },
    update: {},
    create: {
      name: "TRANSACTION",
      format: "TRX-",
      seqno: 1, // Start at 1 so next is TRX-00002
    },
  })
  console.log(`Inserted seqNo: ${seqTrx.name}`)

  // 3. Users
  const insertedUser = await prisma.users.upsert({
    where: { userId: "US000" },
    update: {},
    create: {
      userId: "US000",
      username: "admin",
      password: bcrypt.hashSync("admin123", 10),
    },
  })
  console.log(`Inserted user: ${insertedUser.username}`)

  // 4. ProductCategory
  const insertedCategory = await prisma.productCategory.upsert({
    where: { categoryId: "cat-dummy-001" },
    update: {},
    create: {
      categoryId: "cat-dummy-001",
      categoryName: "Electronics",
      description: "Electronic items",
      createdBy: { connect: { userId: insertedUser.userId } },
      createdDate: new Date(),
    },
  })
  console.log(`Inserted category: ${insertedCategory.categoryName}`)

  // 5. Product
  const insertedProduct = await prisma.product.upsert({
    where: { sku: "sku-dummy-001" },
    update: {},
    create: {
      sku: "sku-dummy-001",
      productName: "Smartphone",
      brand: "BrandX",
      category: { connect: { categoryId: insertedCategory.categoryId } },
      createdBy: { connect: { userId: insertedUser.userId } },
      quantity: 100,
      sellingPrice: 399.99,
      buyingPrice: 299.99,
      isNeedImei: false,
    },
  })
  console.log(`Inserted product: ${insertedProduct.productName}`)

  // 6. ProductInventoryHeader
  const insertedInventoryHeader = await prisma.productInventoryHeader.upsert({
    where: { id: "invhdr-dummy-001" },
    update: {},
    create: {
      id: "invhdr-dummy-001",
      supplier: "Main Supplier",
      status: "DRAFT",
      totalPrice: 299.99,
      createdBy: { connect: { userId: insertedUser.userId } },
      createdDate: new Date(),
    },
  })
  console.log(`Inserted inventory header: ${insertedInventoryHeader.id}`)

  // 7. ProductInventoryDetail (Use create, not upsert, as it has no unique constraint other than ID)
  // Check if exists first to avoid duplicate seed errors if run multiple times
  const existingDetail = await prisma.productInventoryDetail.findFirst({
    where: { headerId: insertedInventoryHeader.id, sku: insertedProduct.sku },
  })

  if (!existingDetail) {
    await prisma.productInventoryDetail.create({
      data: {
        headerId: insertedInventoryHeader.id,
        sku: insertedProduct.sku,
        quantity: 50,
        price: 299.99,
      },
    })
    console.log(`Inserted inventory detail`)
  }

  // 8. Imei
  const insertedImei1 = await prisma.imei.upsert({
    where: { imei: "IMEI0001" },
    update: {},
    create: {
      sku: insertedProduct.sku,
      imei: "IMEI0001",
      isSold: false, // Default
    },
  })
  const insertedImei2 = await prisma.imei.upsert({
    where: { imei: "IMEI0002" },
    update: {},
    create: {
      sku: insertedProduct.sku,
      imei: "IMEI0002",
      isSold: false,
    },
  })
  console.log(`Inserted IMEIs: ${insertedImei1.imei}, ${insertedImei2.imei}`)

  // 9. Customer
  const insertedCustomer = await prisma.customer.upsert({
    where: { customerId: "cust-dummy-001" },
    update: {},
    create: {
      customerId: "cust-dummy-001",
      customerName: "John Doe",
      customerPhoneNumber: "08123456789",
    },
  })
  console.log(`Inserted customer: ${insertedCustomer.customerName}`)

  // 10. Store
  const insertedStore = await prisma.store.upsert({
    where: { id: "store-dummy-001" },
    update: {},
    create: {
      id: "store-dummy-001",
      nama: "Omni Store",
      alamat: "Jl. Dummy No.1",
      noHp: "08123456789",
    },
  })
  console.log(`Inserted store: ${insertedStore.nama}`)

  // 11. PaymentMethod
  const insertedPaymentMethod = await prisma.paymentMethod.upsert({
    where: { paymentId: "pay-dummy-001" },
    update: {},
    create: {
      paymentId: "pay-dummy-001",
      paymentName: "Cash",
    },
  })
  console.log(`Inserted payment method: ${insertedPaymentMethod.paymentName}`)

  // 12. TransactionHeader (UPDATED)
  const insertedTransactionHeader = await prisma.transactionHeader.upsert({
    where: { transactionHeaderId: "trx-dummy-001" }, // Matches format TRX-xxxxx or custom
    update: {},
    create: {
      transactionHeaderId: "trx-dummy-001",
      transactionDate: new Date(),
      status: "SUCCESS", // Default status
      transactionMethod: "Cash",

      // Connections
      paymentMethod: {
        connect: { paymentId: insertedPaymentMethod.paymentId },
      },
      customer: { connect: { customerId: insertedCustomer.customerId } },

      // User Relations
      user: { connect: { userId: insertedUser.userId } }, // The Salesperson
      createdBy: { connect: { userId: insertedUser.userId } }, // The Record Creator (NEW REQUIRED FIELD)
    },
  })
  console.log(
    `Inserted transactionHeader: ${insertedTransactionHeader.transactionHeaderId}`
  )

  // 13. TransactionDetail
  const insertedTransactionDetail = await prisma.transactionDetail.upsert({
    where: { transactionDetailId: "trxd-dummy-001" },
    update: {},
    create: {
      transactionDetailId: "trxd-dummy-001",
      transactionHeaderId: insertedTransactionHeader.transactionHeaderId,
      sku: insertedProduct.sku,
      quantity: 1,
      price: 299.99,
      // imeiCode: "IMEI0001", // Optional
    },
  })
  console.log(
    `Inserted transactionDetail: ${insertedTransactionDetail.transactionDetailId}`
  )
}

main()
  .catch((e) => {
    console.error("Error seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
