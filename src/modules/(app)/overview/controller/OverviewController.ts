import { ChartConfig } from "@/components/ui/chart";
import Routes from "@/src/modules/shared/model/Routes";
import { ChartData, OverviewChartData } from "../model/OverviewChartData";

class OverviewController {
    public static async fetchStats(): Promise<[boolean, OverviewChartData | undefined, string]> {
        const res = await fetch(Routes.DASHBOARD_API.DEFAULT, {
            method: "GET"
        })

        const data = await res.json()
        let errorMessage = ""
        let chartData: OverviewChartData | undefined = undefined

        if (res.ok) {
            chartData = new OverviewChartData(
                data.transaksiPenjualan.map((item: any) => new ChartData(item.month, parseFloat(item.total))),
                data.transaksiPembelian.map((item: any) => new ChartData(item.month, parseFloat(item.total))),
                data.penjualanTertinggi.map((item: any) => new ChartData(item.name, parseFloat(item.value))),
                data.stokKategori.map((item: any) => new ChartData(item.category, parseFloat(item.totalStock)))
            )
        } else {
            errorMessage = data.message
        }

        return [res.ok, chartData, errorMessage]
    }

    public static sanitizeLabel(label: string): string {
        return label.replace(/\s+/g, "_").replace(/[^\w-]/g, "");
    }

    public static getStockBasedOnCategoryChartConfig(data: ChartData[]): ChartConfig {
        return {
            value: {
                label: "Stok"
            },
            ...data.reduce((acc, item, index) => {
                const key = OverviewController.sanitizeLabel(item.label);
                acc[key] = {
                    label: item.label,
                    color: `var(--chart-${((index === data.length - 1) && index % 5 === 0 ? 1 : index % 5) + 1})`
                }
                return acc
            }, {} as ChartConfig)
        } satisfies ChartConfig
    }
}

export default OverviewController;