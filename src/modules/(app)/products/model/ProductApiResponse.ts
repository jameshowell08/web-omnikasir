export interface ProductCategoryModel {
    categoryId: string | null;
    categoryName: string | null;
    description: string | null;
}

export interface ProductStockBreakdownModel {
    totalStock: number | null;
    reserved: number | null;
    inTransit: number | null;
    available: number | null;
}

export interface ProductInventoryModel {
    inventoryId: string | null;
    quantity: number | null;
    reserved: number | null;
    inTransit: number | null;
    inventoryNote: string | null;
}

export interface ProductSerialNumberModel {
    serialId: string | null;
    serialNo: string | null;
    status: string | null;
    warrantyUntil: string | null;
}

export interface ProductTransactionModel {
    transactionId: string | null;
    transactionDate: string | null;
    quantity: number | null;
    price: string | null;
}

export interface ProductApiResponseData {
    skuId: string | null;
    sku: string | null;
    barcode: string | null;
    productId: string | null;
    productName: string | null;
    brand: string | null;
    description: string | null;
    category: ProductCategoryModel | null;
    priceSell: string | null;
    priceBuy: string | null;
    stock: number | null;
    stockBreakdown: ProductStockBreakdownModel | null;
    inventories: ProductInventoryModel[] | null;
    serialRequired: boolean | null;
    availableSerialNumbers: number | null;
    serialNumbers: ProductSerialNumberModel[] | null;
    attributes: Record<string, any> | null;
    createdDate: string | null;
    modifiedDate: string | null;
    productCreatedDate: string | null;
    productModifiedDate: string | null;
    recentTransactions: ProductTransactionModel[] | null;
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