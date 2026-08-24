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

  // Guardar suscripción push si existe
  const push_subscription = formData.get('push_subscription') as string;
  if (push_subscription) {
    try {
      const parsedSub = JSON.parse(push_subscription);
      await supabase.from('push_subscriptions').insert([{
        card_id,
        lead_id: null, // Opcional: si quieres vincularlo al lead
        endpoint: parsedSub.endpoint,
        p256dh: parsedSub.keys.p256dh,
        auth: parsedSub.keys.auth
      }]);
    } catch (err) {
      console.error('Error parsing or saving push subscription:', err);
    }
  }

  revalidatePath('/');
  return { success: true };
}

export async function trackViewAction(cardId: string) {
  const supabase = await createClient();

  // Call the custom RPC function to increment views
  const { error } = await supabase.rpc('increment_card_views', { card_id_param: cardId });

  if (error) {
    console.error('Error incrementing view count:', error);
    return { error: 'Ocurrió un error al registrar la visita.' };
  }

  revalidatePath('/');
  return { success: true };
}
