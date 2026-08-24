'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function saveLeadAction(formData: FormData) {
  const supabase = await createClient();

  const card_id = formData.get('card_id') as string;
  const visitor_name = formData.get('visitor_name') as string;
  const visitor_email = formData.get('visitor_email') as string;
  const visitor_phone = formData.get('visitor_phone') as string;
  const message = formData.get('message') as string;

  if (!card_id || !visitor_name) {
    return { error: 'El nombre es obligatorio.' };
  }

  const { error } = await supabase
    .from('leads')
    .insert([
      {
        card_id,
        visitor_name,
        visitor_email,
        visitor_phone,
        message,
      }
    ]);

  if (error) {
    console.error('Error inserting lead:', error);
    return { error: 'Ocurrió un error al guardar tus datos. Intenta nuevamente.' };
  }

  return { success: true };
}
