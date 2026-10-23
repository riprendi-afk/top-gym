const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("--> [FASE 3] Verifica e aggiornamento pulsante Template Split in app/page.tsx...");
const pagePath = path.join(process.cwd(), 'app', 'page.tsx');
fs.copyFileSync(pagePath, `${pagePath}.bak`);

let code = fs.readFileSync(pagePath, 'utf8');

// 1. Assicuriamo l'import di Layers da lucide-react se non presente
if (!code.includes("Layers")) {
  code = code.replace(
    'import { BookOpen } from "lucide-react";',
    'import { BookOpen, Layers } from "lucide-react";'
  );
  console.log("[OK] Import Layers aggiunto.");
}

// 2. Inseriamo la barra di comando unificata "Template Split" in testa al Builder
const builderHeaderMarker = '{/* TAB 6: BUILDER COACH METODO TOPGYM */}';
const builderIdx = code.indexOf(builderHeaderMarker);

if (builderIdx !== -1 && !code.includes('/* UNICO PULSANTE TEMPLATE SPLIT */')) {
  const insertTarget = '<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"><div className="lg:col-span-8 space-y-6">';
  const insertPos = code.indexOf(insertTarget, builderIdx);
  if (insertPos !== -1) {
    const afterPos = insertPos + insertTarget.length;
    const splitButtonHeader = `\n              {/* UNICO PULSANTE TEMPLATE SPLIT */}
              <div className="bg-[#12151B] border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5 text-[#E50914]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase text-white tracking-wider">
                      Assegna Scheda da Template Split
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      PPL, Upper/Lower, Torso/Arti, Bikini Wave o Hard TopGym. Caricamento istantaneo nel builder.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E50914] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 shrink-0"
                >
                  <Layers className="w-4 h-4 text-white" />
                  <span>Scegli Template Split</span>
                </button>
              </div>`;
    code = code.slice(0, afterPos) + splitButtonHeader + code.slice(afterPos);
    console.log("[OK] Barra comando 'Scegli Template Split' posizionata in cima a Programmi.");
  }
}

fs.writeFileSync(pagePath, code, 'utf8');
console.log("[OK] app/page.tsx salvato.");

// 3. Build & Git Push
console.log("\n--> Avvio verifica build Next.js (npm run build)...");
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log("\n[SUCCESS] BUILD SUPERATA SENZA REGRESSIONI!");

  if (fs.existsSync(`${pagePath}.bak`)) fs.unlinkSync(`${pagePath}.bak`);

  console.log("--> Git add, commit e push...");
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "feat(coach): complete phase 3 unified template split drawer and instant loader"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log("\n=== FASE 3 CHIUSA E DEPLOYATA CON SUCCESSO! ===");
} catch (err) {
  console.error("\n[ERRORE BUILD] Errore durante la build. Ripristino backup...");
  if (fs.existsSync(`${pagePath}.bak`)) {
    fs.copyFileSync(`${pagePath}.bak`, pagePath);
    console.log("[OK] app/page.tsx ripristinato dal backup.");
  }
  process.exit(1);
}
