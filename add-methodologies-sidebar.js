const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("=== [TOP GYM] INSERIMENTO BOTTONE METODOLOGIE NEL MENU A SINISTRA ===");

const pagePath = path.join(process.cwd(), 'app', 'page.tsx');
let code = fs.readFileSync(pagePath, 'utf8');

// Verifichiamo se il pulsante è già presente
if (code.includes('onClick={() => setActiveTab("methodologies")}')) {
  console.log("[INFO] Il pulsante metodologie è già presente nel codice.");
} else {
  // Pulsante da inserire subito dopo la voce "Programmi"
  const targetMarker = '<span>Programmi</span>\n                </div>\n                {activeTab === "builder" && (\n                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>\n                )}\n              </button>';

  const methodologiesButton = `

              <button
                type="button"
                onClick={() => setActiveTab("methodologies")}
                className={\`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer \${
                  activeTab === "methodologies"
                    ? "bg-[#181C24] text-white border border-white/15 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }\`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Metodologie & Linee Guida</span>
                </div>
                {activeTab === "methodologies" && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                )}
              </button>`;

  if (code.includes(targetMarker)) {
    code = code.replace(targetMarker, targetMarker + methodologiesButton);
    fs.writeFileSync(pagePath, code, 'utf8');
    console.log("[OK] Voce 'Metodologie & Linee Guida' inserita con successo nella sidebar!");
  } else {
    // Fallback su marker alternativo
    const altMarker = '<span>Programmi</span>';
    const altIdx = code.indexOf(altMarker);
    if (altIdx !== -1) {
      const endBtn = code.indexOf('</button>', altIdx);
      if (endBtn !== -1) {
        const insertPos = endBtn + '</button>'.length;
        code = code.slice(0, insertPos) + methodologiesButton + code.slice(insertPos);
        fs.writeFileSync(pagePath, code, 'utf8');
        console.log("[OK] Voce inserita tramite posizionamento fallback.");
      }
    }
  }
}

// Verifica Build Next.js & Push
console.log("\n--> Avvio verifica build (npm run build)...");
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log("\n[SUCCESS] BUILD COMPLETATA CON SUCCESSO!");

  console.log("--> Esecuzione Git commit e push...");
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "feat(coach): add methodologies and periodization guidelines button to left sidebar"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log("\n=== TASTO ATTIVO E DISPONIBILE SULLA DASHBOARD COACH! ===");
} catch (err) {
  console.error("\n[ERRORE BUILD] Errore riscontrato durante il build:", err.message);
  process.exit(1);
}
