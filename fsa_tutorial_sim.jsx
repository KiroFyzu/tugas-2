import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const THEORY = [
  {
    id: "apa-itu-fsa",
    title: "Apa itu FSA?",
    icon: "🤖",
    content: [
      {
        type: "text",
        body: "Finite State Automata (FSA) atau Otomata Berhingga adalah sebuah model matematika dari suatu sistem yang menerima input dan output diskrit. FSA bukan mesin fisik, melainkan konsep abstrak yang sangat berguna dalam ilmu komputer teoritis.",
      },
      {
        type: "highlight",
        body: "FSA merupakan mesin otomata dari bahasa reguler. Ia memiliki jumlah state yang berhingga (terbatas), dan dapat berpindah dari satu state ke state lain berdasarkan simbol input yang diterima.",
      },
      {
        type: "text",
        body: "Bayangkan FSA seperti sebuah lampu lalu lintas: ia hanya memiliki beberapa kondisi (merah, kuning, hijau), dan berpindah antar kondisi berdasarkan aturan tertentu. Sederhana namun sangat powerful!",
      },
      {
        type: "analogy",
        title: "Analogi Sehari-hari",
        items: [
          { icon: "🚦", text: "Lampu lalu lintas: state = warna lampu, input = timer/sensor" },
          { icon: "🏧", text: "ATM: state = menu aktif, input = tombol yang ditekan" },
          { icon: "🔒", text: "Kunci kombinasi: state = digit terakhir, input = digit berikutnya" },
          { icon: "📱", text: "Telepon: state = on/off/call, input = tombol" },
        ],
      },
    ],
  },
  {
    id: "komponen-fsa",
    title: "Komponen FSA (5-Tupel)",
    icon: "⚙️",
    content: [
      {
        type: "text",
        body: "Secara formal, sebuah FSA dinyatakan oleh 5-tupel M = (Q, Σ, δ, S, F). Kelima elemen ini mendefinisikan sepenuhnya perilaku sebuah automata.",
      },
      {
        type: "components",
        items: [
          {
            symbol: "Q",
            name: "Himpunan State",
            desc: "Kumpulan semua state/kedudukan yang mungkin ada dalam automata. Himpunan ini harus berhingga (finite).",
            example: "Q = {q₀, q₁, q₂, q₃}",
            color: "#6c63ff",
          },
          {
            symbol: "Σ",
            name: "Alfabet Input",
            desc: "Himpunan simbol input yang dikenali oleh automata. Disebut juga alphabet atau himpunan masukan.",
            example: "Σ = {0, 1} atau Σ = {a, b}",
            color: "#ff6584",
          },
          {
            symbol: "δ",
            name: "Fungsi Transisi",
            desc: "Fungsi yang menentukan state berikutnya berdasarkan state saat ini dan simbol input. δ: Q × Σ → Q",
            example: "δ(q₀, 1) = q₁",
            color: "#43e97b",
          },
          {
            symbol: "S",
            name: "State Awal",
            desc: "State tempat automata memulai komputasi. Hanya ada satu state awal, ditandai dengan panah masuk.",
            example: "S = q₀",
            color: "#f9ca24",
          },
          {
            symbol: "F",
            name: "Himpunan State Akhir",
            desc: "Kumpulan state yang menandakan string diterima jika komputasi berakhir di sini. Bisa lebih dari satu.",
            example: "F = {q₂} atau F = {q₀, q₁}",
            color: "#43c6ff",
          },
        ],
      },
    ],
  },
  {
    id: "diagram-transisi",
    title: "Diagram Transisi",
    icon: "🔵",
    content: [
      {
        type: "text",
        body: "Diagram transisi adalah representasi visual dari sebuah FSA menggunakan graf berarah. Ini adalah cara paling intuitif untuk memahami cara kerja automata.",
      },
      {
        type: "diagram-legend",
        items: [
          { visual: "circle", label: "Lingkaran tunggal", desc: "Menyatakan state biasa" },
          { visual: "double-circle", label: "Lingkaran ganda", desc: "Menyatakan state akhir (final state)" },
          { visual: "arrow-in", label: "Panah masuk tanpa sumber", desc: "Menunjukkan state awal" },
          { visual: "arrow", label: "Busur/panah berarah", desc: "Menyatakan transisi antar state" },
          { visual: "self-loop", label: "Panah ke diri sendiri", desc: "State tetap sama setelah baca input" },
          { visual: "label", label: "Label pada busur", desc: "Simbol input yang memicu transisi" },
        ],
      },
    ],
  },
  {
    id: "tabel-transisi",
    title: "Tabel Transisi",
    icon: "📊",
    content: [
      {
        type: "text",
        body: "Tabel transisi adalah representasi tabular dari fungsi transisi δ. Baris mewakili state, kolom mewakili simbol input, dan isi sel adalah state tujuan.",
      },
      {
        type: "table-example",
        title: "Contoh tabel transisi DFA dengan Σ={a,b}:",
        headers: ["δ", "a", "b"],
        rows: [
          ["→*q₀", "q₀", "q₁", "start+final"],
          ["q₁", "q₁", "q₀", "normal"],
        ],
        legend: [
          { symbol: "→", desc: "State awal" },
          { symbol: "*", desc: "State akhir (final)" },
          { symbol: "→*", desc: "State awal sekaligus akhir" },
        ],
      },
      {
        type: "text",
        body: "Tabel dan diagram transisi saling dapat dikonversi satu sama lain. Tugas 2 kalian adalah berlatih konversi antara keduanya!",
      },
    ],
  },
  {
    id: "dfa-vs-nfa",
    title: "DFA vs NFA",
    icon: "⚖️",
    content: [
      {
        type: "text",
        body: "Ada dua jenis FSA: Deterministic Finite Automata (DFA) dan Non-Deterministic Finite Automata (NFA). Keduanya memiliki kekuatan yang setara, namun berbeda dalam cara kerjanya.",
      },
      {
        type: "comparison",
        left: {
          title: "DFA",
          color: "#6c63ff",
          points: [
            "Setiap state memiliki tepat SATU transisi untuk setiap simbol input",
            "Tidak ada ambiguitas — selalu jelas state mana yang dituju",
            "Lebih mudah diimplementasikan",
            "Setiap input menghasilkan tepat satu jalur eksekusi",
          ],
        },
        right: {
          title: "NFA",
          color: "#ff6584",
          points: [
            "State boleh memiliki NOL atau LEBIH transisi untuk satu simbol",
            "Bisa ada multiple state aktif secara bersamaan",
            "Lebih mudah dirancang untuk pola tertentu",
            "Dapat dikonversi ke DFA yang ekuivalen",
          ],
        },
      },
      {
        type: "highlight",
        body: "Materi Tugas 2 berfokus pada DFA. Setiap soal memiliki tepat satu transisi per state per simbol input.",
      },
    ],
  },
  {
    id: "cara-kerja",
    title: "Cara Kerja: Membaca String",
    icon: "▶️",
    content: [
      {
        type: "text",
        body: "FSA memproses string input dengan membacanya karakter per karakter dari kiri ke kanan. Di setiap langkah, mesin berpindah state sesuai fungsi transisi.",
      },
      {
        type: "steps",
        items: [
          { step: "1", title: "Mulai di State Awal", desc: "Mesin selalu memulai di state S (initial state). Belum ada input yang dibaca." },
          { step: "2", title: "Baca Karakter", desc: "Ambil karakter pertama dari string input. Karakter ini harus ada di alfabet Σ." },
          { step: "3", title: "Aplikasikan Fungsi Transisi", desc: "Gunakan δ(state_sekarang, karakter) untuk menentukan state berikutnya." },
          { step: "4", title: "Pindah ke State Berikutnya", desc: "State sekarang berubah menjadi hasil dari fungsi transisi." },
          { step: "5", title: "Ulangi atau Selesai", desc: "Jika masih ada karakter, kembali ke langkah 2. Jika sudah habis, lanjut ke langkah 6." },
          { step: "6", title: "Keputusan Akhir", desc: "Jika state terakhir ∈ F → DITERIMA. Jika tidak → DITOLAK." },
        ],
      },
      {
        type: "example-trace",
        title: "Contoh: String '011' pada DFA Soal 1 (Q={q₀..q₃}, Σ={0,1}, F={q₀})",
        steps: [
          { from: "—", input: "—", to: "q₀", note: "State awal" },
          { from: "q₀", input: "0", to: "q₂", note: "δ(q₀,0)=q₂" },
          { from: "q₂", input: "1", to: "q₃", note: "δ(q₂,1)=q₃" },
          { from: "q₃", input: "1", to: "q₂", note: "δ(q₃,1)=q₂" },
        ],
        result: "DITOLAK",
        reason: "q₂ bukan final state",
      },
    ],
  },
];

const DFAS = [
  {
    id: 0,
    soal: "Soal 1",
    title: "Diagram → Tabel Transisi",
    task: "Buatlah tabel transisi dari diagram DFA berikut.",
    states: ["q₀", "q₁", "q₂", "q₃"],
    alphabet: ["0", "1"],
    start: 0,
    finals: [0],
    delta: { 0: { "0": 2, "1": 1 }, 1: { "0": 3, "1": 0 }, 2: { "0": 0, "1": 3 }, 3: { "0": 1, "1": 2 } },
    nodePos: [{ x: 150, y: 130 }, { x: 310, y: 130 }, { x: 150, y: 250 }, { x: 310, y: 250 }],
    explanation: "DFA ini menerima string biner yang mengandung jumlah '1' genap. State q₀ = genap (final), q₁ = ganjil, q₂/q₃ = state intermediate.",
  },
  {
    id: 1,
    soal: "Soal 2",
    title: "Tabel → Diagram Transisi",
    task: "Gambarkan diagram transisi dari DFA berikut.",
    states: ["q₀", "q₁", "q₂"],
    alphabet: ["a", "b"],
    start: 0,
    finals: [0],
    delta: { 0: { a: 1, b: 2 }, 1: { a: 2, b: 0 }, 2: { a: 2, b: 2 } },
    nodePos: [{ x: 120, y: 160 }, { x: 270, y: 90 }, { x: 270, y: 230 }],
    explanation: "DFA ini menerima string atas {a,b} yang jumlah 'ab'-nya genap. State q₂ adalah dead state — sekali masuk tidak bisa diterima.",
  },
  {
    id: 2,
    soal: "Soal 3",
    title: "Tabel → Diagram Transisi",
    task: "Gambarkan diagram transisi dari DFA berikut.",
    states: ["q₀", "q₁", "q₂", "q₃"],
    alphabet: ["a", "b"],
    start: 0,
    finals: [0, 1, 2],
    delta: { 0: { a: 0, b: 1 }, 1: { a: 0, b: 2 }, 2: { a: 0, b: 3 }, 3: { a: 3, b: 2 } },
    nodePos: [{ x: 80, y: 160 }, { x: 210, y: 160 }, { x: 340, y: 160 }, { x: 420, y: 160 }],
    explanation: "DFA ini menerima string atas {a,b} yang tidak mengandung 'bbb' (tiga b berturut-turut). q₃ adalah trap state untuk pola bbb.",
  },
];

// ─── CANVAS DRAWING UTILS ────────────────────────────────────────────────────
function drawFSACanvas(canvas, dfa, activeState = null, traceEdge = null) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = "#080c1a";
  ctx.fillRect(0, 0, W, H);

  // Grid dots
  ctx.fillStyle = "rgba(108,99,255,0.06)";
  for (let x = 20; x < W; x += 30) for (let y = 20; y < H; y += 30) {
    ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
  }

  const R = 28;
  const pos = dfa.nodePos;

  // Draw edges
  dfa.states.forEach((_, from) => {
    dfa.alphabet.forEach(sym => {
      const to = dfa.delta[from][sym];
      const isActive = traceEdge && traceEdge.from === from && traceEdge.sym === sym;
      if (from === to) {
        drawSelfLoop(ctx, pos[from].x, pos[from].y, sym, R, isActive);
      } else {
        const reverse = dfa.delta[to] && Object.values(dfa.delta[to]).includes(from);
        drawEdge(ctx, pos[from], pos[to], sym, R, reverse ? 16 : 0, isActive);
      }
    });
  });

  // Draw nodes
  dfa.states.forEach((name, i) => {
    const isStart = i === dfa.start;
    const isFinal = dfa.finals.includes(i);
    const isActive = activeState === i;
    drawNode(ctx, pos[i].x, pos[i].y, name, isStart, isFinal, isActive, R);
  });
}

function drawNode(ctx, cx, cy, label, isStart, isFinal, isActive, R) {
  if (isActive) { ctx.shadowColor = "#6c63ff"; ctx.shadowBlur = 22; }

  let fill = "#10152a", stroke = "#3a4070", lw = 2;
  if (isFinal && isStart) { fill = "rgba(67,198,255,0.15)"; stroke = "#43c6ff"; }
  else if (isFinal) { fill = "rgba(67,233,123,0.12)"; stroke = "#43e97b"; }
  else if (isStart) { fill = "rgba(249,202,36,0.12)"; stroke = "#f9ca24"; }
  if (isActive) { fill = "rgba(108,99,255,0.3)"; stroke = "#8b83ff"; lw = 2.5; }

  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fillStyle = fill; ctx.fill();
  ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke();
  ctx.shadowBlur = 0;

  if (isFinal) {
    ctx.beginPath(); ctx.arc(cx, cy, R - 5, 0, Math.PI * 2);
    ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke();
  }

  ctx.fillStyle = "#e8eaf6";
  ctx.font = `bold 13px monospace`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(label, cx, cy);
  ctx.textBaseline = "alphabetic";

  if (isStart) {
    ctx.strokeStyle = "#f9ca24"; ctx.fillStyle = "#f9ca24"; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(cx - R - 28, cy); ctx.lineTo(cx - R - 2, cy); ctx.stroke();
    arrowHead(ctx, cx - R - 1, cy, 0, "#f9ca24");
  }
}

function drawEdge(ctx, p1, p2, label, R, offset, isActive) {
  const col = isActive ? "#f9ca24" : (offset ? "#ff9f43" : "#5a6080");
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = isActive ? 2.5 : 1.6;

  const dx = p2.x - p1.x, dy = p2.y - p1.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ox = offset ? -uy * offset : 0, oy = offset ? ux * offset : 0;

  const sx = p1.x + ux * R + ox, sy = p1.y + uy * R + oy;
  const ex = p2.x - ux * R + ox, ey = p2.y - uy * R + oy;

  ctx.beginPath(); ctx.moveTo(sx, sy);
  if (offset) {
    const mx = (sx + ex) / 2 + ox * 1.8, my = (sy + ey) / 2 + oy * 1.8;
    ctx.quadraticCurveTo(mx, my, ex, ey);
    ctx.stroke(); arrowHead(ctx, ex, ey, Math.atan2(ey - my, ex - mx), col);
    ctx.fillStyle = isActive ? "#f9ca24" : "#a9a3ff";
    ctx.font = `bold 12px monospace`; ctx.textAlign = "center";
    ctx.fillText(label, mx, my - 9);
  } else {
    ctx.lineTo(ex, ey); ctx.stroke();
    arrowHead(ctx, ex, ey, Math.atan2(dy, dx), col);
    const lx = (sx + ex) / 2 - uy * 14, ly = (sy + ey) / 2 + ux * 14;
    ctx.fillStyle = isActive ? "#f9ca24" : "#a9a3ff";
    ctx.font = `bold 12px monospace`; ctx.textAlign = "center";
    ctx.fillText(label, lx, ly);
  }
}

function drawSelfLoop(ctx, cx, cy, label, R, isActive) {
  const col = isActive ? "#f9ca24" : "#ff9f43";
  ctx.strokeStyle = col; ctx.lineWidth = isActive ? 2.5 : 1.6;
  ctx.beginPath();
  ctx.moveTo(cx - 14, cy - R + 4);
  ctx.bezierCurveTo(cx - 14, cy - R - 46, cx + 14, cy - R - 46, cx + 14, cy - R + 4);
  ctx.stroke();
  arrowHead(ctx, cx + 14, cy - R + 3, Math.PI * 0.3, col);
  ctx.fillStyle = isActive ? "#f9ca24" : "#a9a3ff";
  ctx.font = `bold 12px monospace`; ctx.textAlign = "center";
  ctx.fillText(label, cx, cy - R - 32);
}

function arrowHead(ctx, x, y, angle, color) {
  const s = 7;
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
  ctx.fillStyle = color; ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(-s, -s / 2); ctx.lineTo(-s, s / 2);
  ctx.closePath(); ctx.fill(); ctx.restore();
}

// ─── SUBCOMPONENTS ───────────────────────────────────────────────────────────
function FSACanvas({ dfa, activeState, traceEdge, height = 320 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) drawFSACanvas(ref.current, dfa, activeState, traceEdge);
  }, [dfa, activeState, traceEdge]);
  return (
    <canvas ref={ref} width={480} height={height}
      style={{ width: "100%", borderRadius: 12, background: "#080c1a", border: "1px solid #1e2240", display: "block" }} />
  );
}

function TransitionTable({ dfa, activeState }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace", fontSize: 14 }}>
        <thead>
          <tr>
            <th style={thStyle}>δ</th>
            {dfa.alphabet.map(a => <th key={a} style={thStyle}>{a}</th>)}
          </tr>
        </thead>
        <tbody>
          {dfa.states.map((s, i) => {
            const isS = i === dfa.start, isF = dfa.finals.includes(i), isA = activeState === i;
            const rowLabel = `${isS ? "→" : ""}${isF ? "*" : ""}${s}`;
            const color = isA ? "#f9ca24" : isS && isF ? "#43c6ff" : isF ? "#43e97b" : isS ? "#f9ca24" : "#e8eaf6";
            return (
              <tr key={i} style={{ background: isA ? "rgba(249,202,36,0.06)" : i % 2 ? "rgba(255,255,255,0.015)" : "transparent" }}>
                <td style={{ ...tdStyle, color, fontWeight: 700 }}>{rowLabel}</td>
                {dfa.alphabet.map(sym => (
                  <td key={sym} style={{ ...tdStyle, color: dfa.finals.includes(dfa.delta[i][sym]) ? "#43e97b" : "#c8cbea" }}>
                    {dfa.states[dfa.delta[i][sym]]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ marginTop: 10, display: "flex", gap: 14, flexWrap: "wrap" }}>
        {[["→ = state awal", "#f9ca24"], ["* = final state", "#43e97b"], ["→* = keduanya", "#43c6ff"]].map(([t, c]) => (
          <span key={t} style={{ fontSize: 11, color: c, fontFamily: "monospace" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function StringTester({ dfa }) {
  const [input, setInput] = useState("");
  const [traceSteps, setTraceSteps] = useState([]);
  const [result, setResult] = useState(null);
  const [activeState, setActiveState] = useState(null);
  const [traceEdge, setTraceEdge] = useState(null);
  const [animIdx, setAnimIdx] = useState(-1);
  const [running, setRunning] = useState(false);

  const compute = useCallback(() => {
    if (!input && input !== "") return;
    for (const ch of input) {
      if (!dfa.alphabet.includes(ch)) {
        setResult({ accepted: null, reason: `Karakter '${ch}' tidak ada di alfabet {${dfa.alphabet.join(",")}}` });
        setTraceSteps([]); return;
      }
    }
    const steps = [{ state: dfa.start, input: null, note: "State awal" }];
    let cur = dfa.start;
    for (const ch of input) {
      const next = dfa.delta[cur][ch];
      steps.push({ state: next, from: cur, input: ch, note: `δ(${dfa.states[cur]},${ch})=${dfa.states[next]}` });
      cur = next;
    }
    const accepted = dfa.finals.includes(cur);
    setTraceSteps(steps);
    setResult({ accepted, reason: `Berakhir di ${dfa.states[cur]} ${accepted ? "(final state ✓)" : "(bukan final state ✗)"}` });
    setActiveState(null); setTraceEdge(null); setAnimIdx(-1);
    setRunning(true);
  }, [input, dfa]);

  useEffect(() => {
    if (!running || traceSteps.length === 0) return;
    let idx = 0;
    setActiveState(traceSteps[0].state);
    const iv = setInterval(() => {
      idx++;
      if (idx >= traceSteps.length) { clearInterval(iv); setRunning(false); setTraceEdge(null); return; }
      const s = traceSteps[idx];
      setActiveState(s.state);
      setTraceEdge({ from: s.from, sym: s.input });
      setAnimIdx(idx);
    }, 700);
    return () => clearInterval(iv);
  }, [running, traceSteps]);

  return (
    <div>
      <FSACanvas dfa={dfa} activeState={activeState} traceEdge={traceEdge} />
      <div style={{ marginTop: 16 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <input value={input} onChange={e => { setInput(e.target.value); setTraceSteps([]); setResult(null); setActiveState(null); }}
            onKeyDown={e => e.key === "Enter" && compute()}
            placeholder={`Contoh: ${dfa.alphabet[0]}${dfa.alphabet[1]}${dfa.alphabet[0]}`}
            style={inputStyle} />
          <button onClick={compute} disabled={running} style={btnStyle(running)}>
            {running ? "⏳" : "▶ Uji"}
          </button>
          <button onClick={() => { setInput(""); setTraceSteps([]); setResult(null); setActiveState(null); setTraceEdge(null); }}
            style={{ ...btnStyle(false), background: "#1e2240", color: "#6b7299" }}>
            ↺
          </button>
        </div>

        {traceSteps.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "#6b7299", fontFamily: "monospace", marginBottom: 8, letterSpacing: 1 }}>JEJAK EKSEKUSI:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {traceSteps.map((s, i) => (
                <div key={i} style={{
                  padding: "5px 12px", borderRadius: 8, fontSize: 12, fontFamily: "monospace",
                  background: animIdx >= i ? "rgba(108,99,255,0.2)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${animIdx >= i ? "rgba(108,99,255,0.5)" : "#1e2240"}`,
                  color: animIdx >= i ? "#c8c3ff" : "#4a5070",
                  transition: "all 0.3s",
                }}>
                  {s.note}
                </div>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div style={{
            padding: "12px 18px", borderRadius: 10, display: "inline-flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 700,
            background: result.accepted === null ? "rgba(249,202,36,0.1)" : result.accepted ? "rgba(67,233,123,0.1)" : "rgba(255,101,132,0.1)",
            border: `1px solid ${result.accepted === null ? "rgba(249,202,36,0.4)" : result.accepted ? "rgba(67,233,123,0.4)" : "rgba(255,101,132,0.4)"}`,
            color: result.accepted === null ? "#f9ca24" : result.accepted ? "#43e97b" : "#ff6584",
          }}>
            {result.accepted === null ? "⚠" : result.accepted ? "✓" : "✗"} {result.accepted === null ? result.reason : `${result.accepted ? "DITERIMA" : "DITOLAK"} — ${result.reason}`}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── THEORY SECTION RENDERER ─────────────────────────────────────────────────
function TheorySection({ section }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <span style={{ fontSize: 28 }}>{section.icon}</span>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#e8eaf6", margin: 0 }}>{section.title}</h2>
      </div>
      {section.content.map((block, bi) => {
        if (block.type === "text") return (
          <p key={bi} style={{ color: "#b0b4d0", lineHeight: 1.8, marginBottom: 16, fontSize: 15 }}>{block.body}</p>
        );
        if (block.type === "highlight") return (
          <div key={bi} style={{ background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.3)", borderLeft: "4px solid #6c63ff", borderRadius: 10, padding: "14px 18px", marginBottom: 16 }}>
            <p style={{ color: "#c8c3ff", lineHeight: 1.8, margin: 0, fontSize: 15 }}>{block.body}</p>
          </div>
        );
        if (block.type === "analogy") return (
          <div key={bi} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#6b7299", fontFamily: "monospace", letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>{block.title}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10 }}>
              {block.items.map((item, i) => (
                <div key={i} style={{ background: "#10152a", border: "1px solid #1e2240", borderRadius: 10, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 22 }}>{item.icon}</span>
                  <span style={{ color: "#b0b4d0", fontSize: 13, lineHeight: 1.6 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        );
        if (block.type === "components") return (
          <div key={bi} style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
            {block.items.map((item, i) => (
              <div key={i} style={{ background: "#10152a", border: `1px solid ${item.color}30`, borderLeft: `4px solid ${item.color}`, borderRadius: 10, padding: "14px 18px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ fontSize: 26, fontWeight: 900, fontFamily: "monospace", color: item.color, minWidth: 36, textAlign: "center" }}>{item.symbol}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#e8eaf6", marginBottom: 4 }}>{item.name}</div>
                  <div style={{ color: "#8a8fb0", fontSize: 13, lineHeight: 1.6, marginBottom: 6 }}>{item.desc}</div>
                  <code style={{ background: "rgba(255,255,255,0.05)", padding: "3px 10px", borderRadius: 6, fontSize: 13, color: item.color, fontFamily: "monospace" }}>{item.example}</code>
                </div>
              </div>
            ))}
          </div>
        );
        if (block.type === "diagram-legend") return (
          <div key={bi} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10, marginBottom: 16 }}>
            {block.items.map((item, i) => (
              <div key={i} style={{ background: "#10152a", border: "1px solid #1e2240", borderRadius: 10, padding: "12px 16px" }}>
                <DiagramLegendVisual type={item.visual} />
                <div style={{ fontWeight: 700, color: "#e8eaf6", fontSize: 13, marginBottom: 4 }}>{item.label}</div>
                <div style={{ color: "#6b7299", fontSize: 12 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        );
        if (block.type === "comparison") return (
          <div key={bi} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
            {[block.left, block.right].map((side, i) => (
              <div key={i} style={{ background: "#10152a", border: `1px solid ${side.color}30`, borderRadius: 12, padding: "18px 20px" }}>
                <div style={{ fontWeight: 800, fontSize: 18, color: side.color, marginBottom: 14 }}>{side.title}</div>
                {side.points.map((p, j) => (
                  <div key={j} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                    <span style={{ color: side.color, fontSize: 16, marginTop: 1 }}>•</span>
                    <span style={{ color: "#8a8fb0", fontSize: 13, lineHeight: 1.6 }}>{p}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
        if (block.type === "table-example") return (
          <div key={bi} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#6b7299", marginBottom: 10 }}>{block.title}</div>
            <div style={{ overflowX: "auto", marginBottom: 12 }}>
              <table style={{ borderCollapse: "collapse", fontFamily: "monospace", fontSize: 13 }}>
                <thead><tr>{block.headers.map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                <tbody>{block.rows.map((row, i) => (
                  <tr key={i}>{row.slice(0, 3).map((cell, j) => (
                    <td key={j} style={{ ...tdStyle, color: row[3] === "start+final" && j === 0 ? "#43c6ff" : "#e8eaf6" }}>{cell}</td>
                  ))}</tr>
                ))}</tbody>
              </table>
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {block.legend.map((l, i) => (
                <span key={i} style={{ fontSize: 12, color: "#a9a3ff", fontFamily: "monospace" }}><b>{l.symbol}</b> = {l.desc}</span>
              ))}
            </div>
          </div>
        );
        if (block.type === "steps") return (
          <div key={bi} style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {block.items.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#10152a", border: "1px solid #1e2240", borderRadius: 10, padding: "12px 16px" }}>
                <div style={{ background: "#6c63ff", color: "#fff", fontWeight: 800, fontSize: 13, width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.step}</div>
                <div>
                  <div style={{ fontWeight: 700, color: "#e8eaf6", fontSize: 14, marginBottom: 3 }}>{s.title}</div>
                  <div style={{ color: "#8a8fb0", fontSize: 13, lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        );
        if (block.type === "example-trace") return (
          <div key={bi} style={{ background: "#10152a", border: "1px solid #1e2240", borderRadius: 12, padding: "18px 20px", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#6b7299", marginBottom: 14 }}>{block.title}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14, alignItems: "center" }}>
              {block.steps.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ background: "rgba(108,99,255,0.15)", border: "1px solid rgba(108,99,255,0.3)", borderRadius: 8, padding: "6px 12px" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#a9a3ff", fontFamily: "monospace" }}>{s.to}</div>
                    <div style={{ fontSize: 10, color: "#5a6090" }}>{s.note}</div>
                  </div>
                  {i < block.steps.length - 1 && <span style={{ color: "#3a4070", fontSize: 18 }}>→</span>}
                </div>
              ))}
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "rgba(255,101,132,0.1)", border: "1px solid rgba(255,101,132,0.3)", color: "#ff6584", fontSize: 14, fontWeight: 700 }}>
              ✗ {block.result} — {block.reason}
            </div>
          </div>
        );
        return null;
      })}
    </div>
  );
}

function DiagramLegendVisual({ type }) {
  const svgProps = { width: 60, height: 36, style: { display: "block", marginBottom: 8 } };
  if (type === "circle") return <svg {...svgProps}><circle cx={30} cy={18} r={14} fill="#10152a" stroke="#3a4070" strokeWidth={2} /><text x={30} y={22} textAnchor="middle" fill="#e8eaf6" fontSize={11} fontFamily="monospace">q</text></svg>;
  if (type === "double-circle") return <svg {...svgProps}><circle cx={30} cy={18} r={14} fill="rgba(67,233,123,0.1)" stroke="#43e97b" strokeWidth={2} /><circle cx={30} cy={18} r={9} fill="none" stroke="#43e97b" strokeWidth={1.5} /></svg>;
  if (type === "arrow-in") return <svg {...svgProps}><line x1={5} y1={18} x2={42} y2={18} stroke="#f9ca24" strokeWidth={2} /><polygon points="42,14 50,18 42,22" fill="#f9ca24" /></svg>;
  if (type === "arrow") return <svg {...svgProps}><line x1={5} y1={18} x2={45} y2={18} stroke="#5a6080" strokeWidth={2} /><polygon points="45,14 53,18 45,22" fill="#5a6080" /><text x={29} y={14} textAnchor="middle" fill="#a9a3ff" fontSize={10} fontFamily="monospace">a</text></svg>;
  if (type === "self-loop") return <svg {...svgProps}><path d="M18,18 C18,2 42,2 42,18" fill="none" stroke="#ff9f43" strokeWidth={1.8} /><polygon points="42,14 42,22 36,18" fill="#ff9f43" /><text x={30} y={10} textAnchor="middle" fill="#a9a3ff" fontSize={10} fontFamily="monospace">a</text></svg>;
  if (type === "label") return <svg {...svgProps}><line x1={5} y1={22} x2={50} y2={22} stroke="#5a6080" strokeWidth={1.5} /><text x={27} y={16} textAnchor="middle" fill="#a9a3ff" fontSize={12} fontFamily="monospace" fontWeight="bold">b</text></svg>;
  return null;
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const thStyle = { background: "rgba(108,99,255,0.12)", color: "#9d97ff", padding: "10px 16px", border: "1px solid #1e2240", fontSize: 13 };
const tdStyle = { border: "1px solid #1e2240", padding: "9px 16px", textAlign: "center" };
const inputStyle = { flex: 1, minWidth: 120, background: "#08091a", border: "1px solid #1e2240", borderRadius: 10, color: "#e8eaf6", fontFamily: "monospace", fontSize: 15, padding: "10px 14px", outline: "none" };
const btnStyle = (disabled) => ({ background: disabled ? "#2a2f50" : "#6c63ff", color: disabled ? "#4a5070" : "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, padding: "10px 22px", cursor: disabled ? "not-allowed" : "pointer" });

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("tutorial"); // "tutorial" | "soal-0" | "soal-1" | "soal-2"
  const [theoryIdx, setTheoryIdx] = useState(0);
  const [soalTab, setSoalTab] = useState("diagram"); // "diagram" | "tabel" | "uji"

  const activeDFA = page.startsWith("soal-") ? DFAS[parseInt(page.split("-")[1])] : null;

  return (
    <div style={{ fontFamily: "sans-serif", background: "#080c1a", minHeight: "100vh", color: "#e8eaf6" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;600;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080c1a; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #10152a; } ::-webkit-scrollbar-thumb { background: #2a3060; border-radius: 3px; }
        input:focus { border-color: #6c63ff !important; }
      `}</style>

      {/* Top Nav */}
      <nav style={{ borderBottom: "1px solid #1e2240", padding: "0 24px", display: "flex", alignItems: "center", gap: 0, overflowX: "auto", background: "#0a0e1e", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontWeight: 800, fontSize: 15, color: "#6c63ff", paddingRight: 24, borderRight: "1px solid #1e2240", marginRight: 16, whiteSpace: "nowrap", padding: "16px 24px 16px 0" }}>
          FSA Lab
        </div>
        {[
          { id: "tutorial", label: "📚 Tutorial" },
          { id: "soal-0", label: "Soal 1" },
          { id: "soal-1", label: "Soal 2" },
          { id: "soal-2", label: "Soal 3" },
        ].map(n => (
          <button key={n.id} onClick={() => { setPage(n.id); setSoalTab("diagram"); }}
            style={{ background: "none", border: "none", padding: "16px 18px", cursor: "pointer", fontSize: 14, fontWeight: page === n.id ? 700 : 400, color: page === n.id ? "#6c63ff" : "#6b7299", borderBottom: `2px solid ${page === n.id ? "#6c63ff" : "transparent"}`, whiteSpace: "nowrap", fontFamily: "sans-serif", transition: "all 0.2s" }}>
            {n.label}
          </button>
        ))}
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 60px" }}>

        {/* ── TUTORIAL PAGE ── */}
        {page === "tutorial" && (
          <div>
            {/* Hero */}
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ display: "inline-block", background: "rgba(108,99,255,0.12)", border: "1px solid rgba(108,99,255,0.35)", color: "#9d97ff", fontSize: 11, letterSpacing: 2, padding: "4px 16px", borderRadius: 20, marginBottom: 14, fontFamily: "monospace" }}>
                TEORI BAHASA & AUTOMATA
              </div>
              <h1 style={{ fontSize: "clamp(28px,6vw,46px)", fontWeight: 800, background: "linear-gradient(135deg,#fff 30%,#6c63ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1.15, marginBottom: 12 }}>
                Finite State Automata<br />— Panduan Lengkap
              </h1>
              <p style={{ color: "#6b7299", fontSize: 15, lineHeight: 1.7, maxWidth: 540, margin: "0 auto 28px" }}>
                Pelajari konsep FSA dari dasar hingga mahir. Dilengkapi simulasi interaktif untuk 3 soal Tugas 2.
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                {[["🤖 Apa itu FSA?", 0], ["⚙️ Komponen", 1], ["🔵 Diagram", 2], ["📊 Tabel", 3], ["⚖️ DFA vs NFA", 4], ["▶️ Cara Kerja", 5]].map(([label, idx]) => (
                  <button key={idx} onClick={() => setTheoryIdx(idx)}
                    style={{ background: theoryIdx === idx ? "#6c63ff" : "#10152a", border: `1px solid ${theoryIdx === idx ? "#6c63ff" : "#1e2240"}`, color: theoryIdx === idx ? "#fff" : "#8a8fb0", padding: "8px 16px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "sans-serif", transition: "all 0.2s" }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theory content */}
            <div style={{ background: "#0d1124", border: "1px solid #1e2240", borderRadius: 16, padding: "28px 30px" }}>
              <TheorySection section={THEORY[theoryIdx]} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, paddingTop: 20, borderTop: "1px solid #1e2240" }}>
                <button onClick={() => setTheoryIdx(i => Math.max(0, i - 1))} disabled={theoryIdx === 0}
                  style={{ ...btnStyle(theoryIdx === 0), background: theoryIdx === 0 ? "#10152a" : "#1e2240", color: theoryIdx === 0 ? "#3a4070" : "#8a8fb0" }}>
                  ← Sebelumnya
                </button>
                <span style={{ color: "#3a4070", fontSize: 13, alignSelf: "center", fontFamily: "monospace" }}>{theoryIdx + 1} / {THEORY.length}</span>
                {theoryIdx < THEORY.length - 1
                  ? <button onClick={() => setTheoryIdx(i => i + 1)} style={btnStyle(false)}>Selanjutnya →</button>
                  : <button onClick={() => setPage("soal-0")} style={btnStyle(false)}>🚀 Ke Simulasi →</button>
                }
              </div>
            </div>

            {/* Quick nav cards */}
            <div style={{ marginTop: 32 }}>
              <div style={{ fontSize: 13, color: "#3a4070", fontFamily: "monospace", letterSpacing: 1, marginBottom: 16, textTransform: "uppercase" }}>Langsung ke Soal:</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }}>
                {DFAS.map(d => (
                  <div key={d.id} onClick={() => { setPage(`soal-${d.id}`); setSoalTab("diagram"); }}
                    style={{ background: "#0d1124", border: "1px solid #1e2240", borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "border-color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#6c63ff"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#1e2240"}>
                    <div style={{ fontSize: 11, color: "#6c63ff", fontFamily: "monospace", letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>{d.soal}</div>
                    <div style={{ fontWeight: 700, color: "#e8eaf6", fontSize: 15, marginBottom: 6 }}>{d.title}</div>
                      <div style={{ color: "#6b7299", fontSize: 12 }}>Q={`{${d.states.join(",")}}`} &nbsp;Σ={`{${d.alphabet.join(",")}}`}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SOAL PAGE ── */}
        {activeDFA && (
          <div>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, color: "#6c63ff", fontFamily: "monospace", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>{activeDFA.soal}</div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#e8eaf6", marginBottom: 6 }}>{activeDFA.title}</h1>
              <p style={{ color: "#6b7299", fontSize: 14, marginBottom: 16 }}>{activeDFA.task}</p>
              {/* Spec chips */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  ["Q (States)", `{${activeDFA.states.join(",")}}`],
                  ["Σ (Alfabet)", `{${activeDFA.alphabet.join(",")}}`],
                  ["S (Start)", activeDFA.states[activeDFA.start]],
                  ["F (Final)", `{${activeDFA.finals.map(f => activeDFA.states[f]).join(",")}}`],
                ].map(([label, val]) => (
                  <div key={label} style={{ background: "#0d1124", border: "1px solid #1e2240", borderRadius: 10, padding: "8px 14px", fontFamily: "monospace" }}>
                    <div style={{ fontSize: 10, color: "#3a4070", marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 13, color: "#c8cbea", fontWeight: 700 }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {[["diagram", "🔵 Diagram"], ["tabel", "📊 Tabel Transisi"], ["uji", "🧪 Uji String"]].map(([id, label]) => (
                <button key={id} onClick={() => setSoalTab(id)}
                  style={{ background: soalTab === id ? "#6c63ff" : "#10152a", border: `1px solid ${soalTab === id ? "#6c63ff" : "#1e2240"}`, color: soalTab === id ? "#fff" : "#6b7299", padding: "9px 18px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "sans-serif" }}>
                  {label}
                </button>
              ))}
            </div>

            <div style={{ background: "#0d1124", border: "1px solid #1e2240", borderRadius: 16, padding: "24px" }}>
              {soalTab === "diagram" && (
                <div>
                  <div style={{ fontSize: 13, color: "#3a4070", fontFamily: "monospace", letterSpacing: 1, marginBottom: 16, textTransform: "uppercase" }}>Diagram Transisi</div>
                  <FSACanvas dfa={activeDFA} />
                  <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 16 }}>
                    {[["State Awal (S)", "#f9ca24"], ["Final State (F)", "#43e97b"], ["Start + Final", "#43c6ff"], ["State Biasa", "#3a4070"]].map(([l, c]) => (
                      <div key={l} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#6b7299" }}>
                        <div style={{ width: 12, height: 12, borderRadius: "50%", border: `2px solid ${c}`, background: c === "#3a4070" ? "transparent" : `${c}20` }} />
                        {l}
                      </div>
                    ))}
                  </div>
                  {/* Fungsi transisi daftar */}
                  <div style={{ marginTop: 24, background: "#080c1a", borderRadius: 12, padding: "16px 20px" }}>
                    <div style={{ fontSize: 11, color: "#3a4070", fontFamily: "monospace", letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>Fungsi Transisi δ:</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 8 }}>
                      {activeDFA.states.map((s, i) =>
                        activeDFA.alphabet.map(sym => (
                          <code key={`${i}-${sym}`} style={{ background: "#10152a", border: "1px solid #1e2240", borderRadius: 8, padding: "5px 12px", fontSize: 12, color: "#a9a3ff", fontFamily: "monospace" }}>
                            δ({s},{sym}) = {activeDFA.states[activeDFA.delta[i][sym]]}
                          </code>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {soalTab === "tabel" && (
                <div>
                  <div style={{ fontSize: 13, color: "#3a4070", fontFamily: "monospace", letterSpacing: 1, marginBottom: 16, textTransform: "uppercase" }}>Tabel Transisi (δ)</div>
                  <TransitionTable dfa={activeDFA} />
                  <div style={{ marginTop: 24, background: "#080c1a", borderRadius: 12, padding: "16px 20px" }}>
                    <div style={{ fontSize: 12, color: "#3a4070", fontFamily: "monospace", letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>Cara Membaca Tabel:</div>
                    <div style={{ color: "#8a8fb0", fontSize: 13, lineHeight: 1.9 }}>
                      • Baris = state asal &nbsp;|&nbsp; Kolom = simbol input &nbsp;|&nbsp; Isi sel = state tujuan<br />
                      • Tanda <span style={{ color: "#f9ca24" }}>→</span> di depan state menunjukkan initial state<br />
                      • Tanda <span style={{ color: "#43e97b" }}>*</span> di depan state menunjukkan final/accepting state<br />
                      • Contoh membaca: baris q₀, kolom '{activeDFA.alphabet[0]}' → state tujuan adalah {activeDFA.states[activeDFA.delta[0][activeDFA.alphabet[0]]]}
                    </div>
                  </div>
                </div>
              )}

              {soalTab === "uji" && (
                <div>
                  <div style={{ fontSize: 13, color: "#3a4070", fontFamily: "monospace", letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>Uji String Input</div>
                  <p style={{ color: "#6b7299", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
                    Masukkan string dari alfabet {`{${activeDFA.alphabet.join(",")}}`} untuk diuji apakah diterima atau ditolak oleh DFA ini. Animasi akan menunjukkan jalur eksekusi langkah per langkah.
                  </p>
                  <StringTester dfa={activeDFA} />
                  <div style={{ marginTop: 24, background: "#080c1a", borderRadius: 12, padding: "16px 20px" }}>
                    <div style={{ fontSize: 11, color: "#3a4070", fontFamily: "monospace", letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>💡 Penjelasan DFA ini:</div>
                    <p style={{ color: "#8a8fb0", fontSize: 13, lineHeight: 1.8 }}>{activeDFA.explanation}</p>
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 11, color: "#3a4070", fontFamily: "monospace", marginBottom: 8 }}>Contoh string untuk dicoba:</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {activeDFA.id === 0 && ["00","11","0011","1010","101","0110"].map(s => <ExampleChip key={s} str={s} />)}
                        {activeDFA.id === 1 && ["ab","ba","abab","a","b","aab"].map(s => <ExampleChip key={s} str={s} />)}
                        {activeDFA.id === 2 && ["a","b","bb","bbb","ab","abb","abbb"].map(s => <ExampleChip key={s} str={s} />)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Nav between soals */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
              <button onClick={() => setPage("tutorial")} style={{ ...btnStyle(false), background: "#10152a", color: "#6b7299" }}>← Tutorial</button>
              <div style={{ display: "flex", gap: 10 }}>
                {activeDFA.id > 0 && <button onClick={() => setPage(`soal-${activeDFA.id - 1}`)} style={{ ...btnStyle(false), background: "#1e2240", color: "#8a8fb0" }}>← {DFAS[activeDFA.id - 1].soal}</button>}
                {activeDFA.id < 2 && <button onClick={() => setPage(`soal-${activeDFA.id + 1}`)} style={btnStyle(false)}>{DFAS[activeDFA.id + 1].soal} →</button>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ExampleChip({ str }) {
  return (
    <span style={{ background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.25)", borderRadius: 8, padding: "4px 12px", fontSize: 13, color: "#a9a3ff", fontFamily: "monospace", cursor: "default" }}>
      "{str}"
    </span>
  );
}
