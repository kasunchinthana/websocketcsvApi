import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { BullModule } from '@nestjs/bull';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './util/http-error.filter';
import { LoggingInterceptor } from './util/logging.intercepter';

@Module({
  imports: [GraphQLModule.forRoot({
    typePaths:['./**/*.graphql']
  }), BullModule.forRoot({
    redis: {
      host: 'localhost',
      port: 6379,
    },
  }),SocketModule, VehicleModule],
  controllers: [AppController],
  providers: [AppService,{
    provide: APP_FILTER,
    useClass:HttpErrorFilter
  },{
    provide:APP_INTERCEPTOR,
    useClass:LoggingInterceptor
  }],
})
export class AppModule {}
