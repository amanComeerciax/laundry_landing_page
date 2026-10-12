import { redirect } from 'next/navigation';

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const urlParams = new URLSearchParams();
  urlParams.set('tab', 'book');

  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (key !== 'tab' && typeof val === 'string') {
        urlParams.set(key, val);
      }
    });
  }

  redirect(`/dashboard?${urlParams.toString()}`);
}
