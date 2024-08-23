import { Controller, Post, Get, Put, Delete, Body, Param, Query, NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dtos/create-product.dto';
import { FilterProductDTO } from './dtos/filter-product.dto';

@Controller('store/products')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get('/')
    async getProducts(@Query() filterProductDTO: FilterProductDTO) {
        if (Object.keys(filterProductDTO).length) {
            const filterProducts = this.productService.getFilterProducts(filterProductDTO);
            
            return filterProductDTO;
        } else {
            const allProducts = await this.productService.getAllProducts();

            return allProducts;
        }
    }

    @Get('/:id')
    async getProduct(@Param('id') id: string) {
        const product = await this.productService.getProduct(id);
        if (!product) {
            throw new NotFoundException('Product does not exist!');
        }
        return product;
    }

    @Post('/')
    async addProduct(@Body() createProductDTO: CreateProductDTO) {
        const product = this.productService.addProduct(createProductDTO);
        return product;
    }

    @Put('/:id')
    async updateProduct(@Param('id') id: string, @Body() createProductDTO: CreateProductDTO) {
        const updatedProduct = this.productService.updateProduct(id, createProductDTO);
        if(!updatedProduct) {
            throw new NotFoundException('Product does not exist!');
        }
        return updatedProduct;
    }

    @Delete('/:id')
    async deleteProduct(@Param('id') id: string) {
        const product = await this.productService.deleteProduct(id);
        if(!product) {
            throw new NotFoundException('Product does not exist!');
        }
    }
}
