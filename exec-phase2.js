const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("=== [TOP GYM] AVVIO ESECUZIONE FASE 2: BONIFICA SEZIONE PROGRAMMI ===");

const pagePath = path.join(process.cwd(), 'app', 'page.tsx');
fs.copyFileSync(pagePath, `${pagePath}.bak`);

let code = fs.readFileSync(pagePath, 'utf8');

// 1. Helper per rimuovere un blocco JSX bilanciando i tag <div ...> e </div>
function removeBalancedDiv(source, searchMarker) {
  const markerIdx = source.indexOf(searchMarker);
  if (markerIdx === -1) return source;

  const divStart = source.indexOf('<div', markerIdx);
  if (divStart === -1) return source;

  let depth = 0;
  let idx = divStart;
  let divEnd = -1;

  while (idx < source.length) {
    if (source.slice(idx, idx + 4) === '<div') {
      depth++;
      idx += 4;
    } else if (source.slice(idx, idx + 6) === '</div>') {
      depth--;
      idx += 6;
      if (depth === 0) {
        divEnd = idx;
        break;
      }
    } else {
      idx++;
    }
  }

  if (divEnd !== -1) {
    // Rimuoviamo anche il commento di intestazione se presente
    const prevComment = source.lastIndexOf('{/*', markerIdx);
    const cutStart = (prevComment !== -1 && prevComment > markerIdx - 200) ? prevComment : divStart;
    return source.slice(0, cutStart) + source.slice(divEnd);
  }
  return source;
}

// 2. Rimozione Import e State di Over 40 e Sondaggio Wizard
code = code.replace(/import Over40QuickModal from ['"]@\/components\/Over40QuickModal['"];?\r?\n?/, "");
code = code.replace(/const\s+\[isOver40ModalOpen,\s*setIsOver40ModalOpen\]\s*=\s*useState\(false\);?/, "// over40 modal removed");
code = code.replace(/const\s+\[isWizardOpen,\s*setIsWizardOpen\]\s*=\s*useState<boolean>\(false\);?/, "// wizard modal removed");
console.log("[OK] Rimossi import e state Over 40 / Sondaggio.");

// 3. Rimozione Blocco Pulsanti e Modali Over 40 + Sondaggio (righe ~3780-3815)
const surveyMarker = '{/* ACCESSO AL GENERATORE SONDAGGIO:';
const surveyIdx = code.indexOf(surveyMarker);
if (surveyIdx !== -1) {
  const nextSectionTarget = '{/* TAB 6: BUILDER COACH METODO TOPGYM */}';
  const nextSectionIdx = code.indexOf(nextSectionTarget, surveyIdx);
  if (nextSectionIdx !== -1) {
    const startCut = code.lastIndexOf('{/* ======================================================================', surveyIdx);
    const endCut = code.lastIndexOf('{/* ======================================================================', nextSectionIdx);
    if (startCut !== -1 && endCut !== -1) {
      code = code.slice(0, startCut) + code.slice(endCut + '{/* ====================================================================== */}\n'.length);
      console.log("[OK] Blocco pulsanti & modali Over 40 / Sondaggio rimosso.");
    }
  }
}

// Pulizia di sicurezza componenti orfani residui se presenti
code = code.replace(/<Over40QuickModal[\s\S]*?\/>/g, "");
code = code.replace(/<WorkoutWizardModal[\s\S]*?\/>/g, "");

// 4. Rimozione Hub Metodologico: Blocco Esteso 3 Cluster
const before3ClusterLen = code.length;
code = removeBalancedDiv(code, 'HUB METODOLOGICO TOP GYM: 3 CLUSTER SCIENTIFICI');
if (code.length < before3ClusterLen) {
  console.log("[OK] Blocco 3 Cluster Hub Metodologico rimosso.");
}

// 5. Rimozione Hub Metodologico: Barra Compatta
const beforeCompactLen = code.length;
code = removeBalancedDiv(code, 'HUB METODOLOGICO TOP GYM: BARRA COMPATTA');
if (code.length < beforeCompactLen) {
  console.log("[OK] Barra Compatta Hub Metodologico rimossa.");
}

// Salva modifiche
fs.writeFileSync(pagePath, code, 'utf8');
console.log("[OK] app/page.tsx aggiornato e salvato su disco.");

// 6. Verifica Build & Git Push
console.log("\n--> Avvio verifica build Next.js (npm run build)...");
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log("\n[SUCCESS] BUILD SUPERATA SENZA ERRORI!");

  if (fs.existsSync(`${pagePath}.bak`)) fs.unlinkSync(`${pagePath}.bak`);

  console.log("--> Git add, commit e push...");
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "refactor(coach): complete phase 2 remove over40, survey and redundant methodology hub"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log("\n=== FASE 2 COMPLETATA E DEPLOYATA CON SUCCESSO! ===");
} catch (err) {
  console.error("\n[ERRORE BUILD] Errore riscontrato. Ripristino backup...");
  if (fs.existsSync(`${pagePath}.bak`)) {
    fs.copyFileSync(`${pagePath}.bak`, pagePath);
    console.log("[OK] app/page.tsx ripristinato dal backup.");
  }
  process.exit(1);
}
