class CustomerTableData {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public phone: string,
        public address: string,
        public isActive: boolean
    ) {}
}

export default CustomerTableData;