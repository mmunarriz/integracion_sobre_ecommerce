import fs from 'fs';
import __dirname from '../../utils.js';

const path = __dirname + '/files/carrito.json';

export default class Carts {
    constructor() {
        console.log(`Working with carts on path: ${path}`);
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

    saveCart = async (carts) => {
        try {
            await fs.promises.writeFile(path, JSON.stringify(carts, null, 2), 'utf8');
        } catch (error) {
            console.log("No se pudo escribir el archivo: " + error);
            throw error;
        }
    }
}