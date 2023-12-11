import { UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';

export function Serialize<F>(dto: F) {
  const serializer = new SerializeInterceptor(dto);
  return UseInterceptors(serializer);
}

