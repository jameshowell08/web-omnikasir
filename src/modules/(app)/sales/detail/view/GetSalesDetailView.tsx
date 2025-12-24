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
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

function IMEIDialogContent({ productName, imeis }: { productName: string, imeis: string[] }) {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>IMEI</DialogTitle>
                <DialogDescription>IMEI untuk {productName}</DialogDescription>
            </DialogHeader>

            <Separator />

            {imeis.map((imei) => (
                <p key={imei}>{imei}</p>
            ))}
        </DialogContent>
    )
}

function SalesDetailItemsTable({ salesItemsData }: { salesItemsData: SalesItemData[] | undefined }) {
    return (
        <CustomTable headers={["SKU", "Nama Produk", "Merek", "Harga", "Jumlah", "IMEI", "Subtotal"]}>
            {
                salesItemsData?.map((salesItemData) => (
                    <TableRow key={salesItemData.id}>
                        <TableCell>{salesItemData.sku}</TableCell>
                        <TableCell>{salesItemData.productName}</TableCell>
                        <TableCell>{salesItemData.brand}</TableCell>
                        <TableCell>{salesItemData.getPrice()}</TableCell>
                        <TableCell>{salesItemData.getQuantity()}</TableCell>
                        <TableCell>
                            <Dialog>
                                <DialogTrigger
                                    disabled={salesItemData.imeis.length <= 1}
                                    className="flex flex-row gap-2 items-center cursor-pointer"
                                >
                                    {salesItemData.imeis.length === 0 ? "-" : salesItemData.imeis[0]}
                                    {salesItemData.imeis.length > 1 && (
                                        <Badge variant="outline">+ {salesItemData.imeis.length - 1}</Badge>
                                    )}
                                </DialogTrigger>
                                <IMEIDialogContent productName={salesItemData.productName} imeis={salesItemData.imeis} />
                            </Dialog>
                        </TableCell>
                        <TableCell>{salesItemData.getSubtotalInString()}</TableCell>
                    </TableRow>
                ))
            }
            <TableRow>
                <TableCell colSpan={6} className="font-bold">Total</TableCell>
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
            <div className="mx-3 mt-4">
                <GetSalesHeaderDetail salesHeaderData={salesData?.headerData} />
                <SalesDetailItemsTable salesItemsData={salesData?.itemsData} />
            </div>
        </div>
    )
}

export default GetSalesDetailView;