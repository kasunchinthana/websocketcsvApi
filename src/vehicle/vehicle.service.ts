import { HttpService, Injectable, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppGateway } from '../app.gateway';
import { InjectQueue } from '@nestjs/bull';
import { request, gql } from 'graphql-request'
import { Queue } from 'bull';


const endpoint = 'http://localhost:5000/graphql';

@Injectable()
export class VehicleService {
    constructor(private eventsGateway: AppGateway,private httpService: HttpService,@InjectQueue('downloadCsv') private  csvDownloadQueue: Queue) {} 

    @UseInterceptors(FileInterceptor("file", { dest: "./uploads" }))
    async getVehicleByAge(vehicleAge: string) {
        const  query = gql `query vehicleQuery{
            allVehicles(filter: {
              ageOfVehicle: {  greaterThan :"${vehicleAge}"}
            }){
              nodes {
                nodeId
                id
                firstName
                lastName
                email
                carMake
                carModel
                vinNumber
                manufacturedDate
                ageOfVehicle
              }
            }
          }`;
          
        let output = await request(endpoint,query)
        this.eventsGateway.server.emit('emitmsg', 'get datan from db');
        const job = await this.csvDownloadQueue.add('downloadCsv',
        {
          file: output.allVehicles.nodes
        });
         this.eventsGateway.server.emit('alertToClient', 'get datan from db');
         await this.eventsGateway.sendToAll("alertToClient");
       
        return output.allVehicles.nodes;
    }
}


