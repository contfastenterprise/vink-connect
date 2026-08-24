import { Card } from '@/types';

export function generateVCard(card: Card): string {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:;${card.name};;;`,
    `FN:${card.name}`,
    card.company ? `ORG:${card.company}` : '',
    card.title ? `TITLE:${card.title}` : '',
    card.phone ? `TEL;TYPE=CELL:${card.phone}` : '',
    card.email ? `EMAIL;TYPE=WORK,INTERNET:${card.email}` : '',
    card.website ? `URL:${card.website}` : '',
    card.social_links?.linkedin ? `URL;type=LinkedIn:${card.social_links.linkedin}` : '',
    card.social_links?.twitter ? `URL;type=Twitter:${card.social_links.twitter}` : '',
    card.social_links?.instagram ? `URL;type=Instagram:${card.social_links.instagram}` : '',
    card.social_links?.github ? `URL;type=GitHub:${card.social_links.github}` : '',
    card.theme_config?.bio ? `NOTE:${card.theme_config.bio.replace(/\n/g, '\\n')}` : '',
    // This is a generic fallback link to their profile
    // `URL;type=Profile:https://vink.com/c/${card.slug}`,
    `REV:${new Date().toISOString()}`,
    'END:VCARD'
  ].filter(Boolean).join('\n');
  
  return vcard;
}
