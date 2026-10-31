# TAGLIO — Webapp prenotazioni Barber & Parrucchiere

Webapp mobile-first ottimizzata per iPhone (iOS 18): safe area per Dynamic Island e home indicator, installabile in Home ("Aggiungi alla schermata Home"), barre in vetro smerigliato, input a 16px (niente zoom automatico).

Stile: **B – Minimal Sand**.

## Avvio

```bash
npm install
npm run dev
```

## Adattarla a un nuovo salone (template)

| File | Cosa cambiare |
|---|---|
| `src/config/salon.ts` | Nome, indirizzo, telefono, WhatsApp, orari, promo |
| `src/data/services.ts` | Listino: servizi, durate, prezzi, categorie |
| `src/data/staff.ts` | Team e servizi che ogni persona può eseguire |
| `src/config/images.ts` | URL delle foto (vuoto = placeholder sabbia) |
| `src/config/theme.ts` | Colori e raggi del design system |

## Funzionalità

- Home con stato aperto/chiuso in tempo reale, prossimo slot libero, servizi popolari, team, promo
- Listino con ricerca, categorie e selezione multipla (blocca combinazioni che richiedono due professionisti)
- Prenotazione: professionista o "Qualsiasi", calendario con giorni di chiusura, slot calcolati sulla durata totale
- Sconto automatico del martedì sui servizi idonei
- Conferma con file calendario (.ics con promemoria 1 h prima) e indicazioni su Apple Maps
- Profilo: appuntamenti futuri, annullamento, storico con "Riprenota", contatti e orari

## Da collegare per la produzione

La disponibilità degli slot è simulata e le prenotazioni sono salvate nel browser (`localStorage`). Per l'uso reale servono un database condiviso (es. Supabase su Lovable) e l'invio dei promemoria WhatsApp (es. WhatsApp Business API / Twilio). La logica da sostituire è tutta in `src/lib/booking.ts`.
