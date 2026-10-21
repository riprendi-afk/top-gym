const fs = require('fs');

let envConfig = {};
['.env.local', '.env'].forEach(f => {
  if (fs.existsSync(f)) {
    fs.readFileSync(f, 'utf8').split('\n').forEach(l => {
      const match = l.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let val = (match[2] || '').trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
        envConfig[match[1]] = val;
      }
    });
  }
});

const supabaseUrl = envConfig['NEXT_PUBLIC_SUPABASE_URL'] || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = envConfig['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// INSERISCI QUI LE CREDENZIALI DI TEST DI UN ATLETA BLOCCATO
const testEmail = "INSERISCI_EMAIL_ATLETA";
const testPassword = "INSERISCI_PASSWORD";

async function testAthleteLogin() {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  console.log("==================================================================");
  console.log(` TEST LOGIN DIRETTO: ${testEmail}`);
  console.log("==================================================================");

  const { data, error } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (error) {
    console.error("❌ ERRORE SUPABASE RILEVATO:");
    console.error("  Messaggio:", error.message);
    console.error("  Status:", error.status);
    console.error("  Codice errore:", error.code || 'N/D');

    if (error.message.includes("Email not confirmed")) {
      console.log("\n-> DIAGNOSI: 'Confirm email' è attivo su Supabase. Disattivalo in Authentication -> Providers -> Email.");
    } else if (error.message.includes("Invalid login credentials")) {
      console.log("\n-> DIAGNOSI: Password non corrispondente o hash utente invalidato.");
    }
  } else {
    console.log("✔ LOGIN RIUSCITO!");
    console.log("  ID Utente:", data.user.id);
    console.log("  Ruolo:", data.user.role);
    console.log("  Email confermata il:", data.user.email_confirmed_at || "MAI");
  }
}

testAthleteLogin();
