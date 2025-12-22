const Routes = {
    PAYMENT_METHOD: {
        GET: "/payment-method",
        ADD: "/payment-method/add",
        EDIT: (id: string) => `/payment-method/edit/${id}`,
    },

    PURCHASE: {
        GET: "/purchase",
        GET_BY_ID: (id: string) => `/purchase/${id}`,
        ADD: "/purchase/add",
        EDIT_BY_ID: (id: string) => `/purchase/edit/${id}`,
    },

    CUSTOMER: {
        DEFAULT: "/customer",
        ADD: "/customer/add",
        EDIT: (id: string) => `/customer/edit/${id}`,
    },

    SALES: {
        DEFAULT: "/sales",
        ADD: "/sales/add"
    },

    PAYMENT_METHOD_API: {
        CREATE: "/api/payment-method/create",
        UPDATE: (id: string) => `/api/payment-method/${id}/update`,
        DELETE: (id: string) => `/api/payment-method/${id}/delete`,
        GET: "/api/payment-method/get",
        GET_BY_ID: (id: string) => `/api/payment-method/${id}/get`,
    },

    STOCK_API: {
        DEFAULT: "/api/stock",
        BY_ID: (id: string) => `/api/stock/${id}`,
    },

    PRODUCTS_API: {
        GET_BY_ID: (id: string) => `/api/products/get/${id}`,
    },

    CUSTOMER_API: {
        DEFAULT: "/api/customer",
        BY_ID: (id: string) => `/api/customer/${id}`,
    },

    STORE_PROFILE_API: {
        GET: "/api/store/get?id=STORE",
        UPDATE: "api/store/update?id=STORE"
    },

    TRANSACTION_API: {
        DEFAULT: "/api/transaction"
    }
}

export default Routes;