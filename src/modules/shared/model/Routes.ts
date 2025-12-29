const Routes = {
    PAYMENT_METHOD: {
        GET: "/payment-method",
        ADD: "/payment-method/add",
        EDIT: (id: string) => `/payment-method/edit/${encodeURIComponent(id)}`,
    },

    PURCHASE: {
        GET: "/purchase",
        GET_BY_ID: (id: string) => `/purchase/${encodeURIComponent(id)}`,
        ADD: "/purchase/add",
        EDIT_BY_ID: (id: string) => `/purchase/edit/${encodeURIComponent(id)}`,
    },

    CUSTOMER: {
        DEFAULT: "/customer",
        ADD: "/customer/add",
        EDIT: (id: string) => `/customer/edit/${encodeURIComponent(id)}`,
    },

    SALES: {
        DEFAULT: "/sales",
        ADD: "/sales/add",
        EDIT: (id: string) => `/sales/edit/${encodeURIComponent(id)}`,
        GET_BY_ID: (id: string) => `/sales/${encodeURIComponent(id)}`,
    },

    USER_MANAGEMENT: {
        GET: "/user-management",
        ADD: "/user-management/add",
        EDIT: (id: string) => `/user-management/edit/${encodeURIComponent(id)}`,
    },

    PAYMENT_METHOD_API: {
        CREATE: "/api/payment-method/create",
        UPDATE: (id: string) => `/api/payment-method/${encodeURIComponent(id)}/update`,
        DELETE: (id: string) => `/api/payment-method/${encodeURIComponent(id)}/delete`,
        GET: "/api/payment-method/get",
        GET_BY_ID: (id: string) => `/api/payment-method/${encodeURIComponent(id)}/get`,
    },

    STOCK_API: {
        DEFAULT: "/api/stock",
        BY_ID: (id: string) => `/api/stock/${encodeURIComponent(id)}`,
    },

    PRODUCTS_API: {
        GET_BY_ID: (id: string) => `/api/products/get/${encodeURIComponent(id)}`,
    },

    CUSTOMER_API: {
        DEFAULT: "/api/customer",
        BY_ID: (id: string) => `/api/customer/${encodeURIComponent(id)}`,
    },

    STORE_PROFILE_API: {
        GET: "/api/store/get?id=STORE",
        UPDATE: "api/store/update?id=STORE"
    },

    TRANSACTION_API: {
        DEFAULT: "/api/transaction",
        BY_ID: (id: string) => `/api/transaction/${encodeURIComponent(id)}`
    },    

    USER_API: {
        DEFAULT: "/api/user",
        BY_ID: (id: string) => `/api/user/${encodeURIComponent(id)}`,
    },

    DASHBOARD_API: {
        DEFAULT: "/api/dashboard"
    }
}

export default Routes;