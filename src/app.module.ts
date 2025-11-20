import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {
  AppService,
  DataLouderUser,
  DataLoaderCategory,
  DataLoaderBusiness,
  DataLoaderProduct,
  DataLoaderOrder,
  DataLoaderOrderDetail,
  DataLoaderShipping,
} from './app.service';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { CredentialModule } from './credential/credential.module';
import { CredentialController } from './credential/credential.controller';
import { CredentialService } from './credential/credential.service';
import { BusinessModule } from './business/business.module';
import { BusinessController } from './business/business.controller';
import { BusinessService } from './business/business.service';
import { ProductModule } from './product/product.module';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { CategoryModule } from './category/category.module';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
// removed CartModule and related imports
import { OrderModule } from './order/order.module';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { ShippingModule } from './shipping/shipping.module';
import { ShippingController } from './shipping/shipping.controller';
import { ShippingService } from './shipping/shipping.service';
import typeorm from './config/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetailModule } from './order_detail/order_detail.module';
import { User } from './entities/user.entity';
import { Credential } from './entities/credential.entity';
import { Category } from './entities/categories.entity';
import { Business } from './entities/business.entity';
import { Product } from './entities/products.entity';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order_detail.entity';
import { Shipping } from './entities/shipping.entity';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm') ?? {},
    }),
    TypeOrmModule.forFeature([
      User,
      Credential,
      Category,
      Business,
      Product,
      Order,
      OrderDetail,
      Shipping,
    ]),
    UserModule,
    CredentialModule,
    BusinessModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    ShippingModule,
    OrderDetailModule,
    AuthModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DataLouderUser,
    DataLoaderCategory,
    DataLoaderBusiness,
    DataLoaderProduct,
    DataLoaderOrder,
    DataLoaderOrderDetail,
    DataLoaderShipping,
  ],
})
export class AppModule {}
