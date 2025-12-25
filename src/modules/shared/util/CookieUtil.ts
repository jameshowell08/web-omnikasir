// utils/cookie-manager.ts
import Cookies from 'js-cookie';

// Define your keys as a constant or enum for type safety
export type CookieKeys = 'user';

export function setCookie(key: CookieKeys, value: string | object, expiresDays: number = 7) {
  const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
  
  Cookies.set(key, stringValue, { 
    expires: expiresDays,
    secure: true, // Only send over HTTPS
    sameSite: 'strict', // Protects against CSRF
    path: '/' 
  });
}

export function getCookie(key: CookieKeys): string | undefined {
  return Cookies.get(key);
}

export function removeCookie(key: CookieKeys) {
  Cookies.remove(key);
}