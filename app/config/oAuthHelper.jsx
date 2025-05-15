// oauthHelper.js
import OAuth from 'oauth-1.0a';
import CryptoJS from 'crypto-js';

const consumerKey = '0228e56a970646708a153dd6d5493ec1';
const consumerSecret = '80b11cb24d0945c7aad52e99f72f30e2';

const oauth = OAuth({
  consumer: { key: consumerKey, secret: consumerSecret },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
  },
});

export const createSignedUrl = (url, method = 'GET', extraParams = {}) => {
  const request_data = {
    url,
    method,
    data: extraParams,
  };

  const oauth_data = oauth.authorize(request_data);

  const allParams = {
    ...extraParams,
    ...oauth_data,
  };

  const queryString = new URLSearchParams(allParams).toString();

  return `${url}?${queryString}`;
};
