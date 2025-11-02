import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Start seeding...")

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log("🗑️  Clearing existing data...")
  await prisma.serialNumber.deleteMany()
  await prisma.productInventory.deleteMany()
  await prisma.inventory.deleteMany()
  await prisma.transactionDetail.deleteMany()
  await prisma.transactionHeader.deleteMany()
  await prisma.productSku.deleteMany()
  await prisma.product.deleteMany()
  await prisma.productCategory.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.paymentMethod.deleteMany()
  await prisma.userAccess.deleteMany()
  await prisma.users.deleteMany()
  await prisma.store.deleteMany()
  await prisma.seqNo.deleteMany()
  console.log("✓ Cleared existing data")

  // Insert Product Categories
  console.log("📁 Creating product categories...")
  await prisma.productCategory.createMany({
    data: [
      {
        categoryId: "cat-001",
        categoryName: "Phone",
        description: "Mobile phones and smartphones",
        createdBy: "system",
        modifiedBy: "system",
      },
      {
        categoryId: "cat-002",
        categoryName: "Tablet",
        description: "Tablets and iPad devices",
        createdBy: "system",
        modifiedBy: "system",
      },
      {
        categoryId: "cat-003",
        categoryName: "Accessories",
        description: "Phone and tablet accessories",
        createdBy: "system",
        modifiedBy: "system",
      },
    ],
  })
  console.log("✓ Categories created")

  // Insert Products
  console.log("📦 Creating products...")
  await prisma.product.createMany({
    data: [
      // Phones
      {
        productId: "prod-001",
        productName: "iPhone 15 Pro",
        brand: "Apple",
        description: "Latest iPhone with A17 Pro chip",
        categoryId: "cat-001",
        createdBy: "system",
        modifiedBy: "system",
      },
      {
        productId: "prod-002",
        productName: "Samsung Galaxy S24",
        brand: "Samsung",
        description: "Flagship Android phone with AI features",
        categoryId: "cat-001",
        createdBy: "system",
        modifiedBy: "system",
      },
      {
        productId: "prod-003",
        productName: "Xiaomi 14",
        brand: "Xiaomi",
        description: "High-performance smartphone with Leica camera",
        categoryId: "cat-001",
        createdBy: "system",
        modifiedBy: "system",
      },
      {
        productId: "prod-004",
        productName: "OPPO Find X7",
        brand: "OPPO",
        description: "Premium phone with advanced camera system",
        categoryId: "cat-001",
        createdBy: "system",
        modifiedBy: "system",
      },
      {
        productId: "prod-005",
        productName: "Vivo X100 Pro",
        brand: "Vivo",
        description: "Flagship phone with ZEISS optics",
        categoryId: "cat-001",
        createdBy: "system",
        modifiedBy: "system",
      },
      // Tablets
      {
        productId: "prod-006",
        productName: 'iPad Pro 12.9"',
        brand: "Apple",
        description: "Professional tablet with M2 chip",
        categoryId: "cat-002",
        createdBy: "system",
        modifiedBy: "system",
      },
      {
        productId: "prod-007",
        productName: "iPad Air",
        brand: "Apple",
        description: "Lightweight tablet with M1 chip",
        categoryId: "cat-002",
        createdBy: "system",
        modifiedBy: "system",
      },
      {
        productId: "prod-008",
        productName: "Samsung Galaxy Tab S9",
        brand: "Samsung",
        description: "Premium Android tablet with S Pen",
        categoryId: "cat-002",
        createdBy: "system",
        modifiedBy: "system",
      },
      {
        productId: "prod-009",
        productName: "Xiaomi Pad 6",
        brand: "Xiaomi",
        description: "Affordable high-performance tablet",
        categoryId: "cat-002",
        createdBy: "system",
        modifiedBy: "system",
      },
      // Accessories
      {
        productId: "prod-010",
        productName: "AirPods Pro",
        brand: "Apple",
        description: "Wireless earbuds with active noise cancellation",
        categoryId: "cat-003",
        createdBy: "system",
        modifiedBy: "system",
      },
      {
        productId: "prod-011",
        productName: "Phone Case",
        brand: "Generic",
        description: "Protective silicone phone case",
        categoryId: "cat-003",
        createdBy: "system",
        modifiedBy: "system",
      },
      {
        productId: "prod-012",
        productName: "Screen Protector",
        brand: "Generic",
        description: "Tempered glass screen protector",
        categoryId: "cat-003",
        createdBy: "system",
        modifiedBy: "system",
      },
      {
        productId: "prod-013",
        productName: "USB-C Cable",
        brand: "Generic",
        description: "Fast charging USB-C cable",
        categoryId: "cat-003",
        createdBy: "system",
        modifiedBy: "system",
      },
      {
        productId: "prod-014",
        productName: "Power Bank",
        brand: "Anker",
        description: "20000mAh portable charger",
        categoryId: "cat-003",
        createdBy: "system",
        modifiedBy: "system",
      },
      {
        productId: "prod-015",
        productName: "Wireless Charger",
        brand: "Belkin",
        description: "15W fast wireless charging pad",
        categoryId: "cat-003",
        createdBy: "system",
        modifiedBy: "system",
      },
    ],
  })
  console.log("✓ Products created")

  // Insert Product SKUs
  console.log("🏷️  Creating product SKUs...")
  await prisma.productSku.createMany({
    data: [
      // iPhone 15 Pro variants
      {
        skuId: "sku-001",
        sku: "IPHONE15PRO-128-BLK",
        productId: "prod-001",
        barcode: "1001001001001",
        priceSell: 17999000.0,
        priceBuy: 16000000.0,
        stock: 3,
        attributes: { storage: "128GB", color: "Black Titanium" },
        serialRequired: true,
      },
      {
        skuId: "sku-002",
        sku: "IPHONE15PRO-256-BLK",
        productId: "prod-001",
        barcode: "1001001001002",
        priceSell: 20999000.0,
        priceBuy: 19000000.0,
        stock: 2,
        attributes: { storage: "256GB", color: "Black Titanium" },
        serialRequired: true,
      },
      {
        skuId: "sku-003",
        sku: "IPHONE15PRO-256-WHT",
        productId: "prod-001",
        barcode: "1001001001003",
        priceSell: 20999000.0,
        priceBuy: 19000000.0,
        stock: 2,
        attributes: { storage: "256GB", color: "White Titanium" },
        serialRequired: true,
      },
      {
        skuId: "sku-004",
        sku: "IPHONE15PRO-512-BLU",
        productId: "prod-001",
        barcode: "1001001001004",
        priceSell: 24999000.0,
        priceBuy: 23000000.0,
        stock: 1,
        attributes: { storage: "512GB", color: "Blue Titanium" },
        serialRequired: true,
      },
      // Samsung Galaxy S24 variants
      {
        skuId: "sku-005",
        sku: "S24-128-BLACK",
        productId: "prod-002",
        barcode: "1001002001001",
        priceSell: 12999000.0,
        priceBuy: 11500000.0,
        stock: 3,
        attributes: { storage: "128GB", color: "Onyx Black" },
        serialRequired: true,
      },
      {
        skuId: "sku-006",
        sku: "S24-256-BLACK",
        productId: "prod-002",
        barcode: "1001002001002",
        priceSell: 14999000.0,
        priceBuy: 13500000.0,
        stock: 2,
        attributes: { storage: "256GB", color: "Onyx Black" },
        serialRequired: true,
      },
      {
        skuId: "sku-007",
        sku: "S24-256-CREAM",
        productId: "prod-002",
        barcode: "1001002001003",
        priceSell: 14999000.0,
        priceBuy: 13500000.0,
        stock: 2,
        attributes: { storage: "256GB", color: "Marble Grey" },
        serialRequired: true,
      },
      // Xiaomi 14 variants
      {
        skuId: "sku-008",
        sku: "MI14-256-BLK",
        productId: "prod-003",
        barcode: "1001003001001",
        priceSell: 10999000.0,
        priceBuy: 9500000.0,
        stock: 2,
        attributes: { storage: "256GB", color: "Black" },
        serialRequired: true,
      },
      {
        skuId: "sku-009",
        sku: "MI14-512-BLK",
        productId: "prod-003",
        barcode: "1001003001002",
        priceSell: 12999000.0,
        priceBuy: 11500000.0,
        stock: 1,
        attributes: { storage: "512GB", color: "Black" },
        serialRequired: true,
      },
      // OPPO Find X7 variants
      {
        skuId: "sku-010",
        sku: "OPPOX7-256-BLK",
        productId: "prod-004",
        barcode: "1001004001001",
        priceSell: 11999000.0,
        priceBuy: 10500000.0,
        stock: 2,
        attributes: { storage: "256GB", color: "Black" },
        serialRequired: true,
      },
      {
        skuId: "sku-011",
        sku: "OPPOX7-512-BLU",
        productId: "prod-004",
        barcode: "1001004001002",
        priceSell: 13999000.0,
        priceBuy: 12500000.0,
        stock: 1,
        attributes: { storage: "512GB", color: "Blue" },
        serialRequired: true,
      },
      // Vivo X100 Pro variants
      {
        skuId: "sku-012",
        sku: "VIVOX100-256-BLK",
        productId: "prod-005",
        barcode: "1001005001001",
        priceSell: 13999000.0,
        priceBuy: 12500000.0,
        stock: 2,
        attributes: { storage: "256GB", color: "Black" },
        serialRequired: true,
      },
      {
        skuId: "sku-013",
        sku: "VIVOX100-512-BLU",
        productId: "prod-005",
        barcode: "1001005001002",
        priceSell: 15999000.0,
        priceBuy: 14500000.0,
        stock: 1,
        attributes: { storage: "512GB", color: "Blue" },
        serialRequired: true,
      },
      // iPad Pro 12.9" variants
      {
        skuId: "sku-014",
        sku: "IPADPRO-128-GRAY",
        productId: "prod-006",
        barcode: "1002001001001",
        priceSell: 18999000.0,
        priceBuy: 17000000.0,
        stock: 2,
        attributes: {
          storage: "128GB",
          color: "Space Gray",
          connectivity: "WiFi",
        },
        serialRequired: true,
      },
      {
        skuId: "sku-015",
        sku: "IPADPRO-256-GRAY",
        productId: "prod-006",
        barcode: "1002001001002",
        priceSell: 21999000.0,
        priceBuy: 20000000.0,
        stock: 1,
        attributes: {
          storage: "256GB",
          color: "Space Gray",
          connectivity: "WiFi",
        },
        serialRequired: true,
      },
      {
        skuId: "sku-016",
        sku: "IPADPRO-256-SLV",
        productId: "prod-006",
        barcode: "1002001001003",
        priceSell: 21999000.0,
        priceBuy: 20000000.0,
        stock: 1,
        attributes: { storage: "256GB", color: "Silver", connectivity: "WiFi" },
        serialRequired: true,
      },
      // iPad Air variants
      {
        skuId: "sku-017",
        sku: "IPADAIR-64-GRAY",
        productId: "prod-007",
        barcode: "1002002001001",
        priceSell: 8999000.0,
        priceBuy: 8000000.0,
        stock: 2,
        attributes: {
          storage: "64GB",
          color: "Space Gray",
          connectivity: "WiFi",
        },
        serialRequired: true,
      },
      {
        skuId: "sku-018",
        sku: "IPADAIR-256-GRAY",
        productId: "prod-007",
        barcode: "1002002001002",
        priceSell: 11999000.0,
        priceBuy: 10500000.0,
        stock: 1,
        attributes: {
          storage: "256GB",
          color: "Space Gray",
          connectivity: "WiFi",
        },
        serialRequired: true,
      },
      // Samsung Galaxy Tab S9 variants
      {
        skuId: "sku-019",
        sku: "TABS9-128-GRAY",
        productId: "prod-008",
        barcode: "1002003001001",
        priceSell: 11999000.0,
        priceBuy: 10500000.0,
        stock: 1,
        attributes: { storage: "128GB", color: "Graphite" },
        serialRequired: true,
      },
      {
        skuId: "sku-020",
        sku: "TABS9-256-GRAY",
        productId: "prod-008",
        barcode: "1002003001002",
        priceSell: 13999000.0,
        priceBuy: 12500000.0,
        stock: 1,
        attributes: { storage: "256GB", color: "Graphite" },
        serialRequired: true,
      },
      // Xiaomi Pad 6 variants
      {
        skuId: "sku-021",
        sku: "MIPAD6-128-GRAY",
        productId: "prod-009",
        barcode: "1002004001001",
        priceSell: 4999000.0,
        priceBuy: 4200000.0,
        stock: 3,
        attributes: { storage: "128GB", color: "Gray" },
        serialRequired: true,
      },
      {
        skuId: "sku-022",
        sku: "MIPAD6-256-GRAY",
        productId: "prod-009",
        barcode: "1002004001002",
        priceSell: 5999000.0,
        priceBuy: 5200000.0,
        stock: 2,
        attributes: { storage: "256GB", color: "Gray" },
        serialRequired: true,
      },
      // AirPods Pro
      {
        skuId: "sku-023",
        sku: "AIRPODSPRO-2ND",
        productId: "prod-010",
        barcode: "1003001001001",
        priceSell: 3799000.0,
        priceBuy: 3300000.0,
        stock: 2,
        attributes: { generation: "2nd Gen", features: "USB-C" },
        serialRequired: true,
      },
      // Phone Cases
      {
        skuId: "sku-024",
        sku: "CASE-IPHONE15-BLK",
        productId: "prod-011",
        barcode: "1003002001001",
        priceSell: 150000.0,
        priceBuy: 80000.0,
        stock: 20,
        attributes: { compatible: "iPhone 15", color: "Black" },
        serialRequired: false,
      },
      {
        skuId: "sku-025",
        sku: "CASE-IPHONE15-BLU",
        productId: "prod-011",
        barcode: "1003002001002",
        priceSell: 150000.0,
        priceBuy: 80000.0,
        stock: 15,
        attributes: { compatible: "iPhone 15", color: "Blue" },
        serialRequired: false,
      },
      {
        skuId: "sku-026",
        sku: "CASE-S24-BLK",
        productId: "prod-011",
        barcode: "1003002001003",
        priceSell: 120000.0,
        priceBuy: 60000.0,
        stock: 18,
        attributes: { compatible: "Samsung S24", color: "Black" },
        serialRequired: false,
      },
      {
        skuId: "sku-027",
        sku: "CASE-GENERIC-BLK",
        productId: "prod-011",
        barcode: "1003002001004",
        priceSell: 100000.0,
        priceBuy: 50000.0,
        stock: 25,
        attributes: { compatible: "Universal", color: "Black" },
        serialRequired: false,
      },
      // Screen Protectors
      {
        skuId: "sku-028",
        sku: "SCREEN-IPHONE15",
        productId: "prod-012",
        barcode: "1003003001001",
        priceSell: 80000.0,
        priceBuy: 40000.0,
        stock: 30,
        attributes: { compatible: "iPhone 15 Series" },
        serialRequired: false,
      },
      {
        skuId: "sku-029",
        sku: "SCREEN-S24",
        productId: "prod-012",
        barcode: "1003003001002",
        priceSell: 70000.0,
        priceBuy: 35000.0,
        stock: 25,
        attributes: { compatible: "Samsung S24" },
        serialRequired: false,
      },
      {
        skuId: "sku-030",
        sku: "SCREEN-IPAD",
        productId: "prod-012",
        barcode: "1003003001003",
        priceSell: 150000.0,
        priceBuy: 80000.0,
        stock: 15,
        attributes: { compatible: "iPad Pro 12.9" },
        serialRequired: false,
      },
      // USB-C Cables
      {
        skuId: "sku-031",
        sku: "CABLE-USBC-1M",
        productId: "prod-013",
        barcode: "1003004001001",
        priceSell: 50000.0,
        priceBuy: 25000.0,
        stock: 40,
        attributes: { length: "1m", power: "60W" },
        serialRequired: false,
      },
      {
        skuId: "sku-032",
        sku: "CABLE-USBC-2M",
        productId: "prod-013",
        barcode: "1003004001002",
        priceSell: 75000.0,
        priceBuy: 40000.0,
        stock: 30,
        attributes: { length: "2m", power: "60W" },
        serialRequired: false,
      },
      // Power Banks
      {
        skuId: "sku-033",
        sku: "PB-ANKER-20000",
        productId: "prod-014",
        barcode: "1003005001001",
        priceSell: 750000.0,
        priceBuy: 600000.0,
        stock: 10,
        attributes: { capacity: "20000mAh", color: "Black" },
        serialRequired: false,
      },
      {
        skuId: "sku-034",
        sku: "PB-ANKER-10000",
        productId: "prod-014",
        barcode: "1003005001002",
        priceSell: 450000.0,
        priceBuy: 350000.0,
        stock: 15,
        attributes: { capacity: "10000mAh", color: "Black" },
        serialRequired: false,
      },
      // Wireless Chargers
      {
        skuId: "sku-035",
        sku: "WC-BELKIN-15W",
        productId: "prod-015",
        barcode: "1003006001001",
        priceSell: 550000.0,
        priceBuy: 450000.0,
        stock: 12,
        attributes: { power: "15W", color: "Black" },
        serialRequired: false,
      },
      {
        skuId: "sku-036",
        sku: "WC-BELKIN-15W-WHT",
        productId: "prod-015",
        barcode: "1003006001002",
        priceSell: 550000.0,
        priceBuy: 450000.0,
        stock: 12,
        attributes: { power: "15W", color: "White" },
        serialRequired: false,
      },
    ],
  })
  console.log("✓ Product SKUs created")

  // Insert Serial Numbers (for serialized products)
  console.log("🔢 Creating serial numbers...")
  const serialNumbers: { skuId: string; serialNo: string; status: string }[] =
    []

  // Helper function to create serial numbers
  const createSerials = (skuId: string, prefix: string, count: number) => {
    for (let i = 1; i <= count; i++) {
      serialNumbers.push({
        skuId,
        serialNo: `${prefix}-${String(i).padStart(5, "0")}`,
        status: "IN_STOCK",
      })
    }
  }

  // iPhone 15 Pro
  createSerials("sku-001", "IP15P-BLK128", 3)
  createSerials("sku-002", "IP15P-BLK256", 2)
  createSerials("sku-003", "IP15P-WHT256", 2)
  createSerials("sku-004", "IP15P-BLU512", 1)

  // Samsung S24
  createSerials("sku-005", "S24-BLK128", 3)
  createSerials("sku-006", "S24-BLK256", 2)
  createSerials("sku-007", "S24-CRM256", 2)

  // Xiaomi 14
  createSerials("sku-008", "MI14-BLK256", 2)
  createSerials("sku-009", "MI14-BLK512", 1)

  // OPPO Find X7
  createSerials("sku-010", "OPPOX7-BLK256", 2)
  createSerials("sku-011", "OPPOX7-BLU512", 1)

  // Vivo X100 Pro
  createSerials("sku-012", "VIVOX100-BLK256", 2)
  createSerials("sku-013", "VIVOX100-BLU512", 1)

  // iPad Pro
  createSerials("sku-014", "IPADPRO-GR128", 2)
  createSerials("sku-015", "IPADPRO-GR256", 1)
  createSerials("sku-016", "IPADPRO-SL256", 1)

  // iPad Air
  createSerials("sku-017", "IPADAIR-GR64", 2)
  createSerials("sku-018", "IPADAIR-GR256", 1)

  // Galaxy Tab S9
  createSerials("sku-019", "TABS9-GR128", 1)
  createSerials("sku-020", "TABS9-GR256", 1)

  // Xiaomi Pad 6
  createSerials("sku-021", "MIPAD6-GR128", 3)
  createSerials("sku-022", "MIPAD6-GR256", 2)

  // AirPods Pro
  createSerials("sku-023", "AIRPODS-PRO2", 2)

  await prisma.serialNumber.createMany({ data: serialNumbers })
  console.log("✓ Serial numbers created")

  // Create default user
  console.log("👤 Creating default user...")
  await prisma.users.create({
    data: {
      userId: "user-001",
      username: "admin",
      password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: password
      userAccesses: {
        create: [
          { access: "admin" },
          { access: "sales" },
          { access: "inventory" },
        ],
      },
    },
  })
  console.log("✓ Default user created (username: admin, password: password)")

  // Create default customer
  console.log("👥 Creating default customers...")
  await prisma.customer.createMany({
    data: [
      {
        customerId: "cust-001",
        customerName: "Walk-in Customer",
        customerPhoneNumber: null,
      },
      {
        customerId: "cust-002",
        customerName: "John Doe",
        customerPhoneNumber: "+62812345678",
      },
    ],
  })
  console.log("✓ Default customers created")

  // Create payment methods
  console.log("💳 Creating payment methods...")
  await prisma.paymentMethod.createMany({
    data: [
      { paymentId: "pay-001", paymentName: "Cash" },
      { paymentId: "pay-002", paymentName: "Credit Card" },
      { paymentId: "pay-003", paymentName: "Debit Card" },
      { paymentId: "pay-004", paymentName: "Bank Transfer" },
      { paymentId: "pay-005", paymentName: "E-Wallet" },
    ],
  })
  console.log("✓ Payment methods created")

  // Create store info
  console.log("🏪 Creating store info...")
  await prisma.store.create({
    data: {
      id: "store-001",
      nama: "TechStore",
      alamat: "Jl. Sudirman No. 123, Jakarta",
      noHp: "+62211234567",
    },
  })
  console.log("✓ Store info created")

  // Create sequence numbers
  console.log("🔢 Creating sequence numbers...")
  await prisma.seqNo.createMany({
    data: [
      { name: "TRANSACTION", format: "TRX", seqno: 0 },
      { name: "INVOICE", format: "INV", seqno: 0 },
    ],
  })
  console.log("✓ Sequence numbers created")

  console.log("✅ Seeding completed successfully!")
  console.log("")
  console.log("📊 Summary:")
  console.log("   - 3 Product Categories")
  console.log("   - 15 Products")
  console.log("   - 36 Product SKUs")
  console.log("   - 40 Serial Numbers")
  console.log("   - 1 User (admin/password)")
  console.log("   - 2 Customers")
  console.log("   - 5 Payment Methods")
  console.log("   - 1 Store Info")
  console.log("   - 2 Sequence Numbers")
}

main().catch((e) => {
  console.error("❌ Error during seeding:", e)
  process.exit(1)
})
