import { Module } from '@nestjs/common';
import { NatsModule } from '../transports/nats.module';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [],
  exports: [],
  imports: [NatsModule],
})
export class AuthModule {}
