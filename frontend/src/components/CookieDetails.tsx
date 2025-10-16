import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function CookieDetails() {
  const { t } = useTranslation();

  const cookieCategories = [
    {
      id: 'necessary',
      title: t('cookies.settings.necessary.title'),
      cookies: t('cookies.details.necessary.cookies', { returnObjects: true }) as Array<{
        name: string;
        purpose: string;
        duration: string;
        provider: string;
      }>,
    },
    {
      id: 'analytics',
      title: t('cookies.settings.analytics.title'),
      cookies: t('cookies.details.analytics.cookies', { returnObjects: true }) as Array<{
        name: string;
        purpose: string;
        duration: string;
        provider: string;
      }>,
    },
    {
      id: 'marketing',
      title: t('cookies.settings.marketing.title'),
      cookies: t('cookies.details.marketing.cookies', { returnObjects: true }) as Array<{
        name: string;
        purpose: string;
        duration: string;
        provider: string;
      }>,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-1">{t('cookies.details.title')}</h3>
        <p className="text-xs text-muted-foreground">{t('cookies.details.description')}</p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {cookieCategories.map((category) => (
          <AccordionItem key={category.id} value={category.id}>
            <AccordionTrigger className="text-sm font-medium">
              {category.title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 font-medium">{t('cookies.details.columns.name')}</th>
                      <th className="text-left py-2 px-2 font-medium">{t('cookies.details.columns.purpose')}</th>
                      <th className="text-left py-2 px-2 font-medium">{t('cookies.details.columns.duration')}</th>
                      <th className="text-left py-2 px-2 font-medium">{t('cookies.details.columns.provider')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.cookies.map((cookie, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-2 px-2 font-mono">{cookie.name}</td>
                        <td className="py-2 px-2 text-muted-foreground">{cookie.purpose}</td>
                        <td className="py-2 px-2 text-muted-foreground">{cookie.duration}</td>
                        <td className="py-2 px-2 text-muted-foreground">{cookie.provider}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
