// ===== .\src\app\[locale]\privacy\page.tsx =====
import StaticPageLayout from "@/components/StaticPageLayout";
import { getTranslations } from "next-intl/server";

export default async function PrivacyPage() {
  const t = await getTranslations('Privacy');
  return (
    <StaticPageLayout title={t('title')}>
      <h2>{t('h1')}</h2>
      <p>{t('p1')}</p>
      <h2>{t('h2')}</h2>
      <p>{t('p2')}</p>
      <h2>{t('h3')}</h2>
      <p>{t('p3')}</p>
    </StaticPageLayout>
  );
}