import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, Observable } from 'rxjs';
import { PaginationDto } from '../common';
import { NATS_SERVICE } from '../config';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { AllFilterOrderResponse, OrderClient } from './interfaces';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  @Post()
  public create(
    @Body() createOrderDto: CreateOrderDto,
  ): Observable<OrderClient> {
    return this.client.send('createOrder', createOrderDto).pipe(
      catchError((error) => {
        throw new RpcException(error as unknown as object);
      }),
    );
  }

  @Get()
  public findAll(
    @Query() orderPaginationDto: OrderPaginationDto,
  ): Observable<AllFilterOrderResponse> {
    return this.client.send('findAllOrders', orderPaginationDto).pipe(
      catchError((error) => {
        throw new RpcException(error as unknown as object);
      }),
    );
  }

  @Get('id/:id')
  public findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Observable<OrderClient> {
    return this.client.send('findOneOrder', { id }).pipe(
      catchError((error) => {
        throw new RpcException(error as unknown as object);
      }),
    );
  }

  @Get(':status')
  public findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ): Observable<AllFilterOrderResponse> {
    return this.client
      .send('findAllOrders', {
        ...paginationDto,
        status: statusDto.status,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error as unknown as object);
        }),
      );
  }

  @Patch(':id')
  public changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ): Observable<OrderClient> {
    return this.client
      .send('changeOrderStatus', { id, status: statusDto.status })
      .pipe(
        catchError((error) => {
          throw new RpcException(error as unknown as object);
        }),
      );
  }
}
