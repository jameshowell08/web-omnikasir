import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import BillData from "../model/BillData";
import Image from "next/image";

function SalesBill({ billData }: { billData: BillData }) {
    return (
        <div className="flex flex-col items-center m-5">
            <Image src={billData.storeImage} alt="Bill" width={200} height={200} loading="eager" />
            <h1 className="mt-2 font-bold text-xl">{billData.storeName}</h1>
            <h5>{billData.storeAddress}</h5>
            <h5>+62 {billData.storePhone}</h5>

            <div className="w-full mt-4">
                <div className="flex flex-col text-sm mx-2">
                    <h5><span className="font-bold">ID Transaksi:</span> {billData.transactionId}</h5>
                    <h5><span className="font-bold">Tanggal Transaksi:</span> {billData.transactionDate}</h5>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-full font-bold">Nama Produk</TableHead>
                            <TableHead className="font-bold">Qty</TableHead>
                            <TableHead className="font-bold">Harga</TableHead>
                            <TableHead className="font-bold">Subtotal</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {
                            billData.billItemsData.map((billItemData) => (
                                <TableRow key={billItemData.productName}>
                                    <TableCell>{billItemData.productName}</TableCell>
                                    <TableCell align="right">{billItemData.getQuantity()}</TableCell>
                                    <TableCell align="right">{billItemData.getPrice()}</TableCell>
                                    <TableCell align="right">{billItemData.getSubtotal()}</TableCell>
                                </TableRow>
                            ))
                        }

                        <TableRow className="border-0">
                            <TableCell colSpan={3} className="font-bold">
                                <div className="flex flex-col gap-1">
                                    <div>Metode Pembayaran</div>
                                    <div>Total</div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1 items-end">
                                    <div>{billData.paymentMethod}</div>
                                    <div>{billData.getTotal()}</div>
                                </div>
                            </TableCell>
                        </TableRow>

                    </TableBody>
                </Table>
            </div>

            <p className="text-sm mt-4">Terima kasih dan sampai jumpa lagi!</p>
        </div>
    )
}

export default SalesBill;