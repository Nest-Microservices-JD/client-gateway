import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from '../config';
import { Token, User } from './decorators';
import { LoginUserDto, RegisterUserDto } from './dto';
import { AuthGuard } from './guards';
import type { CurrentUser } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly natsClient: ClientProxy,
  ) {}

  @Post('register')
  public registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.natsClient.send('auth.register.user', registerUserDto).pipe(
      catchError((error) => {
        throw new RpcException(error as object);
      }),
    );
  }

  @Post('login')
  public loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.natsClient.send('auth.login.user', loginUserDto).pipe(
      catchError((error) => {
        throw new RpcException(error as object);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  public verifyUser(@User() user: CurrentUser, @Token() token: string) {
    return {
      user,
      token
    };
    /* return this.natsClient
      .send('auth.verify.user', { msg: 'message from verify-client' })
      .pipe(
        catchError((error) => {
          throw new RpcException(error as object);
        }),
      ); */
  }
}
