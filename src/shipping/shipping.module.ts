import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';
import { ShippingRepository } from './repository';
import { Shipping } from '../entities/shipping.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shipping])],
  controllers: [ShippingController],
  providers: [ShippingService, ShippingRepository],
  exports: [ShippingService, ShippingRepository],
})
export class ShippingModule {}
