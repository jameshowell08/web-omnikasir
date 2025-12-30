'use client';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Routes from "@/src/modules/shared/model/Routes";
import TablePlaceholder from "@/src/modules/shared/view/TablePlaceholder";
import { IconArrowLeft, IconArrowRight, IconDots, IconEdit, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import GetCustomerController from "../controller/GetCustomerController";
import CustomerTableData from "../model/CustomerTableData";
import { Spinner } from "@/components/ui/spinner";
import { LoadingOverlayContext } from "@/src/modules/shared/view/LoadingOverlay";

function GetCustomerHeader() {
    return (
        <div className="flex flex-row items-center justify-between">
            <h1 className="text-2xl font-bold">Pelanggan</h1>
            <Button variant="ghost" size="sm" className="font-bold" asChild>
                <Link href={Routes.CUSTOMER.ADD}>
                    <IconPlus />
                    Tambah Pelanggan
                </Link>
            </Button>
        </div>
    )
}

function CustomItemButton({ isSelected, amount, onClick }: { isSelected: boolean, amount: number, onClick: () => void }) {
    return (
        <Button variant={isSelected ? "default" : "outline"} size="sm" onClick={onClick}>{amount} item</Button>
    )
}

function GetCustomerFilter({ setSearchQuery, limit, setLimit }: { setSearchQuery: (query: string) => void, limit: number, setLimit: (limit: number) => void }) {
    const [searchDebounced, setSearchDebounced] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const searchDebouncedRef = useRef<NodeJS.Timeout | null>(null)

    const onSearchChange = (searchValue: string) => {
        setSearchDebounced(searchValue)
        setIsLoading(true)

        if (searchDebouncedRef.current) {
            clearTimeout(searchDebouncedRef.current)
        }
        searchDebouncedRef.current = setTimeout(() => {
            setSearchQuery(searchValue)
            setIsLoading(false)
        }, 500)
    }

    return (
        <div className="flex flex-row justify-between items-center mt-4">
            <div className="w-92">
                <InputGroup>
                    <InputGroupAddon>
                        <IconSearch />
                    </InputGroupAddon>

                    {
                        isLoading &&
                        <InputGroupAddon align="inline-end">
                            <Spinner />
                        </InputGroupAddon>
                    }

                    <InputGroupInput placeholder="Cari pelanggan..." value={searchDebounced} onChange={(e) => onSearchChange(e.target.value)} />
                </InputGroup>
            </div>

            <div className="flex flex-row items-center gap-2">
                <span className="text-sm">Item per halaman</span>
                <CustomItemButton isSelected={limit === 10} amount={10} onClick={() => setLimit(10)} />
                <CustomItemButton isSelected={limit === 20} amount={20} onClick={() => setLimit(20)} />
                <CustomItemButton isSelected={limit === 50} amount={50} onClick={() => setLimit(50)} />
            </div>
        </div>
    )
}

function CustomTableHead({ children }: { children: React.ReactNode }) {
    return (
        <TableHead className="text-white font-bold">{children}</TableHead>
    )
}

function CustomTableCell({ customer, onDelete }: { customer: CustomerTableData, onDelete: (id: string) => void }) {
    return (
        <TableRow>
            <TableCell>{customer.id}</TableCell>
            <TableCell>{customer.name}</TableCell>
            <TableCell>{customer?.email?.length > 0 ? customer.email : "-"}</TableCell>
            <TableCell>{customer?.phone?.length > 0 ? `+62 ${customer.phone}` : "-"}</TableCell>
            <TableCell>{customer?.address?.length > 0 ? customer.address : "-"}</TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                            <IconDots />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={Routes.CUSTOMER.EDIT(customer.id)}>
                                <IconEdit />
                                Edit
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem variant="destructive" onClick={() => onDelete(customer.id)}>
                            <IconTrash />
                            Hapus
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    )
}

function CustomerTable({ customers, onDelete }: { customers: CustomerTableData[], onDelete: (id: string) => void }) {
    return (
        <div className="border rounded-lg overflow-hidden mt-4">
            <Table>
                <TableHeader className="bg-black">
                    <TableRow>
                        <CustomTableHead>ID</CustomTableHead>
                        <CustomTableHead>Nama Pelanggan</CustomTableHead>
                        <CustomTableHead>Email</CustomTableHead>
                        <CustomTableHead>No. Telp</CustomTableHead>
                        <CustomTableHead>Alamat</CustomTableHead>
                        <TableHead className="w-0" />
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {
                        customers.map((customer) => (
                            <CustomTableCell key={customer.id} customer={customer} onDelete={() => onDelete(customer.id)} />
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

function CustomerTablePaging({ currentPage, totalPages, setPage }: { currentPage: number, totalPages: number, setPage: (page: number) => void }) {
    return (
        <div className="flex flex-row justify-between items-center mt-5">
            <Button variant="ghost" size="sm" disabled={currentPage === 1} className="font-bold" onClick={() => setPage(currentPage - 1)}>
                <IconArrowLeft />
                Halaman sebelumnya
            </Button>

            <span className="text-sm">Halaman {currentPage} dari {totalPages}</span>

            <Button variant="ghost" size="sm" disabled={currentPage === totalPages} className="font-bold" onClick={() => setPage(currentPage + 1)}>
                Halaman selanjutnya
                <IconArrowRight />
            </Button>
        </div>
    )
}

function GetCustomerView() {

    const showLoadingOverlay = useContext(LoadingOverlayContext);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [customers, setCustomers] = useState<CustomerTableData[] | undefined>(undefined)
    const [searchQuery, setSearchQuery] = useState("")

    const fetchCustomerData = useCallback(async (searchValue: string, page: number, limit: number) => {
        showLoadingOverlay(true)
        const [isSuccess, data, errorMessage, totalPages] = await GetCustomerController.getCustomers(searchValue, page, limit)

        if (isSuccess) {
            setCustomers(data)
            setTotalPages(totalPages)
        } else {
            toast.error(errorMessage)
        }
        showLoadingOverlay(false)
    }, [showLoadingOverlay])

    const onDeleteCustomer = async (id: string) => {
        const [isSuccess, errorMessage] = await GetCustomerController.deleteCustomer(id)

        if (isSuccess) {
            toast.success("Customer berhasil dihapus")
            fetchCustomerData(searchQuery, page, limit)
        } else {
            toast.error(errorMessage)
        }
    }

    useEffect(() => {
        fetchCustomerData(searchQuery, page, limit)
    }, [fetchCustomerData, searchQuery, page, limit])

    return (
        <div className="flex flex-col">
            <GetCustomerHeader />
            <GetCustomerFilter setSearchQuery={setSearchQuery} limit={limit} setLimit={setLimit} />
            {
                customers ? (
                    <CustomerTable customers={customers} onDelete={onDeleteCustomer} />
                ) : (
                    <TablePlaceholder />
                )
            }
            <CustomerTablePaging currentPage={page} totalPages={totalPages} setPage={setPage} />
        </div>
    )
}

export default GetCustomerView;