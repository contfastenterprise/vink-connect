import { Card } from '@/types';

export async function generateVCard(card: Card): Promise<string> {
  let photoData = '';
  
  if (card.logo_url) {
    try {
      const response = await fetch(card.logo_url);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        
        // Determinar el tipo para vCard
        let vcardType = 'JPEG';
        if (contentType.includes('png')) vcardType = 'PNG';
        if (contentType.includes('gif')) vcardType = 'GIF';
        if (contentType.includes('webp')) vcardType = 'WEBP';
        
        photoData = `PHOTO;ENCODING=b;TYPE=${vcardType}:${base64}`;
      }
    } catch (err) {
      console.error('Error fetching vcard photo:', err);
    }
  }

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
    photoData,
    `REV:${new Date().toISOString()}`,
    'END:VCARD'
  ].filter(Boolean).join('\n');
  
  return vcard;
}
