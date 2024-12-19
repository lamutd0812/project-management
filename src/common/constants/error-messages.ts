import { i18nMsg } from '@common/utils/common';

export function getMessage(key: string, params: object = {}) {
  return i18nMsg(key, params);
}
export const STATUS_CODE_DEFAULT = 200;
export const SUCCESS = 'success';
export const SYSTEM_ERROR = 'system_error';
export const DATA_INVALID = 'data_invalid';
export const NOT_FOUND = 'found_found';
