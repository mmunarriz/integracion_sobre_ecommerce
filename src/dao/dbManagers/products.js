import productsModel from "../models/products.js"

export default class Products {
    constructor() {
        // console.log(`Working products with Database persistence in mongodb`)
    }
    getAll = async () => {
        let products = await productsModel.find();
        return products.map(product => product.toObject())
    }
    getProductById = async (id) => {
        try {
            const product = await productsModel.findById(id);
            if (!product) return null; // Retornar null si el producto no se encuentra
            return product.toObject();
        } catch (error) {
            throw error; // Propagar cualquier error que ocurra al llamar a findById
        }
    }
    isProductCodeExist = async (code) => {
        const existingProduct = await productsModel.findOne({ code });
        return !!existingProduct; // Retornar True o False si se encontro un producto con el mismo code o no.
    }
    saveProduct = async (product) => {
        let result = await productsModel.create(product);
        return result;
    }
    updateProduct = async (id, product) => {
        let result = await productsModel.updateOne({ _id: id }, product)
        return result;
    }
    deleteProduct = async (id) => {
        const result = await productsModel.deleteOne({ _id: id });
        return result;
    }
}
