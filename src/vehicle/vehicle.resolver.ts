import { Resolver, Args, Query, Mutation } from '@nestjs/graphql'
import { VehicleService } from './vehicle.service';
import { VehicleDTO } from './vehicle.dto';

const endpoint = 'http://localhost:5000/graphql';
@Resolver('vehicle')
export class VehicleResolver{
    constructor(private vehicleService: VehicleService) {}  

    @Query()
    async getVehicleByAge(@Args('vehicleAge') vehicleAge: string) {
    return await this.vehicleService.getVehicleByAge(vehicleAge);
    }

}