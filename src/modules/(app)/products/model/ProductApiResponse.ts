export interface ProductApiResponseData {
    sku: string | null;
    productName: string | null;
    brand: string | null;
    categoryName: string | null;
    quantity: number | null;
    sellingPrice: number | null;
}
export interface ProductApiResponse {
    status: boolean | null;
    message: string | null;
    page: number | null;
    limit: number | null;
    totalRows: number | null;
    totalPages: number | null;
    data: ProductApiResponseData[] | null;
}