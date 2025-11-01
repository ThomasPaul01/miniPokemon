export async function post(url, data) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  let json;
  try { json = await res.json(); } catch { json = await res.text(); }
  return json;
}

export async function get(url) {
  const res = await fetch(url);
  let json;
  try { json = await res.json(); } catch { json = await res.text(); }
  return json;
}

export function $(id) {
  if (typeof id === 'string' && id.startsWith('#')) id = id.slice(1);
  return document.getElementById(id);
}

export function formatObject(obj) {
  if (!obj || typeof obj !== 'object') return String(obj);
  return Object.entries(obj).map(([k, v]) => `${k} : ${JSON.stringify(v)}`).join('\n');
}

export function formatResult(result) {
  if (typeof result === 'string') return result;
  if (result && result.error) return 'Erreur : ' + result.error;
  if (Array.isArray(result)) return result.map(formatObject).join('\n---\n');
  return formatObject(result);
}

export function renderTable(items) {
  if (!Array.isArray(items) || items.length === 0) return '<em>Aucune donnée</em>';
  const keys = Object.keys(items[0]);
  const header = keys.map(k => `<th>${k}</th>`).join('');
  const rows = items.map(it => `<tr>${keys.map(k => `<td>${escapeHtml(String(it[k]))}</td>`).join('')}</tr>`).join('');
  return `<table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table>`;
}

export function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function hpBar(pv) {
  const pct = Math.max(0, Math.min(100, Number(pv)));
  return `<div class="hp-bar"><div class="hp-fill" style="width:${pct}%;"></div></div>`;
}
