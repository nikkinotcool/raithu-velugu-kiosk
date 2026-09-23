/**
 * Official Digital PACS Member Passbook Slip Generator
 * Raithu Velugu - PACS Legal & Cooperative Governance AI Kiosk
 * Ministry of Cooperation, Govt. of India / Dept. of Cooperation, Telangana
 */

export function generatePassbookHtml(currentUser, passbookData = {}) {
  const memberId = currentUser?.member_id || 'PACS-SRD-1042';
  const name = currentUser?.full_name || 'Farmer / Member';
  const phone = currentUser?.phone_number || 'N/A';
  const pacsName = currentUser?.pacs_name || 'Kandi Primary Agricultural Credit Society';
  const village = currentUser?.village || 'Kandi';
  const mandal = currentUser?.mandal || 'Sangareddy';
  const district = currentUser?.district || 'Sangareddy';
  const state = currentUser?.state || 'Telangana';

  const loanDisbursed = passbookData.loanDisbursed || '₹1,50,000';
  const loanLimit = passbookData.loanLimit || '₹3,00,000';
  const loanDue = passbookData.loanDue || '31-March-2027';
  const interestRate = passbookData.interestRate || '4.0% p.a. (Subvention Applied)';

  const ureaBal = passbookData.ureaBal || '4 Bags (8 Lifted / 12 Quota)';
  const dapBal = passbookData.dapBal || '0 Bags (6 Lifted / 6 Quota)';
  const complexBal = passbookData.complexBal || '3 Bags (5 Lifted / 8 Quota)';

  const insurancePolicy = passbookData.insurancePolicy || 'PMFBY/TS/SRD/2026/08892';
  const sumInsured = passbookData.sumInsured || '₹1,85,500';
  const premiumPaid = passbookData.premiumPaid || '₹3,710 (2% Farmer Share)';

  const landArea = passbookData.landArea || '3.50 Acres (Sy. No. 142/A, 143/B)';
  const khataNo = passbookData.khataNo || 'KH-894 (Kandi)';

  const issueDate = new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PACS Member Passbook - ${memberId}</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 20px;
      line-height: 1.45;
    }
    .passbook-box {
      max-width: 740px;
      margin: 0 auto;
      border: 2px solid #047857;
      border-radius: 14px;
      padding: 28px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    .header {
      text-align: center;
      border-bottom: 2px dashed #cbd5e1;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .gov-badge {
      font-size: 11px;
      font-weight: 800;
      color: #047857;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 4px;
    }
    .pacs-title {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      margin: 4px 0;
    }
    .doc-subtitle {
      font-size: 13px;
      font-weight: 600;
      color: #475569;
    }
    .status-badge {
      display: inline-block;
      margin-top: 8px;
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 18px;
      background: #f8fafc;
      padding: 14px;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
      font-size: 12px;
    }
    .meta-item strong {
      display: block;
      color: #64748b;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    .section-title {
      font-size: 13px;
      font-weight: 800;
      color: #065f46;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin: 16px 0 8px 0;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }
    .table-custom {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin-bottom: 14px;
    }
    .table-custom th, .table-custom td {
      border: 1px solid #e2e8f0;
      padding: 8px 10px;
      text-align: left;
    }
    .table-custom th {
      background: #f1f5f9;
      font-weight: 700;
      color: #334155;
    }
    .stat-val {
      font-weight: 700;
      color: #0f172a;
    }
    .footer-signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 32px;
      padding-top: 18px;
      border-top: 1px solid #e2e8f0;
    }
    .sign-box {
      text-align: center;
      width: 180px;
      font-size: 11px;
      color: #475569;
    }
    .sign-line {
      border-top: 1px dashed #94a3b8;
      margin-top: 36px;
      padding-top: 6px;
      font-weight: 600;
    }
    .official-seal {
      width: 70px;
      height: 70px;
      border: 2px dashed #047857;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      font-weight: 800;
      color: #047857;
      text-transform: uppercase;
      text-align: center;
      margin: 0 auto;
    }
    .disclaimer {
      margin-top: 18px;
      font-size: 10px;
      color: #64748b;
      text-align: center;
      line-height: 1.4;
      background: #f8fafc;
      padding: 8px;
      border-radius: 6px;
    }
    @media print {
      body { padding: 0; }
      .passbook-box { border: none; box-shadow: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="passbook-box">
    <!-- Header -->
    <div class="header">
      <div class="gov-badge">Ministry of Cooperation • Govt. of India • National Cooperative Database</div>
      <div class="pacs-title">${pacsName}</div>
      <div class="doc-subtitle">DIGITAL PACS MEMBER CREDIT & ENTITLEMENT PASSBOOK (సభ్యత్వ పాస్‌బుక్)</div>
      <div class="status-badge">✓ ACTIVE SHAREHOLDER (ఓటు హక్కు గల సభ్యుడు)</div>
    </div>

    <!-- Member Basic Info -->
    <div class="meta-grid">
      <div class="meta-item">
        <strong>Member Name & Identification</strong>
        <span class="stat-val">${name}</span>
      </div>
      <div class="meta-item">
        <strong>PACS Membership ID</strong>
        <span class="stat-val">${memberId}</span>
      </div>
      <div class="meta-item">
        <strong>Registered Mobile Number</strong>
        <span class="stat-val">${phone}</span>
      </div>
      <div class="meta-item">
        <strong>Pattadar Khata & Land Holding</strong>
        <span class="stat-val">${khataNo} • ${landArea}</span>
      </div>
      <div class="meta-item">
        <strong>Jurisdiction</strong>
        <span class="stat-val">${village} Vill, ${mandal} Mdl, ${district} Dist (${state})</span>
      </div>
      <div class="meta-item">
        <strong>Share Capital Held</strong>
        <span class="stat-val">₹15,000 (150 Shares @ ₹100 each)</span>
      </div>
    </div>

    <!-- KCC Crop Loan Ledger -->
    <div class="section-title">1. Kisan Credit Card (KCC) Crop Loan Ledger (క్రాప్ లోన్ ఖాతా)</div>
    <table class="table-custom">
      <thead>
        <tr>
          <th>Loan Facility</th>
          <th>Sanction Limit</th>
          <th>Current Disbursed</th>
          <th>Interest Subvention</th>
          <th>Repayment Due</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Kharif Short-Term Crop Loan</strong></td>
          <td>${loanLimit}</td>
          <td class="stat-val">${loanDisbursed}</td>
          <td>${interestRate}</td>
          <td style="color: #b91c1c; font-weight: 700;">${loanDue}</td>
        </tr>
      </tbody>
    </table>

    <!-- Seasonal Fertilizer & Seed Quota -->
    <div class="section-title">2. Seasonal Fertilizer & Seed Distribution (రసాయన ఎరువుల కోటా)</div>
    <table class="table-custom">
      <thead>
        <tr>
          <th>Subsidized Input</th>
          <th>Government Quota</th>
          <th>Quantity Lifted</th>
          <th>Balance Entitlement</th>
          <th>Distribution Rate</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Neem Coated Urea (45 kg)</strong></td>
          <td>12 Bags</td>
          <td>8 Bags</td>
          <td class="stat-val" style="color: #047857;">4 Bags Available</td>
          <td>₹266.50 / bag (DBT)</td>
        </tr>
        <tr>
          <td><strong>DAP (50 kg)</strong></td>
          <td>6 Bags</td>
          <td>6 Bags</td>
          <td class="stat-val" style="color: #64748b;">0 Bags (Fully Lifted)</td>
          <td>₹1,350.00 / bag</td>
        </tr>
        <tr>
          <td><strong>NPK Complex (20:20:0:13)</strong></td>
          <td>8 Bags</td>
          <td>5 Bags</td>
          <td class="stat-val" style="color: #047857;">3 Bags Available</td>
          <td>₹1,200.00 / bag</td>
        </tr>
        <tr>
          <td><strong>Certified Paddy Seed (RNR 15048)</strong></td>
          <td>4 Bags (30 kg)</td>
          <td>4 Bags</td>
          <td class="stat-val" style="color: #64748b;">Completed (50% DBT Subsidy)</td>
          <td>₹1,150.00 / bag</td>
        </tr>
      </tbody>
    </table>

    <!-- PMFBY Crop Insurance Status -->
    <div class="section-title">3. PMFBY Crop Insurance Coverage (పంట బీమా వివరాలు)</div>
    <div class="meta-grid">
      <div class="meta-item">
        <strong>Insurance Policy Number</strong>
        <span class="stat-val">${insurancePolicy}</span>
      </div>
      <div class="meta-item">
        <strong>Insured Crop & Acreage</strong>
        <span class="stat-val">Paddy (Fine Variety) — 3.50 Acres</span>
      </div>
      <div class="meta-item">
        <strong>Total Sum Insured</strong>
        <span class="stat-val" style="color: #047857;">${sumInsured}</span>
      </div>
      <div class="meta-item">
        <strong>Farmer Premium Paid</strong>
        <span class="stat-val">${premiumPaid}</span>
      </div>
      <div class="meta-item">
        <strong>Underwriting Insurance Firm</strong>
        <span class="stat-val">Agriculture Insurance Company of India (AIC)</span>
      </div>
      <div class="meta-item">
        <strong>Statutory 72-Hr Loss Reporting</strong>
        <span class="stat-val" style="color: #b45309;">Eligible via Kiosk or Toll-Free 14447</span>
      </div>
    </div>

    <!-- Signatures -->
    <div class="footer-signatures">
      <div class="sign-box">
        <div class="sign-line">Member Farmer Signature / Thumb</div>
      </div>
      <div class="official-seal">
        PACS<br/>OFFICIAL<br/>SEAL
      </div>
      <div class="sign-box">
        <div class="sign-line">Secretary / Chief Executive<br/>${pacsName}</div>
      </div>
    </div>

    <div class="disclaimer">
      This is a digitally generated statutory record slip from the <strong>Raithu Velugu PACS Self-Service Kiosk</strong>, synchronized with the National Cooperative Database (NCD) and District Central Cooperative Bank (DCCB).<br/>
      Generated on: ${issueDate} | PACS Kiosk Session ID: RV-PASS-${Date.now()}
    </div>
  </div>
</body>
</html>`;
}

export function printPassbookSlip(currentUser, passbookData = {}) {
  const html = generatePassbookHtml(currentUser, passbookData);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 450);
  } else {
    alert('Please allow pop-ups in your browser to print the PACS Member Passbook slip.');
  }
}

export function downloadPassbookSlip(currentUser, passbookData = {}) {
  const html = generatePassbookHtml(currentUser, passbookData);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `PACS_Passbook_${currentUser?.member_id || 'MEMBER'}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
