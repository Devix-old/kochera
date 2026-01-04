import NotFoundClient from '@/components/404/NotFoundClient';

export const metadata = {
  title: '404 - Sidan hittades inte | Bakstunden',
  description: 'Den sida du letar efter finns inte. Hitta dina favoritrecept på Bakstunden istället!',
  robots: 'noindex, nofollow',
};

export default function NotFound() {
  return <NotFoundClient />;
}
