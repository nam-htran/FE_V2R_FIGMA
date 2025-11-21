// ===== .\src\app\[locale]\about\page.tsx =====
import StaticPageLayout from "@/components/StaticPageLayout";
import { getTranslations } from 'next-intl/server';

export default async function AboutPage() {
  const t = await getTranslations('About');
  return (
    <StaticPageLayout title={t('title')}>
      <p>{t('p1')}</p>
      <h2>{t('h2')}</h2>
      <p>{t('p2')}</p>
      <h2>{t('h3')}</h2>
      <p>{t('p3')}</p>
    </StaticPageLayout>
  );
}