import cartsModel from "../models/carts.js";

export default class Carts {
    constructor() {
        console.log("Working carts with database in mongodb")
    }
    getAll = async () => {
        let carts = await cartsModel.find().lean();
        return carts;
    }
    saveCart = async (cart) => {
        let result = await cartsModel.create(cart);
        return result;
    }
    // updateCart = async (id, cart) => {
    //     let result = await cartsModel.updateOne({ _id: id }, cart)
    //     return result;
    // }
}