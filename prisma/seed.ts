import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Start seeding...")

  // ✅ Correct seq_no upsert
  const insertedSeqNo = await prisma.seqNo.upsert({
    where: { name: "user_id" }, // name is unique
    update: {},
    create: {
      name: "user_id",
      format: "US",
      seqno: 1,
    },
  })
  console.log(`Inserted seqNo: ${insertedSeqNo.name}`)

  // ✅ Correct user upsert
  const insertedUser = await prisma.users.upsert({
    where: { userId: "US000" }, // use Prisma field name
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
      createdBy: "US000",
    },
  })
  console.log(`Inserted category: ${insertedCategory.categoryName}`)

  // Product
  const insertedProduct = await prisma.product.upsert({
    where: { productId: "prod-dummy-001" },
    update: {},
    create: {
      productId: "prod-dummy-001",
      productName: "Smartphone",
      brand: "BrandX",
      description: "A dummy smartphone",
      categoryId: insertedCategory.categoryId,
      createdBy: "US000",
    },
  })
  console.log(`Inserted product: ${insertedProduct.productName}`)

  // ProductSku
  const insertedSku = await prisma.productSku.upsert({
    where: { skuId: "sku-dummy-001" },
    update: {},
    create: {
      skuId: "sku-dummy-001",
      sku: "SMX-001",
      productId: insertedProduct.productId,
      barcode: "1234567890123",
      priceSell: 299.99,
      priceBuy: 199.99,
      stock: 50,
      attributes: { color: "black", memory: "128GB" },
      serialRequired: true,
    },
  })
  console.log(`Inserted productSku: ${insertedSku.sku}`)

  // Inventory
  const insertedInventory = await prisma.inventory.upsert({
    where: { inventoryId: "inv-dummy-001" },
    update: {},
    create: {
      inventoryId: "inv-dummy-001",
      date: new Date(),
      note: "Main warehouse",
      categoryId: insertedCategory.categoryId,
    },
  })
  console.log(`Inserted inventory: ${insertedInventory.inventoryId}`)

  // ProductInventory
  const insertedProductInventory = await prisma.productInventory.upsert({
    where: { id: "prodinv-dummy-001" },
    update: {},
    create: {
      id: "prodinv-dummy-001",
      skuId: insertedSku.skuId,
      inventoryId: insertedInventory.inventoryId,
      quantity: 50,
      reserved: 5,
      inTransit: 2,
    },
  })
  console.log(`Inserted productInventory: ${insertedProductInventory.id}`)

  // SerialNumber
  const insertedSerial1 = await prisma.serialNumber.upsert({
    where: { serialId: "ser-dummy-001" },
    update: {},
    create: {
      serialId: "ser-dummy-001",
      skuId: insertedSku.skuId,
      serialNo: "SN-0001",
      status: "IN_STOCK",
      warrantyUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  })
  const insertedSerial2 = await prisma.serialNumber.upsert({
    where: { serialId: "ser-dummy-002" },
    update: {},
    create: {
      serialId: "ser-dummy-002",
      skuId: insertedSku.skuId,
      serialNo: "SN-0002",
      status: "IN_STOCK",
      warrantyUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  })
  console.log(`Inserted serialNumbers: ${insertedSerial1.serialNo}, ${insertedSerial2.serialNo}`)

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
      totalPrice: 299.99,
      paymentId: insertedPaymentMethod.paymentId,
      userId: insertedUser.userId,
      transactionMethod: "Cash",
      customerId: insertedCustomer.customerId,
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
      skuId: insertedSku.skuId,
      productId: insertedProduct.productId,
      quantity: 1,
      price: 299.99,
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
