// ===== .\src\app\[locale]\contact\page.tsx =====
import StaticPageLayout from "@/components/StaticPageLayout";
import { getTranslations } from "next-intl/server";

export default async function ContactPage() {
  const t = await getTranslations('Contact');
  return (
    <StaticPageLayout title={t('title')}>
      <p>{t('p1')}</p>
      <ul>
        <li><strong>{t('supportEmail')}:</strong> support@v2r.space</li>
        <li><strong>{t('businessEmail')}:</strong> business@v2r.space</li>
        <li><strong>{t('address')}:</strong> {t('address_detail')}</li>
      </ul>
      <p>{t('p2')}</p>
    </StaticPageLayout>
  );
}