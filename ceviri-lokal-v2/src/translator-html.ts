// Die gesamte Übersetzer-Oberfläche als TypeScript-String.
// So wird sie direkt in den JS-Bundle eingebettet — kein Asset-Loading nötig.
// Das vermeidet den "Unable to load script" / "index.android.bundle" Fehler.

export function getTranslatorHTML(): string {
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>CeviriLokal</title>
<style>
:root{
  --bg:#05080f;--surf:#0d1117;--surf2:#161b27;
  --brd:rgba(148,163,184,0.13);
  --teal:#2dd4bf;--teal2:#34d399;--blue:#38bdf8;
  --txt:#e2e8f0;--muted:#64748b;--red:#f87171;--yellow:#fbbf24;
  --r:16px;--rs:10px;
}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
html,body{height:100%;background:var(--bg);color:var(--txt);
  font-family:-apple-system,"Segoe UI",sans-serif;font-size:15px;line-height:1.55;
  overflow:hidden}
#app{display:flex;flex-direction:column;height:100%}

/* TAB BAR */
.tab-bar{display:flex;background:var(--surf);border-bottom:1px solid var(--brd);padding:0 4px;flex-shrink:0}
.tab-btn{flex:1;background:none;border:none;color:var(--muted);font-size:11px;font-weight:700;
  padding:10px 4px 8px;display:flex;flex-direction:column;align-items:center;gap:3px;
  cursor:pointer;letter-spacing:0.4px;transition:color .2s;text-transform:uppercase}
.tab-btn svg{width:20px;height:20px}
.tab-btn.active{color:var(--teal)}

/* SCREENS */
.screen{flex:1;overflow-y:auto;display:none;padding:14px;padding-bottom:20px;gap:11px;flex-direction:column}
.screen.active{display:flex}

/* CARDS */
.card{background:var(--surf);border:1px solid var(--brd);border-radius:var(--r);padding:13px}
.card-title{font-size:10px;font-weight:800;letter-spacing:1.1px;text-transform:uppercase;
  color:var(--muted);margin-bottom:9px}

/* DIRECTION TOGGLE */
.dir-row{display:flex;align-items:center;gap:10px;background:var(--surf);
  border:1px solid var(--brd);border-radius:var(--r);padding:10px 14px}
.lang-lbl{flex:1;text-align:center;font-weight:800;font-size:17px}
.swap-btn{background:rgba(45,212,191,.12);border:1px solid rgba(45,212,191,.3);
  border-radius:999px;width:38px;height:38px;display:flex;align-items:center;
  justify-content:center;cursor:pointer;color:var(--teal);font-size:20px;flex-shrink:0}
.swap-btn:active{background:rgba(45,212,191,.25)}

/* TEXTAREA */
textarea{width:100%;background:var(--surf2);border:1px solid var(--brd);
  border-radius:var(--rs);color:var(--txt);padding:11px;font-size:15px;
  font-family:inherit;resize:none;min-height:100px;outline:none;line-height:1.55}
textarea:focus{border-color:rgba(45,212,191,.4)}

/* BUTTONS */
.btn-row{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}
.icon-btn{display:flex;align-items:center;gap:5px;background:rgba(255,255,255,.05);
  border:1px solid var(--brd);border-radius:var(--rs);padding:8px 11px;
  color:var(--txt);font-size:13px;font-weight:600;cursor:pointer}
.icon-btn:active{background:rgba(255,255,255,.13)}
.icon-btn svg{width:15px;height:15px;flex-shrink:0}
.icon-btn.teal{color:var(--teal);border-color:rgba(45,212,191,.3);background:rgba(45,212,191,.08)}

/* TRANSLATE BTN */
.xlate-btn{width:100%;padding:15px;font-size:17px;font-weight:800;
  border:none;border-radius:var(--r);cursor:pointer;
  background:linear-gradient(90deg,var(--teal),var(--teal2));
  color:#05080f;box-shadow:0 8px 28px -8px rgba(45,212,191,.55);
  transition:opacity .15s,transform .1s;display:flex;align-items:center;
  justify-content:center;gap:9px}
.xlate-btn:disabled{opacity:.4;cursor:not-allowed}
.xlate-btn:not(:disabled):active{transform:scale(.98);opacity:.9}
@keyframes spin{to{transform:rotate(360deg)}}
.spinner{width:18px;height:18px;border:2px solid rgba(5,8,15,.4);
  border-top-color:#05080f;border-radius:50%;animation:spin .7s linear infinite;display:none}
.xlate-btn.busy .spinner{display:block}
.xlate-btn.busy .btn-lbl{display:none}

/* OUTPUT */
.out-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:9px}
.font-row{display:flex;align-items:center;gap:6px}
.font-btn{background:rgba(255,255,255,.07);border:1px solid var(--brd);border-radius:8px;
  width:32px;height:32px;display:flex;align-items:center;justify-content:center;
  cursor:pointer;color:var(--txt);font-weight:800;font-size:16px}
.font-btn:active{background:rgba(255,255,255,.18)}
.font-badge{font-size:12px;color:var(--muted);min-width:38px;text-align:center}
.out-box{background:rgba(45,212,191,.05);border:1px solid rgba(45,212,191,.2);
  border-radius:var(--rs);padding:13px;min-height:100px;white-space:pre-wrap;
  transition:font-size .2s}
.out-box.ph{color:var(--muted);font-style:italic}

/* PROGRESS */
.prog-card{display:none}
.prog-card.on{display:block}
.prog-track{height:6px;background:rgba(255,255,255,.1);border-radius:999px;overflow:hidden;margin:8px 0 5px}
.prog-fill{height:100%;width:3%;background:linear-gradient(90deg,var(--teal),var(--teal2));
  border-radius:999px;transition:width .3s}
.prog-meta{display:flex;justify-content:space-between;font-size:12px;color:var(--muted)}

/* ERROR */
.err-box{display:none;padding:11px;border-radius:var(--rs);
  background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.3);
  color:#fca5a5;font-size:13px}
.err-box.on{display:block}

/* STATUS */
.status-row{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--muted)}
.dot{width:8px;height:8px;border-radius:50%;background:var(--muted);flex-shrink:0}
.dot.ready{background:var(--teal2);box-shadow:0 0 6px var(--teal2)}
.dot.busy{background:var(--yellow);animation:blink 1.2s infinite}
.dot.err{background:var(--red)}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.35}}

/* OCR HINT */
.ocr-hint{font-size:12px;color:var(--muted);margin-top:5px;min-height:17px}

/* MODEL SCREEN */
.m-card{background:var(--surf);border:1px solid var(--brd);border-radius:var(--r);
  padding:15px;display:flex;flex-direction:column;gap:9px;cursor:pointer}
.m-card.sel{border-color:rgba(45,212,191,.5);background:rgba(45,212,191,.05)}
.m-head{display:flex;align-items:flex-start;gap:11px}
.m-radio{width:20px;height:20px;border-radius:50%;border:2px solid var(--muted);
  flex-shrink:0;margin-top:2px;display:flex;align-items:center;justify-content:center;
  transition:border-color .2s}
.m-card.sel .m-radio{border-color:var(--teal)}
.m-radio::after{content:'';width:10px;height:10px;border-radius:50%;
  background:var(--teal);opacity:0;transition:opacity .2s}
.m-card.sel .m-radio::after{opacity:1}
.m-info{flex:1}
.m-name{font-weight:800;font-size:16px;margin-bottom:2px}
.m-desc{font-size:13px;color:var(--muted)}
.tags{display:flex;gap:6px;flex-wrap:wrap}
.tag{font-size:11px;font-weight:700;padding:3px 8px;border-radius:999px;border:1px solid}
.t-speed{color:#6ee7b7;border-color:rgba(110,231,183,.3);background:rgba(110,231,183,.1)}
.t-size{color:#93c5fd;border-color:rgba(147,197,253,.3);background:rgba(147,197,253,.1)}
.t-qual{color:#c4b5fd;border-color:rgba(196,181,253,.3);background:rgba(196,181,253,.1)}
.t-on{color:var(--teal);border-color:rgba(45,212,191,.4);background:rgba(45,212,191,.1)}
.dl-wrap{display:none}
.dl-wrap.on{display:block}
.dl-track{height:5px;background:rgba(255,255,255,.1);border-radius:999px;overflow:hidden;margin:5px 0 3px}
.dl-fill{height:100%;width:0%;background:linear-gradient(90deg,var(--teal),var(--teal2));
  border-radius:999px;transition:width .3s}
.dl-meta{font-size:12px;color:var(--muted)}
.use-btn{width:100%;padding:11px;font-size:14px;font-weight:700;border:none;
  border-radius:var(--rs);cursor:pointer;
  background:linear-gradient(90deg,var(--teal),var(--teal2));color:#05080f}
.use-btn:disabled{opacity:.35;cursor:not-allowed}
.use-btn.sec{background:rgba(255,255,255,.06);border:1px solid var(--brd);color:var(--txt)}

/* ABOUT */
.a-row{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--brd)}
.a-row:last-child{border-bottom:none}
.a-icon{width:36px;height:36px;border-radius:10px;background:rgba(45,212,191,.12);
  border:1px solid rgba(45,212,191,.2);display:flex;align-items:center;justify-content:center;
  font-size:18px;flex-shrink:0}
.a-lbl{font-size:12px;color:var(--muted)}
.a-val{font-size:14px;font-weight:600}

/* scrollbar */
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-thumb{background:#1e293b;border-radius:3px}
</style>
</head>
<body>
<div id="app">

<!-- TAB BAR -->
<div class="tab-bar">
  <button class="tab-btn active" onclick="tab('translate')" id="t-translate">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
    </svg>
    Übersetzen
  </button>
  <button class="tab-btn" onclick="tab('models')" id="t-models">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
    Modelle
  </button>
  <button class="tab-btn" onclick="tab('about')" id="t-about">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
    </svg>
    Info
  </button>
</div>

<!-- SCREEN: TRANSLATE -->
<div class="screen active" id="s-translate">
  <div class="status-row"><div class="dot busy" id="dot"></div><span id="stxt">Wird gestartet …</span></div>
  <div class="prog-card card" id="prog">
    <div class="card-title">⬇ KI-Modell wird vorbereitet</div>
    <div class="prog-track"><div class="prog-fill" id="pfill"></div></div>
    <div class="prog-meta"><span id="pfile">Initialisierung …</span><span id="ppct">0%</span></div>
  </div>
  <div class="err-box" id="errbox"></div>
  <div class="dir-row">
    <div class="lang-lbl" id="slbl">Deutsch</div>
    <button class="swap-btn" onclick="swap()">⇅</button>
    <div class="lang-lbl" id="tlbl">Türkisch</div>
  </div>
  <div class="card">
    <div class="card-title">✍ Eingabe</div>
    <textarea id="src" placeholder="Text eingeben oder aus Foto erkennen …" rows="5" oninput="hideErr()"></textarea>
    <div class="btn-row">
      <button class="icon-btn" onclick="pickImg()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
        </svg>Foto
      </button>
      <button class="icon-btn" onclick="useCam()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>Kamera
      </button>
      <button class="icon-btn teal" onclick="sample()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>Beispiel
      </button>
      <button class="icon-btn" onclick="clearAll()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
        </svg>Leeren
      </button>
    </div>
    <div class="ocr-hint" id="ocrhint"></div>
  </div>
  <button class="xlate-btn" id="xbtn" onclick="doTranslate()" disabled>
    <div class="spinner"></div><span class="btn-lbl">Übersetzen</span>
  </button>
  <div class="card">
    <div class="out-header">
      <div class="card-title" style="margin:0">🌐 Übersetzung</div>
      <div class="font-row">
        <button class="font-btn" onclick="fz(-2)">A−</button>
        <span class="font-badge" id="fzbadge">15px</span>
        <button class="font-btn" onclick="fz(+2)">A+</button>
      </div>
    </div>
    <div class="out-box ph" id="out">Die Übersetzung erscheint hier.</div>
    <div class="btn-row" style="margin-top:9px">
      <button class="icon-btn" onclick="cpOut()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2"/>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
        </svg>Kopieren
      </button>
      <button class="icon-btn" onclick="spkOut()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
        </svg>Vorlesen
      </button>
      <button class="icon-btn" onclick="shrOut()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>Teilen
      </button>
    </div>
  </div>
</div>

<!-- SCREEN: MODELS -->
<div class="screen" id="s-models">
  <div style="font-size:13px;color:var(--muted);padding:2px 2px 0">
    Wähle ein KI-Modell. Einmalig herunterladen — dann offline nutzbar.
  </div>

  <!-- OPUS-MT -->
  <div class="m-card sel" id="mc-opus" onclick="selModel('opus')">
    <div class="m-head">
      <div class="m-radio" id="mr-opus"></div>
      <div class="m-info">
        <div class="m-name">OPUS-MT ⚡</div>
        <div class="m-desc">Speziell für Deutsch ↔ Türkisch — schnell &amp; kompakt.</div>
      </div>
    </div>
    <div class="tags">
      <span class="tag t-speed">5–15 Sek.</span>
      <span class="tag t-size">~80 MB</span>
      <span class="tag t-qual">Gut für Briefe</span>
      <span class="tag t-on" id="on-opus" style="display:none">✓ Aktiv</span>
    </div>
    <div class="dl-wrap" id="dlw-opus">
      <div class="dl-track"><div class="dl-fill" id="dlf-opus"></div></div>
      <div class="dl-meta" id="dlm-opus">0%</div>
    </div>
    <div style="display:flex;gap:7px">
      <button class="use-btn" id="ub-opus" onclick="event.stopPropagation();activate('opus')">Als aktives Modell nutzen</button>
      <button class="use-btn sec" id="db-opus" onclick="event.stopPropagation();dlModel('opus')">⬇ Laden</button>
    </div>
  </div>

  <!-- NLLB -->
  <div class="m-card" id="mc-nllb" onclick="selModel('nllb')">
    <div class="m-head">
      <div class="m-radio" id="mr-nllb"></div>
      <div class="m-info">
        <div class="m-name">NLLB-200</div>
        <div class="m-desc">Mehrzweck-Übersetzer, breitere Sprachkenntnis, größer.</div>
      </div>
    </div>
    <div class="tags">
      <span class="tag t-size">~250 MB</span>
      <span class="tag t-qual">Sehr gut</span>
      <span class="tag t-on" id="on-nllb" style="display:none">✓ Aktiv</span>
    </div>
    <div class="dl-wrap" id="dlw-nllb">
      <div class="dl-track"><div class="dl-fill" id="dlf-nllb"></div></div>
      <div class="dl-meta" id="dlm-nllb">0%</div>
    </div>
    <div style="display:flex;gap:7px">
      <button class="use-btn" id="ub-nllb" onclick="event.stopPropagation();activate('nllb')">Als aktives Modell nutzen</button>
      <button class="use-btn sec" id="db-nllb" onclick="event.stopPropagation();dlModel('nllb')">⬇ Laden</button>
    </div>
  </div>

  <div style="font-size:12px;color:var(--muted);text-align:center;padding:2px">
    Modelle werden dauerhaft gespeichert. Kein Re-Download nötig.
  </div>
</div>

<!-- SCREEN: ABOUT -->
<div class="screen" id="s-about">
  <div style="text-align:center;padding:14px 0 6px">
    <div style="font-size:40px;margin-bottom:5px">🌐</div>
    <div style="font-size:22px;font-weight:900">CeviriLokal</div>
    <div style="font-size:13px;color:var(--muted);margin-top:3px">Offline-Übersetzer Deutsch ↔ Türkisch</div>
  </div>
  <div class="card">
    <div class="a-row"><div class="a-icon">🔒</div><div><div class="a-lbl">Datenschutz</div><div class="a-val">100% lokal — keine Daten verlassen dein Gerät</div></div></div>
    <div class="a-row"><div class="a-icon">📡</div><div><div class="a-lbl">Offline</div><div class="a-val">Nach erstem Download: kein Internet nötig</div></div></div>
    <div class="a-row"><div class="a-icon">📷</div><div><div class="a-lbl">Texterkennung (OCR)</div><div class="a-val">Fotos mit gedrucktem Text erkennen</div></div></div>
    <div class="a-row"><div class="a-icon">🔊</div><div><div class="a-lbl">Vorlesen</div><div class="a-val">Übersetzung wird vorgelesen (Türkisch/Deutsch)</div></div></div>
    <div class="a-row"><div class="a-icon">⚖️</div><div><div class="a-lbl">Lizenzen</div><div class="a-val">OPUS-MT (CC-BY) · NLLB-200 (CC-BY-NC) · Tesseract (Apache)</div></div></div>
  </div>
  <div class="card" style="font-size:13px;color:var(--muted);line-height:1.7">
    <b style="color:var(--txt)">Qualitätshinweis:</b> Die KI-Übersetzung eignet sich gut für Briefe und Alltagstexte.
    Für medizinische oder juristische Dokumente bitte immer von einem Fachmann prüfen lassen.
  </div>
  <div style="text-align:center;font-size:12px;color:var(--muted);padding:6px">
    Version 1.0 · Transformers.js · Tesseract.js
  </div>
</div>

</div><!-- #app -->

<script>
// ── STATE ──────────────────────────────────────────────────────────
var dir = 'de-tr';
var fontSize = 15;
var activeModel = 'opus';
var dlDone = {opus:false, nllb:false};
var pfMap = {};
var xRes = null, xRej = null;

var MODELS = {
  opus: {
    detr: {name:'Xenova/opus-mt-de-tr', dtype:'fp32'},
    trde: {name:'Xenova/opus-mt-tr-de', dtype:'fp32'}
  },
  nllb: {
    detr: {name:'Xenova/nllb-200-distilled-600M', dtype:'q8', src:'deu_Latn', tgt:'tur_Latn'},
    trde: {name:'Xenova/nllb-200-distilled-600M', dtype:'q8', src:'tur_Latn', tgt:'deu_Latn'}
  }
};

var LANGS = {
  'de-tr': {s:'Deutsch', t:'Türkisch', speak:'tr-TR', ocr:'deu'},
  'tr-de': {s:'Türkisch', t:'Deutsch',  speak:'de-DE', ocr:'tur'}
};

// ── WORKER ─────────────────────────────────────────────────────────
var WC = "let _lib=null,_pipes={};"+
"async function lib(){if(!_lib){_lib=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3');"+
"_lib.env.allowLocalModels=false;_lib.env.useBrowserCache=true;}return _lib;}"+
"async function getPipe(n,d,cb){var k=n+d;if(!_pipes[k]){var l=await lib();"+
"_pipes[k]=await l.pipeline('translation',n,{dtype:d,progress_callback:cb});}return _pipes[k];}"+
"function chunk(t){var ps=t.split(/\\n+/),out=[];for(var p of ps){if(!p.trim())continue;"+
"if(p.length<=380){out.push(p);continue;}var ss=p.match(/[^.!?\\n]+[.!?\\n]*/g)||[p],c='';"+
"for(var s of ss){if((c+s).length>380){if(c)out.push(c);c=s;}else c+=s;}if(c)out.push(c);}"+
"return out.length?out:[t];}"+
"self.onmessage=async e=>{var m=e.data;try{"+
"if(m.type==='preload'){await getPipe(m.mn,m.dt,x=>self.postMessage({s:'prog',d:x}));self.postMessage({s:'ready'});}"+
"else if(m.type==='translate'){var pipe=await getPipe(m.mn,m.dt,x=>self.postMessage({s:'prog',d:x}));"+
"self.postMessage({s:'xlating'});var parts=chunk(m.text),res=[];"+
"for(var p of parts){var opts=m.src?{src_lang:m.src,tgt_lang:m.tgt}:{};"+
"var out=await pipe(p,opts);var t=Array.isArray(out)?out.map(o=>o.translation_text).join(' '):(out.translation_text||'');"+
"res.push(t.trim());}self.postMessage({s:'result',text:res.join('\\n')});}}"+
"catch(err){self.postMessage({s:'error',error:String(err&&err.message?err.message:err)});}};";

var worker = new Worker(
  URL.createObjectURL(new Blob([WC],{type:'text/javascript'})),
  {type:'module'}
);

worker.onmessage = function(ev){
  var m = ev.data;
  if(m.s==='prog'){
    var d=m.d||{};
    if(typeof d.progress==='number'&&d.file) pfMap[d.file]=d.progress;
    if(d.status==='done'&&d.file) pfMap[d.file]=1;
    var vals=Object.values(pfMap);
    var pct=vals.length?Math.round(vals.reduce(function(a,b){return a+b},0)/vals.length*100):0;
    var lbl=d.file?d.file.split('/').pop():'Lädt …';
    setProg(true,pct,lbl); setDot('busy','Lädt: '+lbl);
  } else if(m.s==='ready'){
    setProg(false); setDot('ready','Bereit — '+(activeModel==='opus'?'OPUS-MT':'NLLB-200'));
    g('xbtn').disabled=false; setBusy(false);
    dlDone[activeModel]=true; refreshMUI();
  } else if(m.s==='xlating'){
    setBusy(true); setDot('busy','Übersetzt …'); setOut('…',true);
  } else if(m.s==='result'){
    setOut(m.text||'',false); setBusy(false); setDot('ready','Fertig');
    if(xRes){xRes(m.text);xRes=null;}
  } else if(m.s==='error'){
    showErr(m.error||'Fehler'); setBusy(false); setProg(false); setDot('err','Fehler');
    if(xRej){xRej(new Error(m.error));xRej=null;}
  }
};
worker.onerror = function(e){
  var detail = (e && (e.message || e.error || e.filename)) ?
    (e.message||'') + (e.filename?(' @ '+e.filename+':'+e.lineno):'') :
    'Unbekannt';
  showErr('Worker-Fehler: ' + detail);
  setDot('err','Fehler');
};
 

// ── INIT ───────────────────────────────────────────────────────────
function init(){
  setDot('busy','Lädt OPUS-MT …'); setProg(true,0,'Initialisierung …');
  preload();
  if(window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify({type:'ready'}));
}

function preload(){
  var m=MODELS[activeModel], side=dir==='de-tr'?m.detr:m.trde;
  pfMap={};
  worker.postMessage({type:'preload',mn:side.name,dt:side.dtype});
}

// ── TABS ───────────────────────────────────────────────────────────
function tab(n){
  document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active');});
  document.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('active');});
  g('s-'+n).classList.add('active'); g('t-'+n).classList.add('active');
}

// ── SWAP ───────────────────────────────────────────────────────────
function swap(){
  var src=g('src'), out=g('out');
  var oldOut=out.classList.contains('ph')?'':out.innerText;
  var oldSrc=src.value;
  dir=dir==='de-tr'?'tr-de':'de-tr';
  src.value=oldOut;
  oldOut?setOut(oldSrc,false):setOut('',true);
  g('slbl').textContent=LANGS[dir].s; g('tlbl').textContent=LANGS[dir].t;
  g('xbtn').disabled=true; setDot('busy','Wechselt …'); setProg(true,0,'Lädt …'); pfMap={}; preload();
}

// ── MODEL UI ───────────────────────────────────────────────────────
var selM = 'opus';
function selModel(id){
  selM=id;
  document.querySelectorAll('.m-card').forEach(function(c){c.classList.remove('sel');});
  g('mc-'+id).classList.add('sel');
}

function dlModel(id){
  var m=MODELS[id], side=dir==='de-tr'?m.detr:m.trde;
  var dlw=g('dlw-'+id), dlf=g('dlf-'+id), dlm=g('dlm-'+id);
  dlw.classList.add('on');
  var tmp={};
  var tc="self.onmessage=async e=>{var {mn,dt}=e.data;"+
  "var lib=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3');"+
  "lib.env.allowLocalModels=false;lib.env.useBrowserCache=true;"+
  "await lib.pipeline('translation',mn,{dtype:dt,progress_callback:x=>self.postMessage(x)});"+
  "self.postMessage({status:'done_all'});};";
  var tw=new Worker(URL.createObjectURL(new Blob([tc],{type:'text/javascript'})),{type:'module'});
  tw.postMessage({mn:side.name,dt:side.dtype});
  tw.onmessage=function(ev){
    var d=ev.data||{};
    if(d.status==='done_all'){dlDone[id]=true;dlw.classList.remove('on');refreshMUI();tw.terminate();return;}
    if(typeof d.progress==='number'&&d.file) tmp[d.file]=d.progress;
    if(d.status==='done'&&d.file) tmp[d.file]=1;
    var vals=Object.values(tmp);
    var pct=vals.length?Math.round(vals.reduce(function(a,b){return a+b},0)/vals.length*100):0;
    dlf.style.width=Math.max(2,pct)+'%'; dlm.textContent=pct+'% — '+(d.file?d.file.split('/').pop():'');
  };
  tw.onerror=function(){dlm.textContent='Fehler';tw.terminate();};
}

function activate(id){
  if(!dlDone[id]){
    dlModel(id);
    var iv=setInterval(function(){if(dlDone[id]){clearInterval(iv);doActivate(id);}},500);
    return;
  }
  doActivate(id);
}

function doActivate(id){
  activeModel=id;
  g('xbtn').disabled=true;
  setDot('busy','Aktiviere '+(id==='opus'?'OPUS-MT':'NLLB-200')+'…');
  setProg(true,0,'Lädt …'); pfMap={}; preload(); refreshMUI();
}

function refreshMUI(){
  ['opus','nllb'].forEach(function(id){
    var on=g('on-'+id), ub=g('ub-'+id), db=g('db-'+id);
    if(id===activeModel){on.style.display='';ub.disabled=true;ub.textContent='✓ Aktives Modell';}
    else{on.style.display='none';ub.disabled=false;ub.textContent='Als aktives Modell nutzen';}
    db.textContent=dlDone[id]?'✓ Geladen':'⬇ Laden'; db.disabled=dlDone[id];
  });
}

// ── FONT SIZE ─────────────────────────────────────────────────────
function fz(d){
  fontSize=Math.min(36,Math.max(12,fontSize+d));
  g('out').style.fontSize=fontSize+'px'; g('fzbadge').textContent=fontSize+'px';
}

// ── TRANSLATE ─────────────────────────────────────────────────────
function doTranslate(){
  var text=g('src').value.trim(); if(!text) return;
  hideErr();
  var m=MODELS[activeModel], side=dir==='de-tr'?m.detr:m.trde;
  new Promise(function(res,rej){
    xRes=res; xRej=rej;
    worker.postMessage({type:'translate',text:text,mn:side.name,dt:side.dtype,
      src:side.src||null,tgt:side.tgt||null});
  });
}

// ── OCR ───────────────────────────────────────────────────────────
function pickImg(){ n2a({type:'pickImage'}); }
function useCam(){  n2a({type:'useCamera'}); }

window.receiveImageBase64 = async function(b64,mime){
  setHint('Texterkennung läuft …');
  try{
    if(!window.Tesseract){
      await loadSc('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');
    }
    var lang=LANGS[dir].ocr;
    var w=await window.Tesseract.createWorker(lang,1,{
      logger:function(m){if(m.status==='recognizing text')setHint('Erkenne … '+Math.round(m.progress*100)+'%');}
    });
    var url=b64.startsWith('data:')?b64:'data:'+mime+';base64,'+b64;
    var res=await w.recognize(url); await w.terminate();
    var t=(res.data.text||'').trim();
    if(t){var el=g('src');el.value=(el.value.trim()?el.value+'\\n\\n':'')+t;setHint('✓ '+t.length+' Zeichen erkannt');}
    else setHint('Kein Text erkannt.');
  }catch(e){setHint('OCR-Fehler: '+e.message);}
};

function loadSc(src){return new Promise(function(res,rej){
  var s=document.createElement('script');s.src=src;
  s.onload=res;s.onerror=function(){rej(new Error('Skript-Fehler'));};
  document.head.appendChild(s);
});}

// ── SAMPLE / CLEAR ────────────────────────────────────────────────
function sample(){
  var ss={
    'de-tr':'Sehr geehrte Damen und Herren,\\n\\nihm Termin findet am Montag, den 15. Januar um 14:00 Uhr statt. Bitte bringen Sie Ihren Personalausweis und alle relevanten Unterlagen mit.\\n\\nMit freundlichen Grüßen\\nIhre Stadtverwaltung',
    'tr-de':'Sayın Baylar ve Bayanlar,\\n\\nRandevunuz 15 Ocak Pazartesi günü saat 14:00te gerçekleşecektir. Lütfen kimliğinizi ve tüm belgelerinizi yanınızda getiriniz.\\n\\nSaygılarımla,\\nBelediyeniz'
  };
  g('src').value=ss[dir];
}
function clearAll(){g('src').value='';setOut('',true);hideErr();setHint('');}

// ── OUTPUT HELPERS ────────────────────────────────────────────────
function setOut(t,ph){
  var el=g('out');
  if(ph||!t){el.innerText='Die Übersetzung erscheint hier.';el.classList.add('ph');}
  else{el.innerText=t;el.classList.remove('ph');}
}
function cpOut(){
  var t=g('out').innerText; if(g('out').classList.contains('ph')) return;
  if(navigator.clipboard) navigator.clipboard.writeText(t).catch(function(){});
  n2a({type:'copy',text:t});
}
function spkOut(){
  var t=g('out').innerText; if(g('out').classList.contains('ph')) return;
  n2a({type:'speak',text:t,lang:LANGS[dir].speak});
  if('speechSynthesis' in window){
    var u=new SpeechSynthesisUtterance(t); u.lang=LANGS[dir].speak; u.rate=0.9;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  }
}
function shrOut(){
  var t=g('out').innerText; if(g('out').classList.contains('ph')) return;
  n2a({type:'share',text:t});
}

// ── PROGRESS / STATUS ─────────────────────────────────────────────
function setProg(v,pct,lbl){
  var c=g('prog'); c.classList.toggle('on',v);
  if(v){g('pfill').style.width=Math.max(3,pct)+'%';g('ppct').textContent=pct+'%';g('pfile').textContent=lbl||'';}
}
function setDot(st,tx){g('dot').className='dot '+st;g('stxt').textContent=tx;}
function setBusy(b){var btn=g('xbtn');btn.classList.toggle('busy',b);btn.disabled=b;}
function showErr(msg){var e=g('errbox');e.textContent='⚠ '+msg;e.classList.add('on');}
function hideErr(){g('errbox').classList.remove('on');}
function setHint(t){g('ocrhint').textContent=t;}

// ── NATIVE BRIDGE ─────────────────────────────────────────────────
function n2a(obj){
  if(window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(obj));
}

// ── UTILS ─────────────────────────────────────────────────────────
function g(id){return document.getElementById(id);}

window.addEventListener('DOMContentLoaded', init);
</script>
</body>
</html>`;
}
