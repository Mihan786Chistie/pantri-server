import { Injectable, PipeTransform } from '@nestjs/common';
import xss from 'xss';

function sanitizeValue(value: any): any {
  if (typeof value === 'string') return xss(value);
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === 'object') {
    const out: any = {};
    for (const key of Object.keys(value)) {
      if (
        key === 'password' ||
        key === 'refreshToken' ||
        key === 'accessToken'
      ) {
        out[key] = value[key];
      } else {
        out[key] = sanitizeValue(value[key]);
      }
    }
    return out;
  }
  return value;
}

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any) {
    return sanitizeValue(value);
  }
}
