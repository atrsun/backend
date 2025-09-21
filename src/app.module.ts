import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ClsModule } from 'nestjs-cls';
import { AuthModule } from './modules/auth/auth.module.ts';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module.ts';
import { UserModule } from './modules/user/user.module.ts';
import { ApiConfigService } from './shared/services/api-config.service.ts';
import { SharedModule } from './shared/shared.module.ts';
import { AxiosModule } from './modules/axios/custom-axios.module.ts';
import { HolooModule } from './modules/holoo/holoo.module.ts';
import { MongooseModule } from '@nestjs/mongoose';
import { PreInvoiceModule } from './modules/pre-invoice/pre-invoice.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => ({
        throttlers: [configService.throttlerConfigs],
      }),
      inject: [ApiConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [SharedModule],
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) => {
        const { uri } = configService.mongooseConfigs;

        return {
          uri,
        };
      },
    }),
    HealthCheckerModule,
    AxiosModule,
    HolooModule,
    PreInvoiceModule,
    InvoiceModule,
    ScheduleModule.forRoot()
  ],
  providers: [],
})
export class AppModule {}
