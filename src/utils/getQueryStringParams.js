import queryString from 'query-string';

export const getQueryStringParams = (url, params, options) => `${url}?${queryString.stringify(params, options)}`;