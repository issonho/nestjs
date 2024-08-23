import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";

@Schema()
export class Item {
    @Prop({ type: SchemaTypes.ObjectId, ref: 'Product' })
    productID: string;

    @Prop()
    name: string;

    @Prop()
    quantity: number;

    @Prop()
    price: number;

    @Prop()
    subTotalPrice: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);