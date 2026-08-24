import { NextRequest, NextResponse } from 'next/server';
import { generateVCard } from '@/lib/vcard';
import { Card } from '@/types';

import { createClient } from '@/utils/supabase/server';

async function getCardBySlug(slug: string): Promise<Card | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('cards').select('*').eq('slug', slug).single();
  return data as Card | null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const card = await getCardBySlug(slug);

  if (!card) {
    return NextResponse.json({ error: 'Card not found' }, { status: 404 });
  }

  const vcardContent = generateVCard(card);

  return new NextResponse(vcardContent, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${card.name.replace(/\s+/g, '_')}.vcf"`,
    },
  });
}
