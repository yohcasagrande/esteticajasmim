/* Centro de Estética Jasmim · Lages, SC */

const WHATSAPP = '5549999562544';
const zapLink = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

/* ---------- Topo e menu ---------- */
const topo = document.querySelector('[data-topo]');
const menu = document.getElementById('menu');
const menuBotao = document.querySelector('[data-menu-botao]');

const marcarRolagem = () => topo.classList.toggle('rolou', window.scrollY > 8);
marcarRolagem();
window.addEventListener('scroll', marcarRolagem, { passive: true });

const fecharMenu = () => {
  menu.classList.remove('aberto');
  menuBotao.setAttribute('aria-expanded', 'false');
};
menuBotao.addEventListener('click', () => {
  const abrir = !menu.classList.contains('aberto');
  menu.classList.toggle('aberto', abrir);
  menuBotao.setAttribute('aria-expanded', String(abrir));
});
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', fecharMenu));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharMenu(); });
document.addEventListener('click', (e) => {
  if (menu.classList.contains('aberto') && !menu.contains(e.target) && !menuBotao.contains(e.target)) fecharMenu();
});

/* ---------- Links de WhatsApp dos tratamentos ---------- */
document.querySelectorAll('[data-zap]').forEach((a) => {
  a.href = zapLink(`Olá! Vim pelo site e quero saber mais sobre ${a.dataset.zap}.`);
  a.target = '_blank';
  a.rel = 'noopener';
});

/* ---------- Revelar ao rolar ---------- */
const revelar = document.querySelectorAll('.revelar');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entradas) => {
    entradas.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('visivel'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  revelar.forEach((el) => io.observe(el));
} else {
  revelar.forEach((el) => el.classList.add('visivel'));
}

/* ---------- Ano no rodapé ---------- */
document.querySelectorAll('[data-ano]').forEach((el) => { el.textContent = new Date().getFullYear(); });

/* ---------- Horário de atendimento ---------- */
// Dias: 0 domingo ... 6 sábado. Horários de Brasília (Lages, SC).
const HORARIO = {
  0: [], 1: [],
  2: [['13:30', '19:00']],
  3: [['13:30', '20:00']],
  4: [['13:30', '19:00']],
  5: [['09:00', '12:00'], ['13:30', '19:00']],
  6: [['09:00', '12:00']],
};
const NOMES_DIA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const minutos = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
const hora = (hhmm) => { const [h, m] = hhmm.split(':'); return `${Number(h)}h${m === '00' ? '' : m}`; };

function agoraEmLages() {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date());
  const p = Object.fromEntries(partes.map((x) => [x.type, x.value]));
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
  return { dia, min: Number(p.hour) * 60 + Number(p.minute) };
}

function statusHorario() {
  const el = document.querySelector('[data-status]');
  if (!el) return;
  const { dia, min } = agoraEmLages();
  const linhaHoje = document.querySelector(`[data-horario] tr[data-dia="${dia <= 1 ? 0 : dia}"]`);
  document.querySelectorAll('[data-horario] tr').forEach((tr) => tr.classList.remove('hoje'));
  if (linhaHoje) linhaHoje.classList.add('hoje');

  let texto;
  const aberto = HORARIO[dia].find(([a, f]) => min >= minutos(a) && min < minutos(f));
  if (aberto) {
    texto = `Aberto agora · fecha às ${hora(aberto[1])}`;
  } else {
    let prox = null;
    for (let d = 0; d < 7 && !prox; d++) {
      const diaX = (dia + d) % 7;
      const faixa = HORARIO[diaX].find(([a]) => d > 0 || minutos(a) > min);
      if (faixa) prox = { d, diaX, abre: faixa[0] };
    }
    const quando = prox.d === 0 ? 'hoje' : prox.d === 1 ? 'amanhã' : NOMES_DIA[prox.diaX];
    texto = `Fechado agora · abre ${quando} às ${hora(prox.abre)}`;
  }
  el.classList.toggle('aberto', Boolean(aberto));
  el.innerHTML = `<span class="ponto" aria-hidden="true"></span><span>${texto}</span>`;
}
statusHorario();
setInterval(statusHorario, 60000);

/* ---------- Pré-consulta: mapa dos sinais ---------- */
const AREAS = {
  energia: { nome: 'Energia e vitaminas', ver: 'vitamina D, vitamina B12 e magnésio' },
  imunidade: { nome: 'Imunidade', ver: 'vitamina C, vitamina D, zinco e NAC' },
  tireoide: { nome: 'Tireoide e metabolismo', ver: 'selênio, iodo e zinco, sempre com exames' },
  mulher: { nome: 'Mulher 40+ e menopausa', ver: 'energia, sono, memória e equilíbrio emocional' },
  pele: { nome: 'Pele, cabelo e unhas', ver: 'zinco, cobre, selênio e vitamina C' },
  digestao: { nome: 'Digestão', ver: 'hábitos à mesa e o aproveitamento dos nutrientes' },
};
const PESOS = {
  'Cansaço constante': { energia: 2, tireoide: 1 },
  'Falta de disposição': { energia: 2 },
  'Sono que não descansa': { energia: 1, mulher: 1 },
  'Dificuldade para dormir': { energia: 1, mulher: 1 },
  'Adoece com frequência': { imunidade: 2 },
  'Demora para se recuperar': { imunidade: 1, energia: 1 },
  'Queda de cabelo': { pele: 2, tireoide: 1 },
  'Unhas fracas': { pele: 2 },
  'Pele sem viço': { pele: 1, digestao: 1 },
  'Manchas que voltam': { pele: 2 },
  'Ganho de peso sem explicação': { tireoide: 2 },
  'Sente muito frio': { tireoide: 2 },
  'Inchaço': { digestao: 1, tireoide: 1 },
  'Digestão pesada ou intestino preso': { digestao: 2 },
  'Memória e foco falhando': { energia: 1, mulher: 1 },
  'Ansiedade ou irritação': { energia: 1, mulher: 1 },
  'Desânimo': { energia: 1 },
  'Ondas de calor': { mulher: 2 },
  'Ciclo irregular': { mulher: 2 },
  'Menopausa ou pré-menopausa': { mulher: 2 },
};
const CAMINHOS = {
  'Linhas de expressão': 'Toxina botulínica',
  'Flacidez e perda de contorno': 'ReestrutFace, fios e preenchedores',
  'Lábios': 'Preenchimento labial',
  'Olhar cansado ou pálpebras caídas': 'Blefaro sem corte com jato de plasma',
  'Manchas': 'Protocolo de manchas por dentro e por fora',
  'Poros e textura': 'Microagulhamento, peeling de diamante ou dermaplaning',
  'Pele opaca': 'Peeling de diamante e limpeza de pele',
};
const FOCO = { saude: 'Saúde e energia', rosto: 'Estética do rosto', ambos: 'Saúde e energia, e estética do rosto' };

const mapa = document.querySelector('[data-mapa]');
if (mapa) {
  const form = mapa.querySelector('[data-form]');
  const etapas = [...mapa.querySelectorAll('[data-etapa]')];
  const marcadores = [...mapa.querySelectorAll('[data-marcador]')];
  const barra = mapa.querySelector('[data-barra]');
  const btAvancar = mapa.querySelector('[data-avancar]');
  const btVoltar = mapa.querySelector('[data-voltar]');
  const btRefazer = mapa.querySelector('[data-refazer]');
  const btEnviar = mapa.querySelector('[data-enviar]');
  const btCopiar = mapa.querySelector('[data-copiar]');
  const resumo = mapa.querySelector('[data-resumo]');
  const nome = form.querySelector('#nome');
  let atual = 1;
  let mensagem = '';

  form.querySelectorAll('.chips button').forEach((b) => b.setAttribute('aria-pressed', 'false'));

  form.addEventListener('click', (e) => {
    const b = e.target.closest('.chips button');
    if (!b) return;
    const grupoUnico = b.closest('[data-unico]');
    if (grupoUnico) {
      grupoUnico.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    } else {
      b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
    }
    esconderAvisos();
  });
  form.addEventListener('change', (e) => {
    if (e.target.name === 'foco') { esconderAvisos(); ajustarFoco(); }
  });
  form.addEventListener('submit', (e) => e.preventDefault());
  nome.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); avancar(); } });

  const foco = () => form.querySelector('input[name="foco"]:checked')?.value || '';
  const temSaude = () => ['saude', 'ambos'].includes(foco());
  const temRosto = () => ['rosto', 'ambos'].includes(foco());
  const marcados = (tipo) => [...form.querySelectorAll(`[data-chips="${tipo}"] button[aria-pressed="true"]`)].map((b) => b.dataset.v);
  const unico = (campo) => form.querySelector(`[data-unico="${campo}"] button[aria-pressed="true"]`)?.dataset.v || '';

  function ajustarFoco() {
    form.querySelector('[data-bloco="saude"]').hidden = !temSaude();
    form.querySelector('[data-bloco="rosto"]').hidden = !temRosto();
    form.querySelectorAll('[data-so="saude"]').forEach((el) => { el.hidden = !temSaude(); });
    form.querySelectorAll('[data-so="rosto"]').forEach((el) => { el.hidden = !temRosto(); });
    const legenda = form.querySelector('[data-legenda-2]');
    const dicaRosto = form.querySelector('[data-dica-rosto]');
    if (foco() === 'rosto') {
      legenda.textContent = 'O que você gostaria de melhorar no rosto?';
      dicaRosto.textContent = 'Marque quantos quiser.';
    } else {
      legenda.textContent = 'O que você tem sentido?';
      dicaRosto.textContent = 'E no rosto, o que você gostaria de melhorar?';
    }
  }

  function esconderAvisos() { form.querySelectorAll('[data-aviso]').forEach((a) => { a.hidden = true; }); }
  function avisar(n) { const a = form.querySelector(`[data-aviso="${n}"]`); if (a) a.hidden = false; }

  function valida(n) {
    if (n === 1) return Boolean(foco());
    if (n === 2) return (temSaude() && marcados('sinais').length > 0) || (temRosto() && marcados('rosto').length > 0);
    if (n === 3) return nome.value.trim().length > 0 && Boolean(unico('periodo'));
    return true;
  }

  function irPara(n) {
    atual = n;
    etapas.forEach((et) => et.classList.toggle('ativa', Number(et.dataset.etapa) === n));
    marcadores.forEach((m) => {
      const k = Number(m.dataset.marcador);
      m.classList.toggle('ativa', k === n);
      m.classList.toggle('feita', k < n);
    });
    barra.style.width = `${n * 25}%`;
    btVoltar.hidden = n === 1;
    btAvancar.hidden = n === 4;
    btRefazer.hidden = n !== 4;
    btAvancar.innerHTML = n === 3
      ? 'Ver meu resumo <svg aria-hidden="true"><use href="#i-seta"/></svg>'
      : 'Continuar <svg aria-hidden="true"><use href="#i-seta"/></svg>';
    esconderAvisos();
    if (mapa.getBoundingClientRect().top < 0) {
      mapa.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    }
    const alvo = etapas[n - 1].querySelector('legend:not(.sr)') || etapas[n - 1];
    alvo.setAttribute('tabindex', '-1');
    alvo.focus({ preventScroll: true });
  }

  function avancar() {
    if (!valida(atual)) { avisar(atual); if (atual === 3 && !nome.value.trim()) nome.focus(); return; }
    if (atual === 3) montarResumo();
    irPara(atual + 1);
  }

  btAvancar.addEventListener('click', avancar);
  btVoltar.addEventListener('click', () => irPara(Math.max(1, atual - 1)));
  btRefazer.addEventListener('click', () => {
    form.reset();
    form.querySelectorAll('.chips button').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    ajustarFoco();
    irPara(1);
  });

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function montarResumo() {
    const pessoa = nome.value.trim().replace(/\s+/g, ' ');
    const primeiro = pessoa.split(' ')[0];
    const sinais = temSaude() ? marcados('sinais') : [];
    const rosto = temRosto() ? marcados('rosto') : [];

    const pontos = {};
    sinais.forEach((s) => Object.entries(PESOS[s] || {}).forEach(([k, v]) => { pontos[k] = (pontos[k] || 0) + v; }));
    const areas = Object.entries(pontos).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ ...AREAS[k], nivel: v >= 6 ? 4 : v >= 4 ? 3 : v >= 2 ? 2 : 1 }));

    const ficha = [
      ['Idade', unico('idade')],
      ['Exames recentes', temSaude() ? unico('exames') : ''],
      ['Já toma suplemento', temSaude() ? unico('suplemento') : ''],
      ['Procedimentos no rosto', temRosto() ? unico('procedimento') : ''],
      ['Melhor período', unico('periodo')],
      ['Na Jasmim', unico('paciente')],
    ].filter(([, v]) => v);

    let html = `<p class="resumo__ola">${esc(primeiro)}, <em>este é o seu mapa.</em></p>
      <p class="resumo__intro">Pelo que você marcou, estes são os pontos que a Dra. Patricia pode olhar primeiro.</p>`;
    if (temSaude()) {
      html += '<h4>Por dentro</h4>';
      html += areas.length
        ? `<div class="areas">${areas.map((a) => `
          <div class="area">
            <div class="area__topo"><b>${a.nome}</b><span class="pontos" role="img" aria-label="prioridade ${a.nivel} de 4">${[1, 2, 3, 4].map((i) => `<i class="${i <= a.nivel ? 'on' : ''}"></i>`).join('')}</span></div>
            <p>Na consulta, vale investigar ${a.ver}.</p>
          </div>`).join('')}</div>`
        : '<p class="resumo__intro">Você não marcou sinais de saúde. Tudo bem: a avaliação completa acontece na consulta.</p>';
    }
    if (rosto.length) {
      html += `<h4>No rosto</h4><ul class="caminhos">${rosto.map((r) => `<li><b>${r}</b><span>${CAMINHOS[r]}</span></li>`).join('')}</ul>
        <p class="resumo__intro">Caminhos possíveis, confirmados na avaliação.</p>`;
    }
    if (ficha.length) {
      html += `<h4>Sua ficha</h4><dl class="ficha">${ficha.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
    }
    resumo.innerHTML = html;

    const linhas = [
      'Olá! Fiz a pré-consulta no site da Jasmim.',
      '',
      `*Nome:* ${pessoa}`,
      `*Quero cuidar de:* ${FOCO[foco()]}`,
    ];
    if (sinais.length) linhas.push(`*Sinais que marquei:* ${sinais.join(', ')}`);
    if (areas.length) linhas.push(`*Meu mapa (do mais para o menos marcado):* ${areas.map((a) => a.nome).join(', ')}`);
    if (rosto.length) linhas.push(`*No rosto:* ${rosto.join(', ')}`);
    ficha.forEach(([k, v]) => linhas.push(`*${k}:* ${v}`));
    linhas.push('', 'Gostaria de agendar minha consulta.');
    mensagem = linhas.join('\n');
    btEnviar.href = zapLink(mensagem);
    btCopiar.querySelector('span').textContent = 'Copiar resumo';
  }

  btCopiar.addEventListener('click', async () => {
    const rotulo = btCopiar.querySelector('span');
    try {
      await navigator.clipboard.writeText(mensagem);
    } catch {
      const t = document.createElement('textarea');
      t.value = mensagem; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch { /* sem cópia */ }
      t.remove();
    }
    rotulo.textContent = 'Resumo copiado';
    setTimeout(() => { rotulo.textContent = 'Copiar resumo'; }, 2500);
  });

  ajustarFoco();
}

/* ---------- WhatsApp flutuante some perto da pré-consulta e do contato ---------- */
const zapFlutuante = document.querySelector('.zap');
const areasSemZap = [document.querySelector('[data-mapa]'), document.getElementById('contato')].filter(Boolean);
if (zapFlutuante && 'IntersectionObserver' in window) {
  const visiveis = new Set();
  const io = new IntersectionObserver((entradas) => {
    entradas.forEach((en) => { if (en.isIntersecting) visiveis.add(en.target); else visiveis.delete(en.target); });
    zapFlutuante.classList.toggle('oculto', visiveis.size > 0);
  }, { threshold: 0.15 });
  areasSemZap.forEach((el) => io.observe(el));
}

/* ---------- Foto ampliada ---------- */
const lupa = document.querySelector('[data-lupa]');
const lupaImg = document.querySelector('[data-lupa-img]');
document.querySelectorAll('[data-ampliar]').forEach((bt) => {
  bt.addEventListener('click', () => {
    const src = bt.dataset.ampliar;
    if (!lupa || typeof lupa.showModal !== 'function') { window.open(src, '_blank', 'noopener'); return; }
    lupaImg.src = src;
    lupaImg.alt = bt.querySelector('img')?.alt || '';
    lupa.showModal();
  });
});
if (lupa) {
  lupa.querySelector('[data-lupa-fechar]').addEventListener('click', () => lupa.close());
  lupa.addEventListener('click', (e) => { if (e.target === lupa) lupa.close(); });
  lupa.addEventListener('close', () => { lupaImg.removeAttribute('src'); });
}
