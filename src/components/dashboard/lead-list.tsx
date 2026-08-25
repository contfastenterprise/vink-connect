// LeadList ahora recibe leads como prop pre-cargada desde el Server Component padre (page.tsx)
// Esto elimina el doble fetch a la tabla leads que existía antes.

interface Lead {
  id: string;
  card_id: string;
  visitor_name: string;
  visitor_email?: string;
  visitor_phone?: string;
  created_at: string;
}

interface LeadListProps {
  leads: Lead[];
}

export function LeadList({ leads }: LeadListProps) {
  if (!leads || leads.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-on-surface-variant gap-2 text-center">
        <span className="material-symbols-outlined text-4xl opacity-50">contacts</span>
        <p className="font-body-md">Aún no tienes contactos recientes.</p>
        <p className="font-body-sm text-sm opacity-70">Comparte tu tarjeta para empezar a recibir datos.</p>
      </div>
    );
  }

  return (
    <>
      {leads.map((lead) => (
        <div key={lead.id} className="p-4 flex items-center justify-between hover:bg-surface-container-highest/30 transition duration-150 ease-out cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container-high border border-white/10 flex items-center justify-center">
              <span className="font-headline-md text-[14px] text-primary font-bold">
                {lead.visitor_name.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col">
              <p className="font-body-md text-[14px] font-semibold text-on-surface">{lead.visitor_name}</p>
              {lead.visitor_email && <p className="font-body-sm text-[12px] text-on-surface-variant">{lead.visitor_email}</p>}
              {lead.visitor_phone && !lead.visitor_email && <p className="font-body-sm text-[12px] text-on-surface-variant">{lead.visitor_phone}</p>}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-label-md text-[11px] text-on-surface-variant">
              {new Date(lead.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </>
  );
}
