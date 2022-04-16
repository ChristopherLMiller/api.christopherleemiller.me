import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class WebhooksService {
  constructor(
    private httpService: HttpService,
    private readonly logger: PinoLogger,
  ) {}

  async sendDiscordMessage(message: string) {
    try {
      const result = this.httpService
        .post(
          process.env.DISCORDBOT_WEBHOOK_URL,
          JSON.stringify({
            username: 'Miller Time API',
            avatar_url: '',
            content: message,
          }),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .pipe(map((response) => response.data));

      this.logger.info(await firstValueFrom(result));
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
