import { HttpModule, Module } from '@nestjs/common';
import { VehicleResolver } from './vehicle.resolver';

import { BullModule } from '@nestjs/bull';
import { VehicleService } from './vehicle.service';
import { AppGateway } from '../app.gateway';
import { VehicleCsvConsumer } from './vehiclecsv.consumer';

@Module({
  imports:[HttpModule,BullModule.registerQueue({
    name: 'downloadCsv'
  })],
  providers: [VehicleService,VehicleResolver,AppGateway,VehicleCsvConsumer]
})
export class VehicleModule {}
