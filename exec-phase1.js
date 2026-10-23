const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("=== [TOP GYM] APPLICAZIONE FASE 1 (METHODOLOGIES GUIDE) ===");

const pagePath = path.join(process.cwd(), 'app', 'page.tsx');
fs.copyFileSync(pagePath, `${pagePath}.bak`);

let code = fs.readFileSync(pagePath, 'utf8');

// A. Assicuriamo "use client"; a riga 1 con gli import dedicati subito sotto
if (!code.includes("MethodologiesGuide")) {
  code = code.replace(
    /^("use client";?\r?\n)/m,
    `$1\nimport { BookOpen } from "lucide-react";\nimport MethodologiesGuide from "@/components/MethodologiesGuide";\n`
  );
  console.log("[OK] Import BookOpen e MethodologiesGuide inseriti.");
}

// B. Estensione unione tipi activeTab
if (!code.includes('"methodologies"')) {
  code = code.replace(
    'const [activeTab, setActiveTab] = useState<',
    'const [activeTab, setActiveTab] = useState<\n    | "methodologies"'
  );
  console.log("[OK] activeTab esteso con 'methodologies'.");
}

// C. Inserimento voce sidebar sotto Programmi
if (!code.includes('setActiveTab("methodologies")')) {
  const targetBtn = `<div className="flex items-center gap-3">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>Programmi</span>
                  </div>
                  {activeTab === "builder" && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  )}
                </button>`;

  const newSidebarItem = `${targetBtn}

                {/* VOCE COACH: METODOLOGIE & LINEE GUIDA */}
                {((userRole as any) === "COACH") && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("methodologies")}
                    className={
                      activeTab === "methodologies"
                        ? "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer bg-[#181C24] text-white border border-[#E50914]/40 shadow-sm"
                        : "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer text-zinc-400 hover:text-white hover:bg-white/5"
                    }
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span>Metodologie & Linee Guida</span>
                    </div>
                    {activeTab === "methodologies" && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    )}
                  </button>
                )}`;

  if (code.includes(targetBtn)) {
    code = code.replace(targetBtn, newSidebarItem);
    console.log("[OK] Voce Sidebar iniettata.");
  } else {
    const partialMarker = '<span>Programmi</span>\n                  </div>';
    const markerPos = code.indexOf(partialMarker);
    if (markerPos !== -1) {
      const btnEnd = code.indexOf('</button>', markerPos);
      if (btnEnd !== -1) {
        const pos = btnEnd + '</button>'.length;
        const injection = `\n\n                {/* VOCE COACH: METODOLOGIE & LINEE GUIDA */}
                {((userRole as any) === "COACH") && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("methodologies")}
                    className={
                      activeTab === "methodologies"
                        ? "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer bg-[#181C24] text-white border border-[#E50914]/40 shadow-sm"
                        : "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer text-zinc-400 hover:text-white hover:bg-white/5"
                    }
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span>Metodologie & Linee Guida</span>
                    </div>
                    {activeTab === "methodologies" && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    )}
                  </button>
                )}`;
        code = code.slice(0, pos) + injection + code.slice(pos);
        console.log("[OK] Voce Sidebar iniettata tramite fallback.");
      }
    }
  }
}

// D. Aggiornamento Topbar breadcrumb
code = code.replace(
  'activeTab === "builder" ? "PROGRAM BUILDER" : activeTab === "coachDashboard" ? "GESTIONE ATLETI" : activeTab.toUpperCase()',
  'activeTab === "builder" ? "PROGRAM BUILDER" : activeTab === "coachDashboard" ? "GESTIONE ATLETI" : activeTab === "methodologies" ? "METODOLOGIE & LINEE GUIDA" : activeTab.toUpperCase()'
);

// E. Reset sicurezza ruolo ATHLETE
code = code.replace(
  'if (activeTab === "builder" || activeTab === "coachDashboard")',
  'if (activeTab === "builder" || activeTab === "coachDashboard" || activeTab === "methodologies")'
);

// F. Rendering tab MethodologiesGuide
const targetAnalytics = '{/* TAB 7: ANALYTICS & STORICO COMPLETO */}';
if (code.includes(targetAnalytics) && !code.includes('<MethodologiesGuide />')) {
  const tabRender = `{/* TAB COACH: METODOLOGIE & LINEE GUIDA */}
          {activeTab === "methodologies" && (
            <MethodologiesGuide />
          )}

          ` + targetAnalytics;
  code = code.replace(targetAnalytics, tabRender);
  console.log("[OK] Rendering di MethodologiesGuide innestato.");
}

fs.writeFileSync(pagePath, code, 'utf8');
console.log("[OK] app/page.tsx salvato.");

// 3. Build & Push
console.log("\n--> Avvio verifica build Next.js (npm run build)...");
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log("\n[SUCCESS] BUILD SUPERATA CON SUCCESSO SENZA ERRORI!");

  if (fs.existsSync(`${pagePath}.bak`)) fs.unlinkSync(`${pagePath}.bak`);

  console.log("--> Git add, commit e push...");
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "feat(coach): complete phase 1 methodologies guide screen and sidebar navigation"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log("\n=== FASE 1 CHIUSA E DEPLOYATA CON SUCCESSO! ===");
} catch (err) {
  console.error("\n[ERRORE BUILD] Riscontrato errore durante il build. Ripristino backup...");
  if (fs.existsSync(`${pagePath}.bak`)) {
    fs.copyFileSync(`${pagePath}.bak`, pagePath);
    console.log("[OK] app/page.tsx ripristinato dal backup.");
  }
  process.exit(1);
}
