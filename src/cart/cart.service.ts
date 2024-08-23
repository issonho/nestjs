import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Model } from 'mongoose';
import { ItemDTO } from './dtos/item.dto';

@Injectable()
export class CartService {
    constructor(@InjectModel('Cart') private readonly cartModel: Model<CartDocument>) {}

    async addItemToCart(userId: string, itemDTO: ItemDTO): Promise<CartDocument> {
        const { productID, quantity, price } = itemDTO;
        const subTotalPrice = quantity * price;

        const cart = await this.getCart(userId);

        if (!cart) {
            const newCart = this.createCart(userId, itemDTO, subTotalPrice, subTotalPrice);
            return newCart;
        }

        const itemIndex = cart.items.findIndex(item =>  item.productID === productID);

        if (itemIndex === -1) {
            cart.items.push({ ...itemDTO, subTotalPrice });
            this.recalculateCart(cart);
            cart.save();

            return cart;
        }

        var item = cart.items[itemIndex];

        item.quantity = item.quantity + quantity;
        item.subTotalPrice = item.quantity * item.price;
        this.recalculateCart(cart);

        cart.items[itemIndex] = item;

        return cart.save();
    }

    async createCart(userId: string, itemDTO: ItemDTO, subTotalPrice: number, totalPrice: number): Promise<CartDocument> {
        const cart = this.cartModel.create({userId, items: [{...itemDTO, subTotalPrice}], totalPrice: totalPrice});
        return cart;
    }

    private recalculateCart(cart: CartDocument) {
        cart.totalPrice = 0;
        cart.items.forEach(item => {
            cart.totalPrice += item.subTotalPrice;
        });
    }

    async getCart(userId: string): Promise<CartDocument> {
        return await this.cartModel.findOne({ userId });
    }

    async removeItemFromCart(userId: string, productID: string): Promise<CartDocument> {
        const cart = await this.getCart(userId);
        const itemIndex = cart.items.findIndex(item => item.productID === productID);

        if (itemIndex === -1) {
            return cart;
        }

        cart.items.splice(itemIndex, 1);
        this.recalculateCart(cart);

        return cart.save();
    }

    async deleteCart(userId: string): Promise<CartDocument> {
        return await this.cartModel.findOneAndDelete({ userId });
    }
}
