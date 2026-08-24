'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import webPush from 'web-push';

export async function sendPushNotificationAction(cardId: string, title: string, body: string, url: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Validar que la tarjeta pertenece al usuario
  const { data: card } = await supabase.from('cards').select('id, slug, logo_url').eq('id', cardId).eq('user_id', user.id).single();
  if (!card) return { error: 'Acceso denegado' };

  const { data: subs } = await supabase.from('push_subscriptions').select('*').eq('card_id', cardId);
  if (!subs || subs.length === 0) return { error: 'No hay usuarios suscritos a esta tarjeta aún.' };

  const finalUrl = url || `https://vink.com/c/${card.slug}`;

  webPush.setVapidDetails(
    'mailto:admin@vink.com', 
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  let successCount = 0;
  for (const sub of subs) {
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: { p256dh: sub.p256dh, auth: sub.auth }
    };
    try {
      const payload: any = {
        title, 
        body, 
        url: finalUrl
      };
      if (card.logo_url) {
        payload.icon = card.logo_url;
      }

      await webPush.sendNotification(pushSubscription, JSON.stringify(payload));
      successCount++;
    } catch (err: any) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        // Suscripción inválida/expirada, eliminarla
        await supabase.from('push_subscriptions').delete().eq('id', sub.id);
      }
      console.error('Push send error:', err);
    }
  }

  return { success: true, count: successCount };
}

export async function saveCardAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const cardId = formData.get('card_id') as string;
  const name = formData.get('name') as string;
  const title = formData.get('title') as string;
  const company = formData.get('company') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const website = formData.get('website') as string;
  const logo_url = formData.get('logo_url') as string;
  
  const bioInput = formData.get('bio') as string;
  const defaultBio = "Crafting intuitive digital experiences that bridge the gap between complex technology and human interaction.";
  const bio = (bioInput || "").trim() !== "" ? bioInput.trim() : defaultBio;
  
  const theme_color = (formData.get('theme_color') as string) || '#6D3BD7';
  const theme_bg_color = (formData.get('theme_bg_color') as string) || '#011230';
  
  const social_links = {
    linkedin: formData.get('social_linkedin') as string,
    twitter: formData.get('social_twitter') as string,
    instagram: formData.get('social_instagram') as string,
    github: formData.get('social_github') as string,
  };

  const cardData: any = {
    user_id: user.id,
    name,
    title,
    company,
    phone,
    email,
    website,
    logo_url,
    social_links,
    theme_config: { template: 'default', color: theme_color, backgroundColor: theme_bg_color, bio },
    updated_at: new Date().toISOString(),
  };

  if (cardId) {
    // Actualizar tarjeta existente
    const { data: existingCard } = await supabase
      .from('cards')
      .select('id, slug')
      .eq('id', cardId)
      .eq('user_id', user.id)
      .single();

    if (!existingCard) {
      return { error: 'Tarjeta no encontrada' };
    }

    const { error } = await supabase
      .from('cards')
      .update(cardData)
      .eq('id', existingCard.id);

    if (error) {
      console.error('Error updating card:', error);
      return { error: error.message };
    }

    revalidatePath('/');
    revalidatePath(`/c/${existingCard.slug}`);
    return { success: true, cardId: existingCard.id, slug: existingCard.slug };
  } else {
    // Crear nueva tarjeta -> Verificar límites de plan
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();

    const { data: userCards } = await supabase
      .from('cards')
      .select('id')
      .eq('user_id', user.id);

    const isPro = profile?.plan === 'pro';
    const cardCount = userCards?.length || 0;

    if (!isPro && cardCount >= 1) {
      return { 
        requiresPro: true, 
        error: 'El Plan Gratuito está limitado a 1 tarjeta. Actualiza a PRO para crear tarjetas ilimitadas.' 
      };
    }

    // Generar slug único
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const finalSlug = cardCount === 0 ? user.id.split('-')[0] : `${user.id.split('-')[0]}-${randomSuffix}`;
    cardData.slug = finalSlug;
    
    const { data: newCard, error } = await supabase
      .from('cards')
      .insert([cardData])
      .select()
      .single();

    if (error) {
      console.error('Error inserting card:', error);
      return { error: error.message };
    }

    revalidatePath('/');
    revalidatePath(`/c/${finalSlug}`);
    return { success: true, cardId: newCard.id, slug: finalSlug };
  }
}

export async function deleteCardAction(cardId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Asegurar que le queda al menos 1 tarjeta si el usuario tiene tarjetas
  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', cardId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting card:', error);
    return { error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}

export async function upgradeToProAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('profiles')
    .update({ plan: 'pro', updated_at: new Date().toISOString() })
    .eq('id', user.id);

  if (error) {
    console.error('Error upgrading profile:', error);
    return { error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}

export async function saveProfileAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const full_name = (formData.get('full_name') as string)?.trim();
  const avatar_url = formData.get('avatar_url') as string;

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (full_name) updates.full_name = full_name;
  // Guardar avatar_url siempre (incluso si es string vacío para poder eliminarlo)
  updates.avatar_url = avatar_url ?? null;

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id);

  if (error) {
    console.error('Error updating profile:', error);
    return { error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/auth/login');
}
