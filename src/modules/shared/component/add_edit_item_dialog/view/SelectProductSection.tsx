import { Checkbox } from "@/components/ui/checkbox";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { TableCell, TableRow } from "@/components/ui/table";
import { IconSearch } from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import CustomTable from "../../../view/CustomTable";
import TablePagination from "../../../view/TablePagination";
import AddEditItemDialogController from "../controller/AddEditItemDialogController";
import ProductData from "../model/ProductData";

function SelectProductSection({ formId, initialSelectedSku, onSubmit }: { formId: string, initialSelectedSku?: string, onSubmit: (sku: string) => void }) {
    const [selectedSku, setSelectedSku] = useState(initialSelectedSku || "")

    const [products, setProducts] = useState<ProductData[]>([])
    const [totalPage, setTotalPage] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)

    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
    const [searchLoading, setSearchLoading] = useState(false)
    const searchDebouncer = useRef<NodeJS.Timeout | null>(null)

    const handleSearch = (searchValue: string) => {
        setSearchQuery(searchValue)
        setSearchLoading(true)
        if (searchDebouncer.current) {
            clearTimeout(searchDebouncer.current)
        }
        searchDebouncer.current = setTimeout(() => {
            setCurrentPage(1)
            setDebouncedSearchQuery(searchValue)
        }, 500)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()

        if (selectedSku.length <= 0) {
            toast.error("Silahkan pilih produk")
        } else {
            onSubmit(selectedSku)
        }
    }

    const fetchProducts = useCallback(async () => {
        const payload = await AddEditItemDialogController.getProducts(currentPage, debouncedSearchQuery)

        if (payload.isSuccess) {
            setProducts(payload.data)
            setTotalPage(payload.totalPages)
        } else {
            toast.error(payload.message)
        }
        setSearchLoading(false)
    }, [currentPage, debouncedSearchQuery])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    return (
        <form id={formId} className="mt-5" onSubmit={handleSubmit}>
            <InputGroup>
                <InputGroupAddon>
                    <IconSearch />
                </InputGroupAddon>

                <InputGroupInput placeholder="Cari produk..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)} />

                {searchLoading && (
                    <InputGroupAddon align="inline-end">
                        <Spinner />
                    </InputGroupAddon>
                )}
            </InputGroup>

            <div className="overflow-auto h-[300px]">
                <CustomTable headers={["", "SKU", "Nama Produk", "Stok"]}>
                    {
                        products.map((product) => (
                            <TableRow key={product.sku}>
                                <TableCell>
                                    <Checkbox checked={product.sku === selectedSku} onCheckedChange={(checked) => setSelectedSku(checked ? product.sku : "")} />
                                </TableCell>
                                <TableCell>{product.sku}</TableCell>
                                <TableCell>{product.productName}</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                            </TableRow>
                        ))
                    }
                </CustomTable>
                <TablePagination currentPage={currentPage} maxPage={totalPage} onChangePage={(page) => setCurrentPage(page)} />
            </div>
        </form>
    )
}

export default SelectProductSection;