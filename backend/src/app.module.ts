import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { StoreModule } from './store/store.module';
import { SupplierModule } from './supplier/supplier.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { StockModule } from './stock/stock.module';
import { SaleModule } from './sale/sale.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { EnumsModule } from './enums/enums.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    StoreModule,
    SupplierModule,
    CategoryModule,
    ProductModule,
    StockModule,
    SaleModule,
    ReviewModule,
    UserModule,
    AdminModule,
    EnumsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
