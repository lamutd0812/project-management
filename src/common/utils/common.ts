import axios from 'axios';
import * as dayjs from 'dayjs';
import * as _ from 'lodash';
import * as i18n from 'i18n';
import isUUID from 'validator/lib/isUUID';
import { DATA_TYPE } from '../enums/common.enum';
import {
  DATA_INVALID,
  STATUS_CODE_DEFAULT,
  SUCCESS,
} from '../constants/error-messages';
import { DayJS } from './dayjs';

// const DIGIT_NUMBER = '0123456789';
// const CHARACTERS_LOWER_CASE = 'abcdefghijklmnopqrstuvwxyz';
// const CHARACTERS_CAPITALIZE = CHARACTERS_LOWER_CASE.toUpperCase();
// const CHARACTERS = `${CHARACTERS_CAPITALIZE}${CHARACTERS_LOWER_CASE}${DIGIT_NUMBER}`;

const common: any = {
  CATEGORY_TYPE_MAPPING: [],
  PRODUCT_TYPE_MAPPING: [],

  STATUS_MAPPING: [],
  STATUS_PRODUCT: [],
  SYNC_STATUS_PRODUCT: [],

  PRODUCT_ACTIVATION_STATUS: [],

  USER_STATUS: [],
  USER_DOCUMENT_TYPE: [],
  USER_MEMBER: [],
};
export const i18nMsg = (message: string, payload?: object) => {
  // translate message
  if (!message) return '';
  if (!payload) message = i18n.__(message);
  else message = i18n.__(message, payload);
  return message;
};

export const success = (data) => {
  let output: any = {
    message: i18nMsg(SUCCESS),
    statusCode: STATUS_CODE_DEFAULT,
  };
  output = Object.assign(output, data);
  return output;
};

export const getCountryByIp = async (ip: string) => {
  if (ip === '::1') {
    return '';
  }
  const url = `http://ip-api.com/json/${ip}`;
  const response = await axios.get(url);
  return response.data.country || response.data.countryCode;
};

export const validateDatatype = (value, typeMask) => {
  switch (typeMask) {
    case DATA_TYPE.NUMBER:
      return !isNaN(value);
    case DATA_TYPE.INTEGER:
    case DATA_TYPE.INT:
      return !isNaN(value) && parseInt(value) === Number(value);
    case DATA_TYPE.FLOAT:
    case DATA_TYPE.DOUBLE:
      return !isNaN(value) && parseFloat(value) === Number(value);
    case DATA_TYPE.BOOLEAN:
      return (
        value === 'true' ||
        value === 'false' ||
        typeof value === DATA_TYPE.BOOLEAN
      );
    case DATA_TYPE.STRING:
      return typeof value === DATA_TYPE.STRING;
    case DATA_TYPE.ARRAY:
      return Array.isArray(value);
    case DATA_TYPE.JSON:
      return typeof value === DATA_TYPE.OBJECT;
    case DATA_TYPE.OBJECT:
      return typeof value === DATA_TYPE.OBJECT;
    case DATA_TYPE.DATETIME:
      return dayjs(value).isValid();
    case DATA_TYPE.DATE:
      return dayjs(value).isValid();
    case DATA_TYPE.UUID:
      return isUUID(value);

    default:
      return true;
  }
};
export const validateInput = (input, regex) => {
  const re = new RegExp(regex, 'g');
  const result = re.test(input);
  return !!result;
};
function getFieldLength(field: any) {
  return !Array.isArray(field) ? (field || '').toString().length : field.length;
}
export const validateFields = (requiredFields) => {
  try {
    for (const objField of requiredFields) {
      const fieldLength = getFieldLength(objField.field);

      if (
        (!objField.noRequired && !objField.field) ||
        (objField.dataType &&
          objField.field &&
          !validateDatatype(objField.field, objField.dataType)) ||
        (objField.minLength &&
          objField.field &&
          fieldLength < objField.minLength) ||
        (objField.maxLength &&
          objField.field &&
          fieldLength > objField.maxLength) ||
        (objField.regex &&
          objField.field &&
          !validateInput(objField.field, objField.regex))
      ) {
        const output = Object.assign(
          { statusCode: 400, message: DATA_INVALID },
          {
            validation: true,
            fieldName: objField.fieldName,
            message: i18nMsg(objField.message, objField.dataTranslate),
          },
        );
        return output;
      }
    }
    return true;
  } catch (error) {
    return error;
  }
};

export const toCamelKey = (key: string) => {
  return _.camelCase(key);
};
export const toSnakeKey = (key: string) => {
  return _.snakeCase(key);
};
export const snakeCaseToCamelCase = (data: any) => {
  if (Array.isArray(data)) {
    return data.map((v) => snakeCaseToCamelCase(v));
  } else if (data != null && validateDatatype(data, DATA_TYPE.DATETIME)) {
    return data;
  } else if (data != null && _.isObject(data)) {
    return Object.keys(data).reduce(
      (result, key) => ({
        ...result,
        [toCamelKey(key)]: snakeCaseToCamelCase(data[key]),
      }),
      {},
    );
  }
  return data;
};

export const camelCaseToSnakeCase = (data: any) => {
  if (Array.isArray(data)) {
    return data.map((v) => camelCaseToSnakeCase(v));
  } else if (data != null && validateDatatype(data, DATA_TYPE.DATETIME)) {
    return data;
  } else if (data != null && _.isObject(data)) {
    return Object.keys(data).reduce(
      (result, key) => ({
        ...result,
        [toSnakeKey(key)]: camelCaseToSnakeCase(data[key]),
      }),
      {},
    );
  }
  return data;
};

export const verifyDueDate = (dueDate: Date): boolean => {
  if (DayJS().utc().isAfter(DayJS(dueDate).utc())) {
    return false;
  }
  return true;
};

export const generateOTP = (digitNumber: number): number => {
  const digits = '0123456789';
  let OTP = '';
  const len = digits.length;
  for (let i = 0; i < digitNumber; i++) {
    OTP += digits[Math.floor(Math.random() * len)];
  }

  return Number(OTP);
};

export default common;
