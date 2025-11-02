export class Product {

    constructor(
        public sku: string,
        public name: string,
        public category: string,
        public stock: number,
        public price: number,
    ) { }

    public formatRupiah(): string {
        return 'Rp' + this.price.toLocaleString('id-ID');
    }
}