import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocumnet } from './schemas/product.schema';
import { CreateProductDTO } from './dtos/create-product.dto';
import { FilterProductDTO } from './dtos/filter-product.dto';

@Injectable()
export class ProductService {
    constructor(@InjectModel('Product') private readonly productModel: Model<ProductDocumnet>) {};

    async getAllProducts(): Promise<Product[]> {
        const products = await this.productModel.find().exec();
        return products;
    }

    async getProduct(id: string): Promise<Product> {
        const product = await this.productModel.findById(id).exec();
        return product;
    }

    async getFilterProducts(filterProductDTO: FilterProductDTO): Promise<Product[]> {
        const { search, category } = filterProductDTO;
        let products = await this.getAllProducts();

        if (search) {
            products.filter(product => product.name.includes(search) ||
            product.description.includes(search));
        }

        if (category) {
            products.filter(product => product.category === category);
        }

        return products;
    }

    async addProduct(createProductDTO: CreateProductDTO): Promise<Product> {
        const newProduct = await this.productModel.create(createProductDTO);
        return newProduct.save();
    }

    async updateProduct(id: string, createProductDTO: CreateProductDTO): Promise<Product> {
        const updatedProduct = await this.productModel.findByIdAndUpdate(id, createProductDTO, { new: true });
        return updatedProduct;
    }

    async deleteProduct(id: string): Promise<any>{
        return await this.productModel.findByIdAndDelete(id);
    }
}
