'use client';

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Routes from "@/src/modules/shared/model/Routes";
import { LoadingOverlayContext } from "@/src/modules/shared/view/LoadingOverlay";
import TablePlaceholder from "@/src/modules/shared/view/TablePlaceholder";
import { IconArrowLeft, IconArrowRight, IconDots, IconEdit, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import GetPaymentMethodController from "../controller/GetPaymentMethodController";
import PaymentMethod from "../model/PaymentMethod";

function GetPaymentMethodHeader() {
    return (
        <header className="flex flex-row justify-between items-center">
            <h1 className="text-2xl font-bold">Metode Pembayaran</h1>
            <Button variant="ghost" size="sm" asChild>
                <Link href={Routes.PAYMENT_METHOD.ADD}>
                    <IconPlus />
                    <span className="text-xs font-bold">Tambah Metode Pembayaran</span>
                </Link>
            </Button>
        </header>
    )
}

function ItemAmountButton({
    amount,
    isSelected = false,
    onClick
}: {
    amount: number,
    isSelected?: boolean,
    onClick: () => void
}) {
    return (
        <Button
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={onClick}
            className="text-sm"
        >
            {amount} item
        </Button>
    )
}

function PaymentMethodFilter({
    searchQuery,
    setSearchQuery,
    selectedAmount,
    setSelectedAmount,
    isSearching
}: {
    searchQuery: string,
    setSearchQuery: (query: string) => void,
    selectedAmount: number,
    setSelectedAmount: (amount: number) => void,
    isSearching: boolean
}) {
    return (
        <div className="mt-3 flex flex-row justify-between items-center">
            <InputGroup className="w-sm">
                <InputGroupAddon>
                    <IconSearch />
                </InputGroupAddon>
                <InputGroupInput
                    placeholder="Cari metode pembayaran..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                />
                {
                    isSearching &&
                    <InputGroupAddon align="inline-end">
                        <Spinner />
                    </InputGroupAddon>
                }
            </InputGroup>

            <div className="flex flex-row gap-2 items-center">
                <span className="text-sm">Item per halaman</span>
                <ItemAmountButton amount={10} isSelected={selectedAmount === 10} onClick={() => setSelectedAmount(10)} />
                <ItemAmountButton amount={20} isSelected={selectedAmount === 20} onClick={() => setSelectedAmount(20)} />
                <ItemAmountButton amount={50} isSelected={selectedAmount === 50} onClick={() => setSelectedAmount(50)} />
            </div>
        </div>
    )
}

function TablePagination({
    page,
    setPage,
    maxPage
}: {
    page: number,
    setPage: (page: number) => void,
    maxPage: number
}) {
    return (
        <div className="mt-4 flex flex-row justify-between items-center">
            <Button variant="ghost" onClick={() => setPage(page - 1)} disabled={page === 1}>
                <IconArrowLeft />
                <span className="text-xs font-bold">Sebelumnya</span>
            </Button>

            <span className="text-sm">Halaman {page} dari {maxPage}</span>

            <Button variant="ghost" onClick={() => setPage(page + 1)} disabled={page === maxPage}>
                <span className="text-xs font-bold">Selanjutnya</span>
                <IconArrowRight />
            </Button>
        </div>
    )
}

function PaymentMethodTable({ displayedPaymentMethods, onDeleteItem }: { displayedPaymentMethods: PaymentMethod[], onDeleteItem: (id: string) => void }) {
    return (
        <div className="mt-4 border rounded-lg overflow-hidden">
            <Table>
                <TableHeader className="bg-black">
                    <TableRow>
                        <TableHead className="font-bold text-white">ID</TableHead>
                        <TableHead className="font-bold text-white">Nama Metode</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {displayedPaymentMethods.map((pm) => (
                        <TableRow key={pm.id}>
                            <TableCell>{pm.id}</TableCell>
                            <TableCell className="w-full">{pm.name}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost"><IconDots /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={Routes.PAYMENT_METHOD.EDIT(pm.id)}>
                                                <IconEdit />
                                                Edit
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem variant="destructive" onClick={() => { onDeleteItem(pm.id)}}>
                                            <IconTrash />
                                            Hapus
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

function GetPaymentMethodView() {
    const showLoadingOverlay = useContext(LoadingOverlayContext);
    const [limit, setLimit] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(0);
    const [displayedPaymentMethods, setDisplayedPaymentMethods] = useState<PaymentMethod[] | null>(null);
    const searchDebounce = useRef<NodeJS.Timeout | null>(null);

    const getPaymentMethods = async (page: number, limit: number, searchQuery: string) => {
        const [res, data, errorMsg, totalPages] = await GetPaymentMethodController.getPaymentMethods(page, limit, searchQuery)
        if (res.ok) {
            setDisplayedPaymentMethods(data)
            setMaxPage(totalPages)
        } else {
            toast.error(errorMsg)
        }
        setIsSearching(false)
    }

    const onChangeSearchQuery = (query: string) => {
        setSearchQuery(query)
        setIsSearching(true)

        if (searchDebounce.current) {
            clearTimeout(searchDebounce.current)
        }
        searchDebounce.current = setTimeout(() => {
            setPage(1)
            setDebouncedSearchQuery(query)
        }, 500)
    }

    const handleDeletePaymentMethod = async (id: string) => {
        showLoadingOverlay(true)
        const [res, errorMsg] = await GetPaymentMethodController.deletePaymentMethod(id)
        if (res.ok) {
            toast.success("Metode pembayaran berhasil dihapus")
            await getPaymentMethods(page, limit, debouncedSearchQuery)
        } else {
            toast.error(errorMsg)
        }
        showLoadingOverlay(false)
    }

    useEffect(() => {
        getPaymentMethods(page, limit, debouncedSearchQuery)
    }, [page, limit, debouncedSearchQuery])

    return (
        <div>
            <GetPaymentMethodHeader />
            <PaymentMethodFilter searchQuery={searchQuery} setSearchQuery={onChangeSearchQuery} selectedAmount={limit} setSelectedAmount={setLimit} isSearching={isSearching} />
            {
                displayedPaymentMethods ? (
                    <PaymentMethodTable displayedPaymentMethods={displayedPaymentMethods} onDeleteItem={handleDeletePaymentMethod} />
                ) : (
                    <TablePlaceholder />
                )
            }
            {
                maxPage >= 1 &&
                <TablePagination page={page} setPage={setPage} maxPage={maxPage} />
            }
        </div>
    )
}

export default GetPaymentMethodView;