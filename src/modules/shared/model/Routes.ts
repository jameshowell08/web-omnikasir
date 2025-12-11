const Routes = {
    PAYMENT_METHOD_API: {
        CREATE: "/api/payment-method/create",
        UPDATE: (id: string) => `/api/payment-method/${id}/update`,
        DELETE: (id: string) => `/api/payment-method/${id}/delete`,
        GET: "/api/payment-method/get",
        GET_BY_ID: (id: string) => `/api/payment-method/${id}/get`,
    }
}

export default Routes;