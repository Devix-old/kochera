import NotFoundClient from '@/components/404/NotFoundClient';

export const metadata = {
  title: '404 - Seite nicht gefunden | kochira',
  description: 'Die Seite, die Sie suchen, existiert nicht. Finden Sie stattdessen Ihre Lieblingsrezepte auf kochira!',
  robots: 'noindex, nofollow',
};

export default function NotFound() {
  return <NotFoundClient />;
}
