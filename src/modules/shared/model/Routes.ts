const Routes = {
    PAYMENT_METHOD_API: {
        CREATE: "/api/category/create",
        UPDATE: (id: string) => `/api/category/${id}/update`,
        DELETE: (id: string) => `/api/category/${id}/delete`,
        GET: "/api/category/get",
        GET_BY_ID: (id: string) => `/api/category/${id}/get`,
    }
}

export default Routes;