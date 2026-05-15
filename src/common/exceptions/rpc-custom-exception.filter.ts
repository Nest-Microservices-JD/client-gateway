import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const rpcError: string | object = exception.getError();

    if ((rpcError as string).toString().includes('Empty response')) {
      return response.status(500).json({
        status: 500,
        message: (rpcError as string)
          .toString()
          .substring(0, (rpcError as string).toString().indexOf('(') - 1),
      });
    }

    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const status: number = Number.isNaN(rpcError.status)
        ? Number(rpcError.status)
        : 400;

      return response.status(status).json(rpcError);
    }

    response.status(400).json({
      status: 400,
      message: rpcError,
      error: 'Unauthorized',
    });
  }
}
