import queryString, { StringifyOptions } from 'query-string';

export const getQueryStringParams = <T extends object = object>(url: string, params: T, options?: StringifyOptions) =>
  `${url}?${queryString.stringify(params, options)}`;