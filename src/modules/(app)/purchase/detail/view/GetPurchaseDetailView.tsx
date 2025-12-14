'use client';
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import BackButton from "@/src/modules/shared/view/BackButton";
import GetPurchaseDetailController from "../controller/GetPurchaseDetailController";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TablePlaceholder from "@/src/modules/shared/view/TablePlaceholder";
import PurchaseDetailItem from "../model/PurchaseDetailItem";
import { Skeleton } from "@/components/ui/skeleton";
import PurchaseDetailData from "../model/PurchaseDetailData";

function GetPurchaseDetailHeader() {
    return (
        <div className="flex flex-row gap-2 items-center">
            <BackButton />
            <h1 className="font-bold text-2xl">Detail Pembelian</h1>
        </div>
    )
}

function GetPurchaseDetailBody({ id, dateCreated, status, supplierName }: { id: string, dateCreated: Date, status: string, supplierName: string }) {
    return (
        <div className="flex flex-row mt-5 gap-20 items-center">
            <div className="flex flex-col">
                <span className="font-bold text-sm">ID Pembelian</span>
                <span className="text-sm">{id}</span>
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-sm">Tanggal dibuat</span>
                <span className="text-sm">{BaseUtil.formatDate(dateCreated)}</span>
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-sm">Status</span>
                <span className="text-sm">{status}</span>
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-sm">Supplier</span>
                <span className="text-sm">{supplierName}</span>
            </div>
        </div>
    )
}

function CustomTableHead({ title }: { title: string }) {
    return (
        <TableHead className="font-bold text-white">
            {title}
        </TableHead>
    )
}

function GetPurchaseDetailTable({ purchaseDetailItems, totalPrice }: { purchaseDetailItems: PurchaseDetailItem[], totalPrice: number }) {
    return (
        <div className="mt-5 rounded-lg overflow-hidden border">
            <Table>
                <TableHeader className="bg-black">
                    <TableRow>
                        <CustomTableHead title="SKU" />
                        <CustomTableHead title="Nama" />
                        <CustomTableHead title="Merek" />
                        <CustomTableHead title="Kategori" />
                        <CustomTableHead title="Harga Satuan" />
                        <CustomTableHead title="Jumlah" />
                        <CustomTableHead title="IMEI" />
                        <CustomTableHead title="Subtotal" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {purchaseDetailItems.map((item, index) => (
                        <TableRow key={item.sku}>
                            <TableCell>{item.sku}</TableCell>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>{item.brand}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{BaseUtil.formatRupiah(item.price)}</TableCell>
                            <TableCell>{BaseUtil.formatNumberV2(item.quantity)}</TableCell>
                            <TableCell wrap>
                                {
                                    item.imeis ? (
                                        <Dialog>
                                            <DialogTrigger className="cursor-pointer flex flex-row gap-2">
                                                {item.imeis[0]}
                                                {
                                                    item.imeis.length > 1 && (
                                                        <Badge variant="outline">+{item.imeis.length - 1}</Badge>
                                                    )
                                                }
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>IMEI</DialogTitle>
                                                    <DialogDescription>
                                                        List IMEI yang dimasukkan
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <Separator />

                                                <section className="flex flex-col gap-2">
                                                    {item.imeis.map((imei) => (
                                                        <span key={imei}>{imei}</span>
                                                    ))}
                                                </section>
                                            </DialogContent>
                                        </Dialog>
                                    ) : (
                                        "-"
                                    )
                                }
                            </TableCell>
                            <TableCell>{BaseUtil.formatRupiah(item.subtotal)}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={6}>
                            <span className="font-bold">Total</span>
                        </TableCell>
                        <TableCell>{BaseUtil.formatRupiah(totalPrice)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}

function GetPurchaseDetailView({ id }: { id: string }) {
    const [purchaseDetail, setPurchaseDetail] = useState<PurchaseDetailData | null>(null)

    const fetchProductDetail = async () => {
        const [isSuccess, purchaseDetail, errorMsg] = await GetPurchaseDetailController.getPurchaseDetail(id)

        if (isSuccess) {
            purchaseDetail?.items.forEach((item) => {
                console.log(item.imeis)
            })
            setPurchaseDetail(purchaseDetail)
        } else {
            toast.error(errorMsg)
        }
    }

    useEffect(() => {
        fetchProductDetail()
    }, [])

    return (
        <div>
            <GetPurchaseDetailHeader />
            <div className="mx-3">
                {
                    purchaseDetail ? (
                        <GetPurchaseDetailBody id={id} dateCreated={purchaseDetail.createdDate} status={purchaseDetail.status} supplierName={purchaseDetail.supplierName} />
                    ) : (
                        <Skeleton className="h-10" />
                    )
                }
                {
                    purchaseDetail ? (
                        <GetPurchaseDetailTable totalPrice={purchaseDetail.totalPrice} purchaseDetailItems={purchaseDetail.items} />
                    ) : (
                        <TablePlaceholder />
                    )
                }
            </div>
        </div>
    )
}

export default GetPurchaseDetailView;