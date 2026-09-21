import { defaultLocale, type Locale } from './ui';

export function prefix(locale: Locale) {
  return locale === defaultLocale ? '' : `/${locale}`;
}

export function localizePath(locale: Locale, path: string) {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (clean === '/') return prefix(locale) || '/';
  return `${prefix(locale)}${clean}`;
}

export function briefingPath(locale: Locale, id: string) {
  return localizePath(locale, `/briefings/${id}`);
}

export function alternates(path: string) {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const site = 'https://dsb.duarte.top';
  return {
    pt: `${site}${clean === '/' ? '' : clean}` || `${site}/`,
    es: `${site}/es${clean === '/' ? '' : clean}`,
    en: `${site}/en${clean === '/' ? '' : clean}`,
  };
}
