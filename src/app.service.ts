import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Credential } from './entities/credential.entity';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import { Category } from './entities/categories.entity';
import { Business } from './entities/business.entity';
import { Product } from './entities/products.entity';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order_detail.entity';
import { Shipping, EstadoEnvio } from './entities/shipping.entity';
import { PayMethod } from './enum/pay_method.enum';
import { OrderStatus } from './enum/order_status.enum';
import { PayStatus } from './enum/pay_status.enum';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Te doy la bienvenida a AgroMarket';
  }
}

@Injectable()
export class DataLouderUser implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userDataBase: Repository<User>,
    @InjectRepository(Credential)
    private readonly credentialDataBase: Repository<Credential>,
  ) {}

  async onModuleInit() {
    const userCount = await this.userDataBase.count();
    if (userCount === 0) {
      console.log('Creando datos iniciales de User en la base de datos ...');
      const querryRunner =
        this.userDataBase.manager.connection.createQueryRunner();
      await querryRunner.connect();
      await querryRunner.startTransaction();
      try {
        const rawData = fs.readFileSync('./src/utils/data.json', 'utf-8');
        const user = JSON.parse(rawData);

        await Promise.all(
          user.map(async (user) => {
            const newUser = this.userDataBase.create({
              cedula: user.cedula,
              name: user.name,
              last_name: user.last_name,
              phone: user.phone,
              email: user.email,
              address: user.address,
              role: user.role,
              status: user.status,
              creation_date: user.creation_date,
              update_date: user.update_date,
            });

            await querryRunner.manager.save(newUser);

            const newCredential = this.credentialDataBase.create({
              user_name: user.user_name,
              password: await bcrypt.hash(user.password, 10),
              last_access_date: user.last_access_date,
              creation_date: user.creation_date,
              update_date: user.update_date,
              user: newUser,
            });

            await querryRunner.manager.save(newCredential);
          }),
        );

        await querryRunner.commitTransaction();
        console.log('Datos de User cargados exitosamente.');
      } catch (error) {
        console.error('Error al cargar los datos de User:', error);
        await querryRunner.rollbackTransaction();
      } finally {
        await querryRunner.release();
      }
    } else {
      console.log('Los datos de User ya existen en la base de datos.');
    }
  }
}

@Injectable()
export class DataLoaderCategory implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private readonly categoryDb: Repository<Category>,
  ) {}

  async onModuleInit() {
    const count = await this.categoryDb.count();
    if (count === 0) {
      const runner = this.categoryDb.manager.connection.createQueryRunner();
      await runner.connect();
      await runner.startTransaction();
      try {
        const raw = fs.readFileSync('./src/utils/categories.json', 'utf-8');
        const categories = JSON.parse(raw);
        for (const c of categories) {
          const entity = this.categoryDb.create({
            name: c.name,
            description: c.description ?? null,
            isActive: c.isActive ?? true,
            createAt: c.createAt ? new Date(c.createAt) : new Date(),
            updateAt: c.updateAt ? new Date(c.updateAt) : new Date(),
          });
          await runner.manager.save(entity);
        }
        await runner.commitTransaction();
        console.log('Datos de Category cargados exitosamente.');
      } catch (error) {
        console.error('Error al cargar las Categorías:', error);
        await runner.rollbackTransaction();
      } finally {
        await runner.release();
      }
    }
  }
}

@Injectable()
export class DataLoaderBusiness implements OnModuleInit {
  constructor(
    @InjectRepository(Business)
    private readonly businessDb: Repository<Business>,
    @InjectRepository(User)
    private readonly userDb: Repository<User>,
  ) {}

  async onModuleInit() {
    const count = await this.businessDb.count();
    if (count === 0) {
      const runner = this.businessDb.manager.connection.createQueryRunner();
      await runner.connect();
      await runner.startTransaction();
      try {
        const raw = fs.readFileSync('./src/utils/business.json', 'utf-8');
        const businesses = JSON.parse(raw);
        for (const b of businesses) {
          const owner = await this.userDb.findOne({
            where: { email: b.user_email },
          });
          if (!owner) continue;
          const entity = this.businessDb.create({
            user: owner,
            registro_negocio: b.registro_negocio,
            nombre_negocio: b.nombre_negocio,
            ubicacion: b.ubicacion ?? null,
            descripcion: b.descripcion ?? null,
            estado: b.estado ?? true,
            fecha_creacion: b.fecha_creacion
              ? new Date(b.fecha_creacion)
              : new Date(),
            fecha_actualizacion: b.fecha_actualizacion
              ? new Date(b.fecha_actualizacion)
              : new Date(),
          });
          await runner.manager.save(entity);
        }
        await runner.commitTransaction();
        console.log('Datos de Business cargados exitosamente.');
      } catch (error) {
        console.error('Error al cargar los Negocios:', error);
        await runner.rollbackTransaction();
      } finally {
        await runner.release();
      }
    }
  }
}

@Injectable()
export class DataLoaderProduct implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private readonly productDb: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryDb: Repository<Category>,
    @InjectRepository(Business)
    private readonly businessDb: Repository<Business>,
  ) {}

  async onModuleInit() {
    const count = await this.productDb.count();
    if (count === 0) {
      const runner = this.productDb.manager.connection.createQueryRunner();
      await runner.connect();
      await runner.startTransaction();
      try {
        const raw = fs.readFileSync('./src/utils/products.json', 'utf-8');
        const products = JSON.parse(raw);
        for (const p of products) {
          const category = await this.categoryDb.findOne({
            where: { name: p.category_name },
          });
          const business = await this.businessDb.findOne({
            where: { nombre_negocio: p.business_name },
          });
          if (!category || !business) continue;
          const entity = this.productDb.create({
            productCode: p.productCode,
            name: p.name,
            stock: p.stock ?? 0,
            basePrice: p.basePrice,
            iva: p.iva ?? 0,
            isActive: p.isActive ?? true,
            description: p.description ?? null,
            imageUrl: p.imageUrl ?? null,
            createAt: p.createAt ? new Date(p.createAt) : new Date(),
            updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
            category,
            business,
          });
          await runner.manager.save(entity);
        }
        await runner.commitTransaction();
        console.log('Datos de Product cargados exitosamente.');
      } catch (error) {
        console.error('Error al cargar los Productos:', error);
        await runner.rollbackTransaction();
      } finally {
        await runner.release();
      }
    }
  }
}

@Injectable()
export class DataLoaderOrder implements OnModuleInit {
  constructor(
    @InjectRepository(Order)
    private readonly orderDb: Repository<Order>,
    @InjectRepository(User)
    private readonly userDb: Repository<User>,
  ) {}

  async onModuleInit() {
    const count = await this.orderDb.count();
    if (count === 0) {
      const runner = this.orderDb.manager.connection.createQueryRunner();
      await runner.connect();
      await runner.startTransaction();
      try {
        const raw = fs.readFileSync('./src/utils/orders.json', 'utf-8');
        const orders = JSON.parse(raw);
        for (const o of orders) {
          const user = await this.userDb.findOne({
            where: { email: o.user_email },
          });
          if (!user) continue;
          const entity = this.orderDb.create();
          entity.user = user;
          entity.total = o.total;
          entity.shipping_price = o.shipping_price;
          entity.pay_method = (o.pay_method as PayMethod) ?? PayMethod.CASH;
          entity.order_status =
            (o.order_status as OrderStatus) ?? OrderStatus.CREATED;
          entity.pay_status = (o.pay_status as PayStatus) ?? PayStatus.PENDING;
          entity.date_created = o.date_created
            ? new Date(o.date_created)
            : new Date();
          if (o.date_updated) entity.date_updated = new Date(o.date_updated);
          await runner.manager.save(entity);
        }
        await runner.commitTransaction();
        console.log('Datos de Order cargados exitosamente.');
      } catch (error) {
        console.error('Error al cargar las Órdenes:', error);
        await runner.rollbackTransaction();
      } finally {
        await runner.release();
      }
    }
  }
}

@Injectable()
export class DataLoaderOrderDetail implements OnModuleInit {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailDb: Repository<OrderDetail>,
    @InjectRepository(Order)
    private readonly orderDb: Repository<Order>,
    @InjectRepository(Product)
    private readonly productDb: Repository<Product>,
  ) {}

  async onModuleInit() {
    const count = await this.orderDetailDb.count();
    if (count === 0) {
      const runner = this.orderDetailDb.manager.connection.createQueryRunner();
      await runner.connect();
      await runner.startTransaction();
      try {
        const raw = fs.readFileSync('./src/utils/order_details.json', 'utf-8');
        const details = JSON.parse(raw);
        for (const d of details) {
          // localizar orden por email del usuario
          const orderList = await this.orderDb.find({
            where: { user: { email: d.order_user_email } },
            relations: ['user'],
          });
          const order = orderList[0];
          const product = await this.productDb.findOne({
            where: { name: d.product_name },
          });
          if (!order || !product) continue;
          const entity = this.orderDetailDb.create();
          entity.uuid_order = order;
          entity.product = product;
          entity.cant = d.cant;
          entity.iva_applied = d.iva_applied ?? 0;
          entity.discount = d.discount ?? 0;
          entity.subtotal = d.subtotal;
          entity.date_created = d.date_created
            ? new Date(d.date_created)
            : new Date();
          if (d.date_updated) entity.date_updated = new Date(d.date_updated);
          await runner.manager.save(entity);
        }
        await runner.commitTransaction();
        console.log('Datos de OrderDetail cargados exitosamente.');
      } catch (error) {
        console.error('Error al cargar los Detalles de Orden:', error);
        await runner.rollbackTransaction();
      } finally {
        await runner.release();
      }
    }
  }
}

@Injectable()
export class DataLoaderShipping implements OnModuleInit {
  constructor(
    @InjectRepository(Shipping)
    private readonly shippingDb: Repository<Shipping>,
    @InjectRepository(Order)
    private readonly orderDb: Repository<Order>,
  ) {}

  async onModuleInit() {
    const count = await this.shippingDb.count();
    if (count === 0) {
      const runner = this.shippingDb.manager.connection.createQueryRunner();
      await runner.connect();
      await runner.startTransaction();
      try {
        const raw = fs.readFileSync('./src/utils/shipping.json', 'utf-8');
        const shippings = JSON.parse(raw);
        for (const s of shippings) {
          const orderList = await this.orderDb.find({
            where: { user: { email: s.order_user_email } },
            relations: ['user'],
          });
          const order = orderList[0];
          if (!order) continue;
          const entity = this.shippingDb.create({
            order,
            fecha_emision: s.fecha_emision
              ? new Date(s.fecha_emision)
              : new Date(),
            fecha_entrega: s.fecha_entrega
              ? new Date(s.fecha_entrega)
              : undefined,
            estado_envio:
              (s.estado_envio as EstadoEnvio) ?? EstadoEnvio.PENDIENTE,
          });
          await runner.manager.save(entity);
        }
        await runner.commitTransaction();
        console.log('Datos de Shipping cargados exitosamente.');
      } catch (error) {
        console.error('Error al cargar los Envios:', error);
        await runner.rollbackTransaction();
      } finally {
        await runner.release();
      }
    }
  }
}
