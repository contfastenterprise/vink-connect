import { NextRequest, NextResponse } from 'next/server';
import { generateVCard } from '@/lib/vcard';
import { Card } from '@/types';

// Mock DB call for MVP since Supabase isn't fully set up yet
async function getCardBySlug(slug: string): Promise<Card | null> {
  // In a real app, you would query Supabase: 
  // const { data } = await supabase.from('cards').select('*').eq('slug', slug).single()
  return {
    id: slug,
    user_id: 'user-123',
    slug,
    name: 'Alex Rivera',
    title: 'Senior Product Designer',
    company: 'Nexus Connect',
    phone: '+1234567890',
    email: 'alex@nexusconnect.com',
    website: 'https://alexrivera.design',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
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
