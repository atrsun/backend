import { Inject, UnprocessableEntityException } from '@nestjs/common';
import type { InternalAxiosRequestConfig, AxiosInstance } from 'axios';
import { AXIOS_INSTANCE_TOKEN } from '../../modules/axios/custom-axios.module';
import { ApiConfigService } from '../../shared/services/api-config.service';
import type { HolooLogin } from './types/holoo-login.type';
import { RedisService } from '../../shared/services/redis.service';

export class HolooService {
  constructor(
    @Inject(AXIOS_INSTANCE_TOKEN)
    private readonly axiosInstance: AxiosInstance,
    private readonly configService: ApiConfigService,
    private readonly redisService: RedisService,
  ) {
    this.setupHolooAuthInterceptor();
  }

  private setupHolooAuthInterceptor() {
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (config?.method?.toUpperCase() === 'POST') {
          config.headers.set({
            accept: 'application/json',
            'Content-Type': 'application/json',
          });
        }

        if (config.url?.includes('/Login')) {
          return config;
        }

        if (!config.headers.Authorization) {
          const token = await this.getHolooToken();
          config.headers.Authorization = token;
        }

        return config;
      },
    );
  }

  async loginToHoloo(): Promise<HolooLogin | null> {
    const { dbName, password, userName } = this.configService.holooAuthConfig;

    const data = {
      userinfo: { dbname: dbName, username: userName, userpass: password },
    };

    try {
      const response = await this.axiosInstance.post(
        '/Login',
        JSON.stringify(data),
      );

      const result: HolooLogin = response.data;

      if (result.Login.State) {
        return result;
      }

      throw new UnprocessableEntityException(
        'Holoo service is not available right now.',
      );
    } catch (error) {
      throw new UnprocessableEntityException(
        'Holoo service is not available right now.',
      );
    }
  }

  async getHolooToken(): Promise<string> {
    const token = await this.redisService.getCachedData('holoo_token');

    if (token) {
      return token;
    }

    const loginResponse = await this.loginToHoloo();

    const newToken = loginResponse!.Login.Token;

    await this.redisService.cacheData('holoo_token', newToken, 72000); // 72000 is 22 hours

    return newToken;
  }

  get axios() {
    return this.axiosInstance;
  }

  get getCurrentTime(): { date: string; time: string; numberTime: number } {
    const now = new Date();
    const numberTime = now.getTime();

    // Extract the date in 'YYYY-MM-DD' format
    const date = now.toISOString().split('T')[0]!.replaceAll('-', '/');

    // Extract the time in 'HH:mm' format
    const time = now.toTimeString().slice(0, 5);

    return { date, time, numberTime };
  }
}
