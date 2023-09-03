import fs from 'fs';
import __dirname from '../../utils.js';

const path = __dirname + '/files/productos.json';

export default class Products {
    constructor() {
        console.log(`Working with products on path: ${path}`);
    }

    getAll = async () => {
        if (fs.existsSync(path)) {
            try {
                let data = await fs.promises.readFile(path, 'utf8');
                return JSON.parse(data);
            } catch (error) {
                console.log("No se pudo leer el archivo: " + error);
                throw error;
            }
        } else {
            return [];
        }
    }

    saveProduct = async (products) => {
        try {
            await fs.promises.writeFile(path, JSON.stringify(products, null, 2), 'utf8');
        } catch (error) {
            console.log("No se pudo escribir el archivo: " + error);
            throw error;
        }
    }
}
