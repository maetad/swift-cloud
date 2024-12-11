import { FindOptionsOrderValue } from 'typeorm';

export const encode = (
  key: string,
  value: any,
  direction: FindOptionsOrderValue,
): string => {
  return Buffer.from(`${key}:${value}:${direction}`).toString('base64');
};

export const decode = (
  cursor: string,
): { key: string; value: any; direction: FindOptionsOrderValue } => {
  const [key, value, direction] = Buffer.from(cursor, 'base64')
    .toString('ascii')
    .split(':');
  return {
    key,
    value,
    direction: direction as FindOptionsOrderValue,
  };
};
