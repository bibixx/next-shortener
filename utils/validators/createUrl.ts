import isUrl from 'is-valid-http-url';
import { isValidSlug } from './createUrl.utils';

export interface CreateUrlRequestDTO {
  URL: string
  SLUG?: string
}

type Ok = { valid: true, data: CreateUrlRequestDTO }
type Err = { valid: false, error: string }

export const validateCreateUrl = (body: any): Ok | Err => {
  if (typeof body.URL !== 'string') {
    return { valid: false, error: '\'URL\' field is not a string' };
  }

  if (!isUrl(body.URL)) {
    return { valid: false, error: '\'URL\' field is not a valid URL' };
  }

  if (typeof body.SLUG !== 'string' && typeof body.SLUG !== 'undefined') {
    return { valid: false, error: '\'SLUG\' field is not a string or undefined' };
  }

  if (typeof body.SLUG === 'string' && body.SLUG !== '' && !isValidSlug(body.SLUG)) {
    return { valid: false, error: 'You can only use a-z A-Z 0-9 - . _ in the slug' };
  }


  return { valid: true, data: body };
}
