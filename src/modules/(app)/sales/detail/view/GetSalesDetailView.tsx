'use client';
import { TableCell, TableRow } from "@/components/ui/table";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import CustomTable from "@/src/modules/shared/view/CustomTable";
import HeaderWithBackButton from "@/src/modules/shared/view/HeaderWithBackButton";
import { useContext, useEffect, useState } from "react";
import SalesData from "../model/SalesData";
import SalesHeaderData from "../model/SalesHeaderData";
import { LoadingOverlayContext } from "@/src/modules/shared/view/LoadingOverlay";
import GetSalesDetailController from "../controller/GetSalesDetailController";
import toast from "react-hot-toast";
import SalesItemData from "../model/SalesItemData";

function SalesDetailItemsTable({ salesItemsData }: { salesItemsData: SalesItemData[] | undefined }) {
    return (
        <CustomTable headers={["SKU", "Nama Produk", "Merek", "Jumlah", "Harga", "Subtotal"]}>
            {
                salesItemsData?.map((salesItemData) => (
                    <TableRow key={salesItemData.id}>
                        <TableCell>{salesItemData.sku}</TableCell>
                        <TableCell>{salesItemData.productName}</TableCell>
                        <TableCell>{salesItemData.brand}</TableCell>
                        <TableCell>{salesItemData.getQuantity()}</TableCell>
                        <TableCell>{salesItemData.getPrice()}</TableCell>
                        <TableCell>{salesItemData.getSubtotalInString()}</TableCell>
                    </TableRow>
                ))
            }
            <TableRow>
                <TableCell colSpan={5}>Total</TableCell>
                <TableCell>{BaseUtil.formatRupiah(GetSalesDetailController.getTotalSales(salesItemsData ?? []))}</TableCell>
            </TableRow>
        </CustomTable>
    )
}

function SalesHeaderDetailItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col">
            <h5 className="text-sm font-bold">{label}</h5>
            <p className="text-sm">{value}</p>
        </div>
    )
}

function GetSalesHeaderDetail({ salesHeaderData }: { salesHeaderData: SalesHeaderData | undefined }) {
    return (
        <section className="flex flex-row gap-10">
            <SalesHeaderDetailItem label="ID Transaksi" value={salesHeaderData?.transactionId || ""} />
            <SalesHeaderDetailItem label="Tanggal Transaksi" value={salesHeaderData?.getTransactionDate() || ""} />
            <SalesHeaderDetailItem label="Metode Transaksi" value={salesHeaderData?.transactionMethod || ""} />
            <SalesHeaderDetailItem label="Status Transaksi" value={salesHeaderData?.getTransactionStatus() || ""} />
            <SalesHeaderDetailItem label="Nama Pelanggan" value={salesHeaderData?.customerName || ""} />
            <SalesHeaderDetailItem label="Metode Pembayaran" value={salesHeaderData?.paymentMethod || ""} />
        </section>
    )
}

function GetSalesDetailView({ id }: { id: string }) {
    const showLoadingOverlay = useContext(LoadingOverlayContext);
    const [salesData, setSalesData] = useState<SalesData | undefined>(undefined)

    const fetchSalesDetail = async () => {
        showLoadingOverlay(true)
        const [success, data, errorMessage] = await GetSalesDetailController.getSalesDetail(id)

        if (success) {
            setSalesData(data)
        } else {
            toast.error(errorMessage)
        }

        showLoadingOverlay(false)
    }

    useEffect(() => {
        fetchSalesDetail()
    }, [])

    return (
        <div>
            <HeaderWithBackButton title="Detail Penjualan" />
            <div className="mx-2 mt-4">
                <GetSalesHeaderDetail salesHeaderData={salesData?.headerData} />
                <SalesDetailItemsTable salesItemsData={salesData?.itemsData} />
            </div>
        </div>
    )
}

export default GetSalesDetailView;