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
const serviceKey = envConfig['SUPABASE_SERVICE_ROLE_KEY'];

if (!serviceKey) {
  console.error("❌ ERRORE: SUPABASE_SERVICE_ROLE_KEY mancante in .env.local.");
  process.exit(1);
}

// INSERISCI L'EMAIL DELL'ATLETA
const targetEmail = "INSERISCI_EMAIL_ATLETA";

async function generateDirectRecoveryLink() {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  console.log("==================================================================");
  console.log(` GENERAZIONE LINK RECUPERO PASSWORD: ${targetEmail}`);
  console.log("==================================================================");

  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email: targetEmail.trim().toLowerCase(),
    options: {
      redirectTo: 'https://top-gym-two.vercel.app'
    }
  });

  if (error) {
    console.error("❌ Errore generazione link:", error.message);
    return;
  }

  console.log("✔ LINK DI RECUPERO GENERATO CON SUCCESSO!\n");
  console.log("Copia e invia questo link direttamente all'atleta su WhatsApp:\n");
  console.log(data.properties.action_link);
  console.log("\nAppena tocca questo link dal cellulare, si aprirà l'app per impostare la nuova password.");
}

generateDirectRecoveryLink();
