export class Lining {

    name: string;
    description: string;
    price: number;
    image_urls: string[];
    lining_SKU: string;

    constructor(init: any) {
        for (const key in init) {
            if (init.hasOwnProperty(key)) {
                this[key] = init[key];
            }
        }
    }
}