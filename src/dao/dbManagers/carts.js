import cartsModel from "../models/carts.js";

export default class Carts {
    constructor() {
        // console.log("Working carts with database in mongodb")
    }
    saveCart = async (cart) => {
        let result = await cartsModel.create(cart);
        return result;
    }
    getCartById = async (cartId) => {
        try {
            const cart = await cartsModel.findById(cartId).lean();
            return cart;
        } catch (error) {
            throw new Error("Error al obtener el carrito por ID");
        }
    }
    // "findByIdAndUpdate" actualiza un carrito en MongoDB por su ID.  
    updateCart = async (cartId, updatedCart) => {
        try {
            const result = await cartsModel.findByIdAndUpdate(cartId, updatedCart, { new: true });
            return result; // El argumento { new: true } asegura que se devuelva el carrito actualizado después de la actualización.
        } catch (error) {
            throw new Error("Error al actualizar el carrito");
        }
    }
}