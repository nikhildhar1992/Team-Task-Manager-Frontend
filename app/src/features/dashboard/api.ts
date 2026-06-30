import { httpClient } from '../../lib/httpClient';

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface PlaceOrderItemInput {
  productId: string;
  itemName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface PlaceOrderInput {
  shippingAddress: string;
  currency: 'INR';
  subtotal: number;
  totalAmount: number;
  items: PlaceOrderItemInput[];
}

interface PlaceOrderResult {
  orderId: number | string;
  status?: string;
}

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const response = await httpClient.post<ApiSuccessResponse<PlaceOrderResult>>('/orders', input);
  return response.data.data;
}
