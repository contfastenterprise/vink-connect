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
    `URL:https://midominio.com/c/${card.slug}`,
    `REV:${new Date().toISOString()}`,
    'END:VCARD'
  ].filter(Boolean).join('\n');
  
  return vcard;
}
