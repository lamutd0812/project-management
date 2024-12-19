export enum DATA_TYPE {
  STRING = 'string',
  NUMBER = 'number',
  CURRENCY = 'currency',
  INTEGER = 'integer',
  FLOAT = 'float',
  INT = 'int',
  DOUBLE = 'double',
  BOOLEAN = 'boolean',
  JSON = 'json',
  OBJECT = 'object',

  ARRAY = 'array',
  DATETIME = 'datetime',
  OBJECTID = 'objectid',

  DATE = 'date',
  HTML = 'html',
  LONGTEXT = 'longtext',
  SIMPLEJSON = 'simple-json',
  UUID = 'uuid',
  UNDEFINED = 'undefined',
}

export enum SortType {
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum TokenType {
  TOKEN = 'token',
  REFRESH_TOKEN = 'refresh_token',
}

export enum Role {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  CONTRIBUTOR = 'Contributor',
}

export const ROLES_KEY = 'roles';
