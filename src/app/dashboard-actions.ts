'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function saveCardAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const name = formData.get('name') as string;
  const title = formData.get('title') as string;
  const company = formData.get('company') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const website = formData.get('website') as string;
  const slugInput = formData.get('slug') as string;

  // Si no proporcionó slug, generamos uno a partir de su ID (uuid) para evitar colisiones
  const slug = slugInput || user.id.split('-')[0];

  // Checar si ya tiene una tarjeta
  const { data: existingCard } = await supabase
    .from('cards')
    .select('id')
    .eq('user_id', user.id)
    .single();

  const cardData = {
    user_id: user.id,
    slug,
    name,
    title,
    company,
    phone,
    email,
    website,
    updated_at: new Date().toISOString(),
  };

  if (existingCard) {
    // Update
    const { error } = await supabase
      .from('cards')
      .update(cardData)
      .eq('id', existingCard.id);

    if (error) {
      console.error('Error updating card:', error);
      return { error: error.message };
    }
  } else {
    // Insert
    const { error } = await supabase
      .from('cards')
      .insert([cardData]);

    if (error) {
      console.error('Error inserting card:', error);
      return { error: error.message };
    }
  }

  revalidatePath('/');
  revalidatePath(`/c/${slug}`);
  return { success: true, slug };
}
