import { Module, type DynamicModule } from '@nestjs/common';
import axios, { type CreateAxiosDefaults } from 'axios';

export const AXIOS_INSTANCE_TOKEN = 'AXIOS_INSTANCE_TOKEN';

@Module({})
export class AxiosModule {
  static register(config: CreateAxiosDefaults): DynamicModule {
    const provider = {
      provide: AXIOS_INSTANCE_TOKEN,
      useFactory: () => {
        return axios.create(config);
      },
    };

    return {
      module: AxiosModule,
      providers: [provider],
      exports: [provider],
    };
  }
}
