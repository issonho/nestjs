import { Body, Controller, Delete, NotFoundException, Param, Post, Request, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './schemas/cart.schema';
import { ItemDTO } from './dtos/item.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/roles.enum';

@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {
    }

    @UseGuards(JwtAuthGuard)
    @Roles(Role.User)
    @Post('/')
    async addItemToCart(@Request() req: any, @Body() itemDTO: ItemDTO): Promise<any> {
        const cart = this.cartService.addItemToCart(req.user.userId, itemDTO);

        return cart;
    }

    @UseGuards(JwtAuthGuard)
    @Roles(Role.User)
    @Delete('/')
    async removeItemFromCart(@Request() req: any, @Body() { productID }): Promise<any> {
        const cart = this.cartService.removeItemFromCart(req.user.userId, productID);

        if (!cart) {
            throw new NotFoundException('Item does not exist!');
        }

        return cart;
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.User)
    async deleteCart(@Param('id') userId: string): Promise<any> {
        const cart = await this.cartService.deleteCart(userId);

        if (!cart) {
            throw new NotFoundException("Cart does not exist!");
        }

        return cart;
    }
}
