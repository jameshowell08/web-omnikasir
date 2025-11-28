import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Start seeding...")

  // SeqNo
  const insertedSeqNo = await prisma.seqNo.upsert({
    where: { name: "user_id" },
    update: {},
    create: {
      name: "user_id",
      format: "US",
      seqno: 1,
    },
  })
  console.log(`Inserted seqNo: ${insertedSeqNo.name}`)

  // Users
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

  // ProductCategory
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

  // Product
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
    },
  })
  console.log(`Inserted product: ${insertedProduct.productName}`)

  // ProductInventoryHeader
  const insertedInventoryHeader = await prisma.productInventoryHeader.upsert({
    where: { id: "invhdr-dummy-001" },
    update: {},
    create: {
      id: "invhdr-dummy-001",
      supplier: "Main Supplier",
      status: "DRAFT",
      createdBy: { connect: { userId: insertedUser.userId } },
      createdDate: new Date(),
    },
  })
  console.log(`Inserted inventory header: ${insertedInventoryHeader.id}`)

  // ProductInventoryDetail
  const insertedInventoryDetail = await prisma.productInventoryDetail.upsert({
    where: { headerId_sku: { headerId: insertedInventoryHeader.id, sku: insertedProduct.sku } },
    update: {},
    create: {
      headerId: insertedInventoryHeader.id,
      sku: insertedProduct.sku,
      quantity: 50,
      price: 299.99,
      // imeiCode: "IMEI0001", // Only include if client expects it
    },
  })
  console.log(`Inserted inventory detail: ${insertedInventoryDetail.headerId}, ${insertedInventoryDetail.sku}`)

  // Imei
  const insertedImei1 = await prisma.imei.upsert({
    where: { imei: "IMEI0001" },
    update: {},
    create: {
      sku: insertedProduct.sku,
      imei: "IMEI0001",
    },
  })
  const insertedImei2 = await prisma.imei.upsert({
    where: { imei: "IMEI0002" },
    update: {},
    create: {
      sku: insertedProduct.sku,
      imei: "IMEI0002",
    },
  })
  console.log(`Inserted IMEIs: ${insertedImei1.imei}, ${insertedImei2.imei}`)

  // Customer
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

  // Store
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

  // PaymentMethod
  const insertedPaymentMethod = await prisma.paymentMethod.upsert({
    where: { paymentId: "pay-dummy-001" },
    update: {},
    create: {
      paymentId: "pay-dummy-001",
      paymentName: "Cash",
    },
  })
  console.log(`Inserted payment method: ${insertedPaymentMethod.paymentName}`)

  // TransactionHeader
  const insertedTransactionHeader = await prisma.transactionHeader.upsert({
    where: { transactionHeaderId: "trx-dummy-001" },
    update: {},
    create: {
      transactionHeaderId: "trx-dummy-001",
      transactionDate: new Date(),
      paymentMethod: { connect: { paymentId: insertedPaymentMethod.paymentId } },
      user: { connect: { userId: insertedUser.userId } },
      transactionMethod: "Cash",
      customer: { connect: { customerId: insertedCustomer.customerId } },
    },
  })
  console.log(`Inserted transactionHeader: ${insertedTransactionHeader.transactionHeaderId}`)

  // TransactionDetail
  const insertedTransactionDetail = await prisma.transactionDetail.upsert({
    where: { transactionDetailId: "trxd-dummy-001" },
    update: {},
    create: {
      transactionDetailId: "trxd-dummy-001",
      transactionHeaderId: insertedTransactionHeader.transactionHeaderId,
      sku: insertedProduct.sku,
      quantity: 1,
      price: 299.99,
      // imeiCode: "IMEI0001", // Only include if client expects it
    },
  })
  console.log(`Inserted transactionDetail: ${insertedTransactionDetail.transactionDetailId}`)
}

main()
  .catch((e) => {
    console.error("Error seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
