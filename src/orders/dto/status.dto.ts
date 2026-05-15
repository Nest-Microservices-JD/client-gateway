import { IsEnum } from 'class-validator';
import { OrderStatus, OrderStatusList } from '../enum';

export class StatusDto {
  @IsEnum(OrderStatusList, {
    message: `status must be one of ${OrderStatusList.join(', ')}`,
  })
  status: OrderStatus;

  constructor(status: OrderStatus) {
    this.status = status;
  }
}
