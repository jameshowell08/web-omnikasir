export class OverviewChartData {
    constructor(
        public sales: ChartData[],
        public purchase: ChartData[],
        public mostSales: ChartData[],
        public stockBasedOnCategory: ChartData[]
    ) { }
}

export class ChartData {
    constructor(
        public label: string,
        public value: number
    ) { }
}