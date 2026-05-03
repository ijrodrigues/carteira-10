// estado de unidade para cada campo de período (padrão: anos)
const units = { totalPeriod: 'anos', maturityA: 'anos', maturityB: 'anos' };

function getValueInMonths(fieldId) {
  const val = parseFloat(document.getElementById(fieldId).value) || 0;
  return units[fieldId] === 'anos' ? Math.round(val * 12) : Math.round(val);
}

function setUnit(fieldId, newUnit, clickedBtn) {
  if (newUnit === units[fieldId]) return;
  const input = document.getElementById(fieldId);
  const val = parseFloat(input.value) || 0;

  if (newUnit === 'meses') {
    input.value = Math.round(val * 12);
    input.step = '1';
    input.min  = '1';
  } else {
    const years = val / 12;
    input.value = years % 1 === 0 ? years : parseFloat(years.toFixed(1));
    input.step = '0.5';
    input.min  = '0.5';
  }

  units[fieldId] = newUnit;
  clickedBtn.parentElement.querySelectorAll('.unit-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.unit === newUnit);
  });

  if (fieldId === 'maturityA') updateIRHint('A');
  if (fieldId === 'maturityB') updateIRHint('B');
}

// tabela IR regressiva: cada reaplicação começa do zero de prazo
function getIRRate(days) {
  if (days <= 180) return 0.225;
  if (days <= 360) return 0.200;
  if (days <= 720) return 0.175;
  return 0.150;
}

function irRateLabel(days) {
  if (days <= 180) return { label: '22,5%', cls: 'aliq-danger' };
  if (days <= 360) return { label: '20,0%', cls: 'aliq-warn'   };
  if (days <= 720) return { label: '17,5%', cls: 'aliq-dim'    };
  return               { label: '15,0%', cls: 'aliq-accent' };
}

function fmt(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function fmtPct(value, decimals = 2) {
  return value.toFixed(decimals).replace('.', ',') + '%';
}

// ── cálculo principal ────────────────────────────────────────────
function calcInvestment(initialAmount, totalMonths, maturityMonths, baseRateAnnual, ratePercent, type) {
  const effectiveAnnual = (ratePercent / 100) * (baseRateAnnual / 100);
  const monthlyRate = Math.pow(1 + effectiveAnnual, 1 / 12) - 1;
  const isExempt = type === 'lci_lca';

  let principal = initialAmount;
  let totalIR = 0;
  let totalGross = 0;
  let elapsed = 0;
  const cycles = [];

  while (elapsed < totalMonths) {
    const cycleMonths = Math.min(maturityMonths, totalMonths - elapsed);
    const partial = cycleMonths < maturityMonths;
    const days = cycleMonths * 30;

    const grossFactor = Math.pow(1 + monthlyRate, cycleMonths);
    const grossEarnings = principal * (grossFactor - 1);

    const irRate = isExempt ? 0 : getIRRate(days);
    const irAmount = grossEarnings * irRate;
    const netEarnings = grossEarnings - irAmount;
    const finalPrincipal = principal + netEarnings;

    cycles.push({
      num: cycles.length + 1,
      startMonth: elapsed + 1,
      endMonth: elapsed + cycleMonths,
      partial,
      initialPrincipal: principal,
      grossEarnings,
      irRate,
      irAmount,
      netEarnings,
      finalPrincipal,
      days
    });

    totalIR += irAmount;
    totalGross += grossEarnings;
    principal = finalPrincipal;
    elapsed += cycleMonths;
  }

  const netEarnings = principal - initialAmount;
  const totalYears = totalMonths / 12;
  const effectiveAnnualReturn = (Math.pow(principal / initialAmount, 1 / totalYears) - 1) * 100;

  return { finalAmount: principal, totalGross, totalIR, netEarnings, effectiveAnnualReturn, cycles, isExempt };
}

// ── renderiza resultados num card ────────────────────────────────
function renderResults(res, type, containerId) {
  const el = document.getElementById(containerId);
  const { finalAmount, totalGross, totalIR, netEarnings, effectiveAnnualReturn, cycles, isExempt } = res;

  const irCard = isExempt
    ? `<div class="metric-card">
         <div class="metric-label">IR pago</div>
         <div class="metric-value dim">isento</div>
       </div>`
    : `<div class="metric-card">
         <div class="metric-label">IR pago</div>
         <div class="metric-value danger">${fmt(totalIR)}</div>
       </div>`;

  const cycleRows = cycles.map(c => {
    const periodLabel = c.partial
      ? `${c.num}° <span class="td-partial">parcial</span>`
      : `${c.num}°`;
    const rangeLabel = `${c.startMonth}–${c.endMonth}`;

    const irCells = isExempt
      ? `<td class="td-exempt">—</td><td class="td-exempt">—</td>`
      : `<td class="td-ir">${fmtPct(c.irRate * 100, 1)}</td><td class="td-ir">${fmt(c.irAmount)}</td>`;

    return `
      <tr>
        <td>${periodLabel} <span style="color:var(--ink-faint);font-weight:400">(m.${rangeLabel})</span></td>
        <td>${fmt(c.initialPrincipal)}</td>
        <td>${fmt(c.grossEarnings)}</td>
        ${irCells}
        <td class="td-final">${fmt(c.finalPrincipal)}</td>
      </tr>`;
  }).join('');

  el.innerHTML = `
    <div class="metrics-grid">
      <div class="metric-card span-2">
        <div class="metric-label">valor final</div>
        <div class="metric-value accent big">${fmt(finalAmount)}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">rendimento líquido</div>
        <div class="metric-value">${fmt(netEarnings)}</div>
      </div>
      ${irCard}
      <div class="metric-card">
        <div class="metric-label">retorno a.a. líquido</div>
        <div class="metric-value">${fmtPct(effectiveAnnualReturn)}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">ciclos de reaplicação</div>
        <div class="metric-value dim">${cycles.length}×</div>
      </div>
    </div>
    <button class="history-toggle" id="toggle-${containerId}" onclick="toggleHistory('hw-${containerId}', this)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
      ver histórico de ciclos
    </button>
    <div class="history-wrap hidden" id="hw-${containerId}">
      <table class="history-table">
        <thead>
          <tr>
            <th>ciclo</th>
            <th>saldo inicial</th>
            <th>rend. bruto</th>
            <th>alíq. IR</th>
            <th>IR pago</th>
            <th>saldo final</th>
          </tr>
        </thead>
        <tbody>${cycleRows}</tbody>
      </table>
    </div>
  `;

  el.classList.remove('hidden');
}

function toggleHistory(histId, btn) {
  const el = document.getElementById(histId);
  const opening = el.classList.contains('hidden');
  el.classList.toggle('hidden', !opening);
  btn.classList.toggle('open', opening);
  const textNode = btn.lastChild;
  textNode.textContent = opening ? ' ocultar histórico' : ' ver histórico de ciclos';
}

// ── renderiza comparativo ────────────────────────────────────────
function renderComparison(nameA, resA, nameB, resB) {
  const aWins = resA.finalAmount >= resB.finalAmount;
  const winner = aWins ? nameA : nameB;
  const diff = Math.abs(resA.finalAmount - resB.finalAmount);
  const base = aWins ? resB.finalAmount : resA.finalAmount;
  const diffPct = (diff / base) * 100;

  document.getElementById('panelA').classList.toggle('winner', aWins);
  document.getElementById('panelB').classList.toggle('winner', !aWins);

  function cell(valA, valB, higherIsBetter = true) {
    const aHigher = valA >= valB;
    const aBetter = higherIsBetter ? aHigher : !aHigher;
    const bBetter = !aBetter;
    const clsA = aBetter ? 'td-winner td-pos' : '';
    const clsB = bBetter ? 'td-winner td-pos' : '';
    return [clsA, clsB];
  }

  function irCell(valA, valB) {
    const aLower = valA <= valB;
    const clsA = aLower ? 'td-ir-lower' : 'td-ir-higher';
    const clsB = !aLower ? 'td-ir-lower' : 'td-ir-higher';
    return [clsA, clsB];
  }

  const [fA, fB]   = cell(resA.finalAmount, resB.finalAmount);
  const [gA, gB]   = cell(resA.totalGross, resB.totalGross);
  const [irA, irB] = irCell(resA.totalIR, resB.totalIR);
  const [nA, nB]   = cell(resA.netEarnings, resB.netEarnings);
  const [eA, eB]   = cell(resA.effectiveAnnualReturn, resB.effectiveAnnualReturn);

  const irLabelA = resA.isExempt ? 'isento' : fmt(resA.totalIR);
  const irLabelB = resB.isExempt ? 'isento' : fmt(resB.totalIR);
  const irClsA   = resA.isExempt ? 'td-ir-lower' : irA;
  const irClsB   = resB.isExempt ? 'td-ir-lower' : irB;

  const section = document.getElementById('comparisonSection');
  section.innerHTML = `
    <div class="comparison-header">
      <div class="comparison-title">comparativo</div>
      <div class="winner-badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        ${winner} vence — +${fmt(diff)} (${fmtPct(diffPct)})
      </div>
    </div>
    <table class="comparison-table">
      <thead>
        <tr>
          <th></th>
          <th>${nameA}</th>
          <th>${nameB}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>valor final</td>
          <td class="${fA}">${fmt(resA.finalAmount)}</td>
          <td class="${fB}">${fmt(resB.finalAmount)}</td>
        </tr>
        <tr>
          <td>rendimento bruto total</td>
          <td class="${gA}">${fmt(resA.totalGross)}</td>
          <td class="${gB}">${fmt(resB.totalGross)}</td>
        </tr>
        <tr>
          <td>IR total pago</td>
          <td class="${irClsA}">${irLabelA}</td>
          <td class="${irClsB}">${irLabelB}</td>
        </tr>
        <tr>
          <td>rendimento líquido</td>
          <td class="${nA}">${fmt(resA.netEarnings)}</td>
          <td class="${nB}">${fmt(resB.netEarnings)}</td>
        </tr>
        <tr>
          <td>retorno a.a. (líquido)</td>
          <td class="${eA}">${fmtPct(resA.effectiveAnnualReturn)}</td>
          <td class="${eB}">${fmtPct(resB.effectiveAnnualReturn)}</td>
        </tr>
        <tr>
          <td>ciclos de reaplicação</td>
          <td>${resA.cycles.length}×</td>
          <td>${resB.cycles.length}×</td>
        </tr>
      </tbody>
    </table>
  `;

  section.classList.remove('hidden');
  setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

// ── atualiza hint de IR sob os inputs ───────────────────────────
function updateIRHint(suffix) {
  const type = document.getElementById('type' + suffix).value;
  const hint = document.getElementById('irHint' + suffix);

  if (type === 'lci_lca') {
    hint.innerHTML = `<span class="aliq aliq-exempt">isento de IR</span> — rendimento sempre líquido`;
    return;
  }

  const days = getValueInMonths('maturity' + suffix) * 30;
  const { label, cls } = irRateLabel(days);
  hint.innerHTML = `alíquota por vencimento: <span class="aliq ${cls}">${label}</span>`;
}

// ── main ─────────────────────────────────────────────────────────
function calculate() {
  const initialAmount = parseFloat(document.getElementById('initialAmount').value) || 10000;
  const totalMonths   = getValueInMonths('totalPeriod') || 120;
  const baseRate      = parseFloat(document.getElementById('baseRate').value)      || 14.5;

  const invs = ['A', 'B'].map(s => ({
    name:     document.getElementById('name'    + s).value || 'Investimento ' + s,
    type:     document.getElementById('type'    + s).value,
    rate:     parseFloat(document.getElementById('rate'    + s).value) || 100,
    maturity: getValueInMonths('maturity' + s) || 1,
  }));

  const resA = calcInvestment(initialAmount, totalMonths, invs[0].maturity, baseRate, invs[0].rate, invs[0].type);
  const resB = calcInvestment(initialAmount, totalMonths, invs[1].maturity, baseRate, invs[1].rate, invs[1].type);

  renderResults(resA, invs[0].type, 'resultsA');
  renderResults(resB, invs[1].type, 'resultsB');
  renderComparison(invs[0].name, resA, invs[1].name, resB);
}

// ── live hint updates ────────────────────────────────────────────
['A', 'B'].forEach(s => {
  document.getElementById('type'    + s).addEventListener('change', () => updateIRHint(s));
  document.getElementById('maturity'+ s).addEventListener('input',  () => updateIRHint(s));
});

// inicializa hints
updateIRHint('A');
updateIRHint('B');

// calcula ao apertar Enter em qualquer input
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('keydown', e => { if (e.key === 'Enter') calculate(); });
});
