import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchema } from './schemas/cart.schema';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Cart',  schema: CartSchema }])],
  providers: [CartService, JwtStrategy],
  controllers: [CartController]
})
export class CartModule {}
