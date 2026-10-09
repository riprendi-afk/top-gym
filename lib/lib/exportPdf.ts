export function exportProgramToPDF(
    athleteName: string,
    programName: string,
    programDays: any[]
  ): void {
    if (typeof window === "undefined") return;
  
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Consenti i popup nel browser per scaricare o stampare il PDF.");
      return;
    }
  
    const rowsHtml = programDays
      .map((day: any, dIdx: number) => {
        const dayTitle = day.title || `Giorno ${dIdx + 1}`;
        const exercises = Array.isArray(day.exercises) ? day.exercises : [];
        
        const exRows = exercises
          .map((ex: any) => {
            const notes = ex.notes ? `<div style="font-size:10px;color:#666;margin-top:3px;">Note: ${ex.notes}</div>` : "";
            const rec = ex.restSeconds ? `${ex.restSeconds}s` : (ex.tut || "-");
            const tech = ex.executionType || "REGULAR";
            return `
              <tr>
                <td style="padding:6px;border:1px solid #ddd;"><b>${ex.name}</b>${notes}</td>
                <td style="padding:6px;border:1px solid #ddd;text-align:center;">${ex.sets} × ${ex.reps}</td>
                <td style="padding:6px;border:1px solid #ddd;text-align:center;">${ex.targetWeight || "0"} kg</td>
                <td style="padding:6px;border:1px solid #ddd;text-align:center;">${rec}</td>
                <td style="padding:6px;border:1px solid #ddd;text-align:center;">${tech}</td>
              </tr>
            `;
          })
          .join("");
  
        return `
          <div style="margin-bottom:20px;page-break-inside:avoid;">
            <div style="background:#111;color:#fff;padding:6px 10px;font-weight:bold;font-size:14px;border-radius:4px;">
              Giorno ${day.dayNumber || dIdx + 1}: ${dayTitle}
            </div>
            <table style="width:100%;border-collapse:collapse;margin-top:6px;font-size:11px;">
              <thead>
                <tr style="background:#f0f0f0;">
                  <th style="padding:6px;border:1px solid #ddd;text-align:left;">Esercizio</th>
                  <th style="padding:6px;border:1px solid #ddd;width:15%;">Serie/Reps</th>
                  <th style="padding:6px;border:1px solid #ddd;width:15%;">Target</th>
                  <th style="padding:6px;border:1px solid #ddd;width:15%;">Rec/TUT</th>
                  <th style="padding:6px;border:1px solid #ddd;width:15%;">Tecnica</th>
                </tr>
              </thead>
              <tbody>
                ${exRows}
              </tbody>
            </table>
          </div>
        `;
      })
      .join("");
  
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Scheda - ${athleteName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #111; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div style="text-align:center;border-bottom:2px solid #E50914;padding-bottom:10px;margin-bottom:15px;">
            <h2 style="margin:0;color:#E50914;letter-spacing:1px;">TOP GYM</h2>
            <div style="font-size:13px;color:#444;margin-top:4px;">
              Atleta: <b>${athleteName}</b> — Scheda: <b>${programName}</b>
            </div>
          </div>
          ${rowsHtml}
        </body>
      </html>
    `);
  
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }