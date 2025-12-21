import Routes from "@/src/modules/shared/model/Routes";
import Header from "@/src/modules/shared/view/Header";

function GetSalesView() {
    return (
        <div>
            <Header title="Penjualan" buttonLabel="Tambah penjualan" buttonHref={Routes.SALES.ADD} />
        </div>
    )
}

export default GetSalesView;