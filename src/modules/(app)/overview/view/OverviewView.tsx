'use client';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { getUser } from "@/src/modules/shared/util/user";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis, YAxis } from "recharts";
import OverviewController from "../controller/OverviewController";
import { ChartData, OverviewChartData } from "../model/OverviewChartData";

function CashierOverview() {
    return (
        <div className="flex flex-col items-center justify-center flex-1 font-bold text-2xl">
            Selamat bekerja!
        </div>
    )
}

function CustomChartCard({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-5 flex-1 border rounded-lg p-5">
            <h1 className="text-md font-bold text-center">{title}</h1>
            <Separator />
            {children}
        </div>
    )
}

function SalesAmountChart({ salesChartData }: { salesChartData: ChartData[] }) {
    const salesChartConfig = {
        value: {
            label: "Nominal",
            color: "black"
        }
    } satisfies ChartConfig

    return (
        <CustomChartCard title="Jumlah Penjualan (Rp)">
            <ChartContainer config={salesChartConfig}>
                <BarChart accessibilityLayer data={salesChartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="label"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                    <Bar dataKey="value" fill="var(--label-color)" radius={4} />
                </BarChart>
            </ChartContainer>
        </CustomChartCard>
    )
}

function PurchaseAmountChart({ purchaseChartData }: { purchaseChartData: ChartData[] }) {
    const purchaseChartConfig = {
        value: {
            label: "Nominal",
            color: "black"
        }
    } satisfies ChartConfig

    return (
        <CustomChartCard title="Jumlah Pembelian (Rp)">
            <ChartContainer config={purchaseChartConfig}>
                <BarChart accessibilityLayer data={purchaseChartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="label"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                    <Bar dataKey="value" fill="var(--label-color)" radius={4} />
                </BarChart>
            </ChartContainer>
        </CustomChartCard>
    )
}

function HighestProductSoldChart({ highestProductSoldData }: { highestProductSoldData: ChartData[] }) {
    const highestProductSoldChartConfig = {
        value: {
            label: "Jumlah",
            color: "black"
        }
    } satisfies ChartConfig

    return (
        <CustomChartCard title="Penjualan Produk Tertinggi">
            <ChartContainer config={highestProductSoldChartConfig}>
                <BarChart accessibilityLayer data={highestProductSoldData} layout="vertical">
                    <CartesianGrid vertical={true} />
                    <XAxis
                        dataKey="value"
                        type="number"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <YAxis
                        dataKey="label"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                    <Bar dataKey="value" fill="var(--label-color)" radius={4} />
                </BarChart>
            </ChartContainer>
        </CustomChartCard>
    )
}

function StockBasedOnCategoryChart({ stockBasedOnCategoryData }: { stockBasedOnCategoryData: ChartData[] }) {
    const stockBasedOnCategoryChartConfig = useMemo(() => {
        return OverviewController.getStockBasedOnCategoryChartConfig(stockBasedOnCategoryData);
    }, [stockBasedOnCategoryData]);

    return (
        <CustomChartCard title="Stok Berdasarkan Kategori">
            <ChartContainer config={stockBasedOnCategoryChartConfig}>
                <PieChart>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                    />
                    <Pie data={stockBasedOnCategoryData.map((item) => ({
                        label: item.label,
                        value: item.value,
                        configKey: OverviewController.sanitizeLabel(item.label),
                        fill: `var(--color-${OverviewController.sanitizeLabel(item.label)})`
                    }))} dataKey="value" nameKey="configKey" />
                    <ChartLegend
                        content={<ChartLegendContent nameKey="configKey" />}
                        className="flex flex-wrap gap-2"
                    />
                </PieChart>
            </ChartContainer>
        </CustomChartCard>
    )
}

function AdminOverview({ chartData }: { chartData: OverviewChartData }) {
    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-row gap-5 flex-1">
                <SalesAmountChart salesChartData={chartData.sales} />
                <PurchaseAmountChart purchaseChartData={chartData.purchase} />
            </div>

            <div className="flex flex-row gap-5 flex-1">
                <HighestProductSoldChart highestProductSoldData={chartData.mostSales} />
                <StockBasedOnCategoryChart stockBasedOnCategoryData={chartData.stockBasedOnCategory} />
            </div>
        </div>
    )
}

function OverviewView() {
    const [chartData, setChartData] = useState<OverviewChartData | undefined>(undefined)

    const fetchStats = async () => {
        const [success, chartData, errorMessage] = await OverviewController.fetchStats()

        if (success) {
            setChartData(chartData)
        } else {
            toast.error(errorMessage)
        }
    }

    useEffect(() => {
        const user = getUser()
        if (user?.role === "ADMIN") {
            fetchStats()
        }
    }, [])

    return (
        chartData ? <AdminOverview chartData={chartData!} /> : <CashierOverview />
    )
}

export default OverviewView;