import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { requireAdmin } from "@/src/modules/shared/middleware/auth"

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
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

    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { sku: item.sku },
          select: { productName: true, brand: true },
        })
        return {
          name: product?.brand || product?.productName || "Unknown",
          value: item._sum.quantity,
        }
      })
    )

    const stockByCategory = categoryStock.map((cat) => ({
      category: cat.categoryName,
      totalStock: cat.products.reduce((acc, p) => acc + p.quantity, 0),
    }))

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
