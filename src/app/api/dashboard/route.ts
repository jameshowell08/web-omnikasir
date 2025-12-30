import { requireAdmin } from "@/src/modules/shared/middleware/auth"
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET() {
  const auth = await requireAdmin()
  if ("error" in auth) return auth.error
  try {
    const currentYear = new Date().getFullYear()

    const [salesData, purchaseData, topProducts, categoryStock] =
      await Promise.all([
        prisma.transactionHeader.findMany({
          where: {
            transactionDate: {
              gte: new Date(`${currentYear}-01-01`),
              lte: new Date(`${currentYear}-12-31`),
            },
            status: "SUCCESS",
          },
          include: { transactionDetails: true },
        }),
        prisma.productInventoryHeader.findMany({
          where: {
            createdDate: { gte: new Date(`${currentYear}-01-01`) },
            status: "COMPLETED",
          },
        }),
        prisma.transactionDetail.groupBy({
          by: ["sku"],
          _sum: { quantity: true },
          orderBy: { _sum: { quantity: "desc" } },
          take: 5,
        }),
        prisma.productCategory.findMany({
          select: {
            categoryName: true,
            products: { select: { quantity: true } },
          },
        }),
      ])

    // aggregate the grouped SKU sums into brand totals
    const skuSums = topProducts
    const skus = skuSums.map((s) => s.sku).filter(Boolean) as string[]

    const products = await prisma.product.findMany({
      where: { sku: { in: skus } },
      select: { sku: true, brand: true, productName: true },
    })

    const bySku: Record<
      string,
      { sku: string; brand?: string; productName?: string }
    > = Object.fromEntries(products.map((p) => [p.sku, p]))

    const brandTotals: Record<string, number> = {}
    skuSums.forEach((s) => {
      const sku = s.sku
      const qty = s._sum?.quantity ?? 0
      const prod = bySku[sku]
      const brand = prod?.brand || prod?.productName || "Unknown"
      brandTotals[brand] = (brandTotals[brand] || 0) + qty
    })

    const topProductsWithDetails = Object.entries(brandTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

    const stockByCategory = categoryStock
      .map((cat) => ({
        category: cat.categoryName,
        totalStock: cat.products.reduce((acc, p) => acc + p.quantity, 0),
      }))
      .sort((a, b) => b.totalStock - a.totalStock)

    const formatMonthlyData = (data: any[], dateField: string) => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ]
      const grouped = months.map((m) => ({ month: m, total: 0 }))

      data.forEach((item) => {
        const monthIdx = new Date(item[dateField]).getMonth()
        const total = item.transactionDetails
          ? item.transactionDetails.reduce(
              (sum: number, d: any) => sum + Number(d.price) * d.quantity,
              0
            )
          : Number(item.totalPrice || 0)

        grouped[monthIdx].total += total
      })
      return grouped
    }

    const dashboardData = {
      transaksiPenjualan: formatMonthlyData(salesData, "transactionDate"),
      transaksiPembelian: formatMonthlyData(purchaseData, "createdDate"),
      penjualanTertinggi: topProductsWithDetails,
      stokKategori: stockByCategory,
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Dashboard API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
