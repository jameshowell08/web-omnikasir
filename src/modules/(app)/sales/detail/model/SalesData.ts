import SalesHeaderData from "./SalesHeaderData";
import SalesItemData from "./SalesItemData";

class SalesData {
    constructor(
        public headerData: SalesHeaderData,
        public itemsData: SalesItemData[]
    ) { }
}

export default SalesData;