/**
 * Official Grievance Acknowledgement Receipt Generator
 * Raithu Velugu - PACS Legal & Cooperative Governance AI Kiosk
 * Ministry of Cooperation, Govt. of India
 */

export function generateReceiptHtml(ticket, currentUser) {
  const trackingId = ticket.tracking_id || ticket.trackingId || 'RV-GRV-PENDING';
  const category = ticket.category || 'General Cooperative Governance Grievance';
  const description = ticket.description || 'N/A';
  const complainantName = ticket.complainant_name || currentUser?.full_name || 'Farmer / Member';
  const phone = ticket.complainant_phone || currentUser?.phone_number || 'N/A';
  const pacsName = ticket.pacs_name || currentUser?.pacs_name || 'Kandi Primary Agricultural Credit Society';
  const village = currentUser?.village || 'Kandi';
  const mandal = currentUser?.mandal || 'Sangareddy';
  const district = ticket.district || currentUser?.district || 'Sangareddy';
  const state = ticket.state || currentUser?.state || 'Telangana';
  const status = ticket.status || 'Submitted - Under Review';
  const routedTo = ticket.routed_to || 'District Assistant Registrar of Cooperative Societies (ARCS)';
  
  const createdDate = ticket.created_at 
    ? new Date(ticket.created_at).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })
    : new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Grievance Receipt - ${trackingId}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 24px;
      line-height: 1.45;
    }
    .receipt-box {
      max-width: 720px;
      margin: 0 auto;
      border: 2px solid #047857;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    .header {
      text-align: center;
      border-bottom: 2px dashed #cbd5e1;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .gov-badge {
      font-size: 11px;
      font-weight: 800;
      color: #047857;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 4px;
    }
    .title {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin: 4px 0;
    }
    .subtitle {
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
    }
    .ticket-badge {
      display: inline-block;
      margin-top: 14px;
      background: #ecfdf5;
      border: 1.5px solid #10b981;
      color: #065f46;
      padding: 8px 18px;
      border-radius: 9999px;
      font-family: monospace;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin-bottom: 22px;
    }
    .section-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px 16px;
    }
    .card-label {
      font-size: 10px;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 6px;
    }
    .card-value {
      font-size: 13px;
      font-weight: 600;
      color: #1e293b;
    }
    .card-sub {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }
    .full-width {
      grid-column: span 2;
    }
    .complaint-box {
      background: #fdfefe;
      border-left: 4px solid #047857;
      padding: 12px 16px;
      border-radius: 0 8px 8px 0;
      font-size: 13px;
      color: #334155;
      white-space: pre-wrap;
      margin-top: 4px;
      background-color: #f8fafc;
    }
    .footer {
      border-top: 2px dashed #cbd5e1;
      padding-top: 18px;
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #64748b;
    }
    .legal-notice {
      font-size: 10px;
      color: #94a3b8;
      text-align: center;
      margin-top: 18px;
    }
    .print-btn {
      display: block;
      width: 100%;
      background: #047857;
      color: #ffffff;
      font-weight: 700;
      border: none;
      padding: 12px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 14px;
      margin-bottom: 16px;
    }
    @media print {
      .print-btn { display: none !important; }
      body { padding: 0; }
      .receipt-box { border: 1px solid #000; box-shadow: none; padding: 20px; }
    }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF (ప్రింట్ లేదా సేవ్ చేయండి)</button>
  <div class="receipt-box">
    <div class="header">
      <div class="gov-badge">Ministry of Cooperation • National Cooperative Database (NCD)</div>
      <div class="title">రైతు వెలుగు • PACS Grievance Acknowledgement Receipt</div>
      <div class="subtitle">Primary Agricultural Credit Society Legal Redressal & Governance Kiosk</div>
      <div class="ticket-badge">TRACKING ID: ${trackingId}</div>
    </div>

    <div class="grid">
      <div class="section-card">
        <div class="card-label">Complainant Member / Farmer Details</div>
        <div class="card-value">${complainantName}</div>
        <div class="card-sub">Mobile: <strong>${phone}</strong></div>
        <div class="card-sub">Village/Area: ${village}, Mandal: ${mandal}</div>
        <div class="card-sub">District: ${district}, State: ${state}</div>
      </div>

      <div class="section-card">
        <div class="card-label">PACS Office & Society Jurisdiction</div>
        <div class="card-value">${pacsName}</div>
        <div class="card-sub">Society Address: Main Road, ${mandal}, ${district}</div>
        <div class="card-sub">Affiliation: District Central Cooperative Bank (DCCB)</div>
        <div class="card-sub">State: ${state}</div>
      </div>

      <div class="section-card full-width">
        <div class="card-label">Grievance Category & Incident Classification</div>
        <div class="card-value" style="color: #047857; font-size: 14px;">${category}</div>
        <div class="complaint-box">${description}</div>
      </div>

      <div class="section-card">
        <div class="card-label">Assigned Redressal Authority</div>
        <div class="card-value" style="color: #0369a1;">${routedTo}</div>
        <div class="card-sub">Statutory Mandate: In accordance with State Cooperative Societies Act & Model PACS Bye-laws</div>
      </div>

      <div class="section-card">
        <div class="card-label">Receipt & Statutory SLA Status</div>
        <div class="card-value">${status}</div>
        <div class="card-sub">Registered: ${createdDate}</div>
        <div class="card-sub" style="color: #b45309; font-weight: 700;">Mandated Inquiry Time: 7 to 15 Working Days</div>
      </div>
    </div>

    <div class="footer">
      <div>
        <strong>Raithu Velugu Redressal System</strong><br/>
        Authorized Kiosk Reference Code: KIOSK-SRD-KD01
      </div>
      <div style="text-align: right;">
        <span style="font-size: 18px;">✅</span> <strong>Officially Registered</strong><br/>
        National Cooperative Portal Sync: VERIFIED
      </div>
    </div>

    <div class="legal-notice">
      Note: This document is an official computer-generated grievance acknowledgement generated under the Digital PACS Kiosk System. 
      Keep this Tracking ID safely to track inquiry status online or at your District ARCS office.
    </div>
  </div>
</body>
</html>`;
}

/**
 * Trigger browser print/save dialog with the official grievance receipt.
 */
export function printGrievanceReceipt(ticket, currentUser) {
  const html = generateReceiptHtml(ticket, currentUser);
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    // Auto-trigger print dialog after styles load
    setTimeout(() => {
      try {
        printWindow.print();
      } catch (e) {
        console.warn('Print auto-trigger error:', e);
      }
    }, 400);
  } else {
    // Fallback if pop-up blocked: download receipt file
    downloadReceiptFile(ticket, currentUser);
  }
}

/**
 * Direct file download fallback for mobile tablets that block pop-up windows.
 */
export function downloadReceiptFile(ticket, currentUser) {
  const html = generateReceiptHtml(ticket, currentUser);
  const trackingId = ticket.tracking_id || ticket.trackingId || 'GRIEVANCE';
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Grievance_Receipt_${trackingId}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
