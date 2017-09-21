export class Product {

    name: string;
    description: string;
    category: string;
    price: number;
    extras: any;
    customisation: any;
    image_urls: string[];
    product_SKU: string;

    constructor(init: any) {
        for (const key in init) {
            if (init.hasOwnProperty(key)) {
                this[key] = init[key];
            }
        }
    }
}
