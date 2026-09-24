// app/api/notify-coach/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { athleteName, currentPhase, completedWeek, nextStepProposal } = body;

    const coachEmail = 'riprendi@gmail.com';
    const subject = `⚡ [HARDTOPGYM] ${athleteName} ha completato il Microciclo (Settimana ${completedWeek})!`;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #12151B; color: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #f59e0b;">
        <h2 style="color: #f59e0b; margin-top: 0; text-transform: uppercase;">Notifica Master Coach · HARDTOPGYM</h2>
        <p style="font-size: 14px; color: #d1d5db;">Ciao Coach,</p>
        <p style="font-size: 15px; color: #ffffff;">
          L'atleta <strong>${athleteName}</strong> ha completato tutti i workout previsti per la <strong>Settimana ${completedWeek}</strong> nella <strong>${currentPhase}</strong>.
        </p>
        
        <div style="background-color: #1c202a; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 6px;">
          <p style="margin: 0; font-size: 13px; color: #9ca3af; text-transform: uppercase; font-weight: bold;">Prossimo Step Consigliato:</p>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: #fcd34d; font-weight: bold;">${nextStepProposal}</p>
        </div>

        <p style="font-size: 13px; color: #9ca3af;">
          La scheda dell'atleta è attualmente in attesa della tua convalida. Accedi alla Cabina di Regia per confermare e applicare la progressione con 1 click.
        </p>
        
        <hr style="border: 0; border-top: 1px solid #374151; margin: 20px 0;" />
        <small style="color: #6b7280; font-size: 11px;">TOP GYM App · Sistema Algoritmico HARDTOPGYM</small>
      </div>
    `;

    // 1. Invio tramite RESEND (se hai configurato RESEND_API_KEY nel .env.local)
    if (process.env.RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'TOP GYM System <onboarding@resend.dev>',
          to: [coachEmail],
          subject: subject,
          html: emailHtml,
        }),
      });

      if (!res.ok) {
        console.error('Errore invio Resend:', await res.text());
      }
    } else {
      // Fallback di sviluppo: stampa a terminale se la chiave API non è ancora impostata
      console.log(`\n======================================================`);
      console.log(`[SIMULAZIONE EMAIL A ${coachEmail}]`);
      console.log(`OGGETTO: ${subject}`);
      console.log(`ATLETA: ${athleteName} | FASE: ${currentPhase} | SETTIMANA: ${completedWeek}`);
      console.log(`======================================================\n`);
    }

    return NextResponse.json({ success: true, message: 'Notifica inviata con successo' });
  } catch (error: any) {
    console.error('Errore API notify-coach:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}