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
}

export default OverviewController;