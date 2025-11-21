import StaticPageLayout from "@/components/StaticPageLayout";
import { getTranslations } from 'next-intl/server';
import Image from "next/image";

export default async function FeaturesPage() {
  const t = await getTranslations('Features');

  return (
    <StaticPageLayout title={t('title')}>
      <div className="space-y-16">
        {/* Feature 1: Text to 3D */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h2 className="!text-3xl !font-semibold !font-unbounded !mt-0">{t('t2d_title')}</h2>
            <p>{t('t2d_p1')}</p>
          </div>
          <div className="md:w-1/2">
            <Image 
              src="/landing-page/image 13.png" 
              alt="Text to 3D example" 
              width={500} 
              height={500} 
              className="rounded-lg shadow-xl aspect-square object-cover"
            />
          </div>
        </div>

        {/* Feature 2: Image to 3D */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="md:w-1/2">
            <h2 className="!text-3xl !font-semibold !font-unbounded !mt-0">{t('i2d_title')}</h2>
            <p>{t('i2d_p1')}</p>
          </div>
          <div className="md:w-1/2">
             <Image 
              src="/landing-page/image 14.png" 
              alt="Image to 3D example" 
              width={500} 
              height={500} 
              className="rounded-lg shadow-xl aspect-square object-cover"
            />
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
}