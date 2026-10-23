const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("=== [TOP GYM] UNROLLING COMPLETO MENU LATERALE COACH ===");

const pagePath = path.join(process.cwd(), 'app', 'page.tsx');
let code = fs.readFileSync(pagePath, 'utf8');

// Troviamo il blocco <nav className="space-y-1"> ... </nav> della sidebar coach
const navStartMarker = '<nav className="space-y-1">';
const navStartIdx = code.indexOf(navStartMarker);

if (navStartIdx === -1) {
  console.error("[ERRORE] Blocco <nav> sidebar non trovato in app/page.tsx");
  process.exit(1);
}

// Cerchiamo la chiusura </nav> successiva
const navEndIdx = code.indexOf('</nav>', navStartIdx);
if (navEndIdx === -1) {
  console.error("[ERRORE] Chiusura </nav> non trovata.");
  process.exit(1);
}

const completeNewNav = `<nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-270px)] pr-1 scrollbar-none">
              {((userRole as any) === "COACH") && (
                <button
                  type="button"
                  onClick={() => setActiveTab("coachDashboard")}
                  className={\`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer \${
                    activeTab === "coachDashboard"
                      ? "bg-white/10 text-white border border-white/15 shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }\`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span>Atleti</span>
                  </div>
                  {activeTab === "coachDashboard" && (
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveTab("builder")}
                className={\`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer \${
                  activeTab === "builder"
                    ? "bg-[#181C24] text-white border border-white/15 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }\`}
              >
                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Programmi</span>
                </div>
                {activeTab === "builder" && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
              </button>

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
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("workout")}
                className={\`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer \${
                  activeTab === "workout"
                    ? "bg-[#181C24] text-white border border-white/15 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }\`}
              >
                <div className="flex items-center gap-3">
                  <Dumbbell className="w-4 h-4 text-[#E50914]" />
                  <span>Scheda Atleta</span>
                </div>
                {activeTab === "workout" && (
                  <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("readiness")}
                className={\`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer \${
                  activeTab === "readiness"
                    ? "bg-[#181C24] text-white border border-white/15 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }\`}
              >
                <div className="flex items-center gap-3">
                  <Gauge className="w-4 h-4 text-green-400" />
                  <span>Check Readiness</span>
                </div>
                {activeTab === "readiness" && (
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("analytics")}
                className={\`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer \${
                  activeTab === "analytics"
                    ? "bg-[#181C24] text-white border border-white/15 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }\`}
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span>Progressi & Analisi</span>
                </div>
                {activeTab === "analytics" && (
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("records")}
                className={\`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer \${
                  activeTab === "records"
                    ? "bg-[#181C24] text-white border border-white/15 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }\`}
              >
                <div className="flex items-center gap-3">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>Record Personali</span>
                </div>
                {activeTab === "records" && (
                  <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("goals")}
                className={\`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer \${
                  activeTab === "goals"
                    ? "bg-[#181C24] text-white border border-white/15 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }\`}
              >
                <div className="flex items-center gap-3">
                  <Target className="w-4 h-4 text-rose-400" />
                  <span>Obiettivi</span>
                </div>
                {activeTab === "goals" && (
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("chat")}
                className={\`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer \${
                  activeTab === "chat"
                    ? "bg-[#181C24] text-white border border-white/15 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }\`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  <span>Chat & Assistenza</span>
                </div>
                {activeTab === "chat" && (
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("leaderboard")}
                className={\`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer \${
                  activeTab === "leaderboard"
                    ? "bg-[#181C24] text-white border border-white/15 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }\`}
              >
                <div className="flex items-center gap-3">
                  <Medal className="w-4 h-4 text-amber-400" />
                  <span>Classifica</span>
                </div>
                {activeTab === "leaderboard" && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className={\`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer \${
                  activeTab === "settings"
                    ? "bg-[#181C24] text-white border border-white/15 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }\`}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-zinc-300" />
                  <span>Impostazioni</span>
                </div>
                {activeTab === "settings" && (
                  <span className="w-2 h-2 rounded-full bg-zinc-300 animate-pulse"></span>
                )}
              </button>
            </nav>`;

code = code.slice(0, navStartIdx) + completeNewNav + code.slice(navEndIdx + '</nav>'.length);

fs.writeFileSync(pagePath, code, 'utf8');
console.log("[OK] Menu laterale aggiornato con tutti i pulsanti srotolati e visibili.");

// Verifica Build Next.js & Git Push
console.log("\n--> Avvio verifica build (npm run build)...");
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log("\n[SUCCESS] BUILD SUPERATA CON SUCCESSO!");

  console.log("--> Esecuzione Git commit e push...");
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "feat(coach): unroll all modules in left sidebar, removing dropdown container"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log("\n=== TUTTI I PULSANTI SONO ORA VISIBILI E ATTIVI NELLA SIDEBAR! ===");
} catch (err) {
  console.error("\n[ERRORE BUILD] Errore riscontrato durante la build:", err.message);
  process.exit(1);
}
