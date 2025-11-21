import StaticPageLayout from "@/components/StaticPageLayout";
import { useTranslations } from "next-intl";

export default function TermsPage() {
  const t = useTranslations('Terms');
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