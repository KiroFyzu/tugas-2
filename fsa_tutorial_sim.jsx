import { useState, useEffect, useRef, useCallback } from 'react'

// ─── DATA ────────────────────────────────────────────────────────────────────
import { THEORY, DFAS } from './src/data/fsaData'
import { drawFSACanvas } from './src/utils/drawFSA'

function FSACanvas({ dfa, activeState, traceEdge, height = 320 }) {
    const ref = useRef(null)
    useEffect(() => {
        if (ref.current) drawFSACanvas(ref.current, dfa, activeState, traceEdge)
    }, [dfa, activeState, traceEdge])
    return (
        <canvas
            ref={ref}
            width={480}
            height={height}
            style={{
                width: '100%',
                borderRadius: 12,
                background:
                    'radial-gradient(circle at 20% 15%, rgba(255,122,89,0.25) 0%, rgba(255,122,89,0) 45%), radial-gradient(circle at 85% 80%, rgba(126,200,255,0.25) 0%, rgba(126,200,255,0) 45%), rgba(16,10,20,0.72)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 20px 42px rgba(16,8,14,0.35)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                display: 'block',
            }}
        />
    )
}

function TransitionTable({ dfa, activeState }) {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontFamily: 'monospace',
                    fontSize: 14,
                }}
            >
                <thead>
                    <tr>
                        <th style={thStyle}>δ</th>
                        {dfa.alphabet.map((a) => (
                            <th key={a} style={thStyle}>
                                {a}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {dfa.states.map((s, i) => {
                        const isS = i === dfa.start,
                            isF = dfa.finals.includes(i),
                            isA = activeState === i
                        const rowLabel = `${isS ? '→' : ''}${isF ? '*' : ''}${s}`
                        const color = isA
                            ? '#ffd166'
                            : isS && isF
                              ? '#7ec8ff'
                              : isF
                                ? '#66d9b8'
                                : isS
                                  ? '#ffd166'
                                  : '#fff7f2'
                        return (
                            <tr
                                key={i}
                                style={{
                                    background: isA
                                        ? 'rgba(255,209,102,0.12)'
                                        : i % 2
                                          ? 'rgba(255,255,255,0.015)'
                                          : 'transparent',
                                }}
                            >
                                <td
                                    style={{
                                        ...tdStyle,
                                        color,
                                        fontWeight: 700,
                                    }}
                                >
                                    {rowLabel}
                                </td>
                                {dfa.alphabet.map((sym) => (
                                    <td
                                        key={sym}
                                        style={{
                                            ...tdStyle,
                                            color: dfa.finals.includes(
                                                dfa.delta[i][sym],
                                            )
                                                ? '#66d9b8'
                                                : '#ffe9e2',
                                        }}
                                    >
                                        {dfa.states[dfa.delta[i][sym]]}
                                    </td>
                                ))}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div
                style={{
                    marginTop: 10,
                    display: 'flex',
                    gap: 14,
                    flexWrap: 'wrap',
                }}
            >
                {[
                    ['→ = state awal', '#ffd166'],
                    ['* = final state', '#66d9b8'],
                    ['→* = keduanya', '#7ec8ff'],
                ].map(([t, c]) => (
                    <span
                        key={t}
                        style={{
                            fontSize: 11,
                            color: c,
                            fontFamily: 'monospace',
                        }}
                    >
                        {t}
                    </span>
                ))}
            </div>
        </div>
    )
}

function StringTester({ dfa }) {
    const [input, setInput] = useState('')
    const [traceSteps, setTraceSteps] = useState([])
    const [result, setResult] = useState(null)
    const [activeState, setActiveState] = useState(null)
    const [traceEdge, setTraceEdge] = useState(null)
    const [animIdx, setAnimIdx] = useState(-1)
    const [running, setRunning] = useState(false)

    const compute = useCallback(() => {
        if (!input && input !== '') return
        for (const ch of input) {
            if (!dfa.alphabet.includes(ch)) {
                setResult({
                    accepted: null,
                    reason: `Karakter '${ch}' tidak ada di alfabet {${dfa.alphabet.join(',')}}`,
                })
                setTraceSteps([])
                return
            }
        }
        const steps = [{ state: dfa.start, input: null, note: 'State awal' }]
        let cur = dfa.start
        for (const ch of input) {
            const next = dfa.delta[cur][ch]
            steps.push({
                state: next,
                from: cur,
                input: ch,
                note: `δ(${dfa.states[cur]},${ch})=${dfa.states[next]}`,
            })
            cur = next
        }
        const accepted = dfa.finals.includes(cur)
        setTraceSteps(steps)
        setResult({
            accepted,
            reason: `Berakhir di ${dfa.states[cur]} ${accepted ? '(final state ✓)' : '(bukan final state ✗)'}`,
        })
        setActiveState(null)
        setTraceEdge(null)
        setAnimIdx(-1)
        setRunning(true)
    }, [input, dfa])

    useEffect(() => {
        if (!running || traceSteps.length === 0) return
        let idx = 0
        setActiveState(traceSteps[0].state)
        const iv = setInterval(() => {
            idx++
            if (idx >= traceSteps.length) {
                clearInterval(iv)
                setRunning(false)
                setTraceEdge(null)
                return
            }
            const s = traceSteps[idx]
            setActiveState(s.state)
            setTraceEdge({ from: s.from, sym: s.input })
            setAnimIdx(idx)
        }, 700)
        return () => clearInterval(iv)
    }, [running, traceSteps])

    return (
        <div>
            <FSACanvas
                dfa={dfa}
                activeState={activeState}
                traceEdge={traceEdge}
            />
            <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                    <input
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value)
                            setTraceSteps([])
                            setResult(null)
                            setActiveState(null)
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && compute()}
                        placeholder={`Contoh: ${dfa.alphabet[0]}${dfa.alphabet[1]}${dfa.alphabet[0]}`}
                        style={inputStyle}
                    />
                    <button
                        onClick={compute}
                        disabled={running}
                        style={btnStyle(running)}
                    >
                        {running ? '⏳' : '▶ Uji'}
                    </button>
                    <button
                        onClick={() => {
                            setInput('')
                            setTraceSteps([])
                            setResult(null)
                            setActiveState(null)
                            setTraceEdge(null)
                        }}
                        style={{
                            ...btnStyle(false),
                            background: 'rgba(255,255,255,0.24)',
                            color: '#d2aea8',
                        }}
                    >
                        ↺
                    </button>
                </div>

                {traceSteps.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                        <div
                            style={{
                                fontSize: 11,
                                color: '#d2aea8',
                                fontFamily: 'monospace',
                                marginBottom: 8,
                                letterSpacing: 1,
                            }}
                        >
                            JEJAK EKSEKUSI:
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 6,
                            }}
                        >
                            {traceSteps.map((s, i) => (
                                <div
                                    key={i}
                                    style={{
                                        padding: '5px 12px',
                                        borderRadius: 8,
                                        fontSize: 12,
                                        fontFamily: 'monospace',
                                        background:
                                            animIdx >= i
                                                ? 'rgba(255,122,89,0.22)'
                                                : 'rgba(255,255,255,0.04)',
                                        border: `1px solid ${animIdx >= i ? 'rgba(255,122,89,0.50)' : 'rgba(255,255,255,0.24)'}`,
                                        color:
                                            animIdx >= i
                                                ? '#ffe8df'
                                                : '#9d8598',
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    {s.note}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {result && (
                    <div
                        style={{
                            padding: '12px 18px',
                            borderRadius: 10,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 10,
                            fontSize: 14,
                            fontWeight: 700,
                            background:
                                result.accepted === null
                                    ? 'rgba(255,209,102,0.16)'
                                    : result.accepted
                                      ? 'rgba(102,217,184,0.16)'
                                      : 'rgba(255,111,145,0.16)',
                            border: `1px solid ${result.accepted === null ? 'rgba(255,209,102,0.45)' : result.accepted ? 'rgba(102,217,184,0.42)' : 'rgba(255,111,145,0.45)'}`,
                            color:
                                result.accepted === null
                                    ? '#ffd166'
                                    : result.accepted
                                      ? '#66d9b8'
                                      : '#ff6f91',
                        }}
                    >
                        {result.accepted === null
                            ? '⚠'
                            : result.accepted
                              ? '✓'
                              : '✗'}{' '}
                        {result.accepted === null
                            ? result.reason
                            : `${result.accepted ? 'DITERIMA' : 'DITOLAK'} — ${result.reason}`}
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── THEORY SECTION RENDERER ─────────────────────────────────────────────────
function TheorySection({ section }) {
    return (
        <div style={{ marginBottom: 32 }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 18,
                }}
            >
                <span style={{ fontSize: 28 }}>{section.icon}</span>
                <h2
                    style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: '#fff7f2',
                        margin: 0,
                    }}
                >
                    {section.title}
                </h2>
            </div>
            {section.content.map((block, bi) => {
                if (block.type === 'text')
                    return (
                        <p
                            key={bi}
                            style={{
                                color: '#f4d7cc',
                                lineHeight: 1.8,
                                marginBottom: 16,
                                fontSize: 15,
                            }}
                        >
                            {block.body}
                        </p>
                    )
                if (block.type === 'highlight')
                    return (
                        <div
                            key={bi}
                            style={{
                                background: 'rgba(255,122,89,0.16)',
                                border: '1px solid rgba(255,122,89,0.34)',
                                borderLeft: '4px solid #ff7a59',
                                borderRadius: 10,
                                padding: '14px 18px',
                                marginBottom: 16,
                            }}
                        >
                            <p
                                style={{
                                    color: '#ffe8df',
                                    lineHeight: 1.8,
                                    margin: 0,
                                    fontSize: 15,
                                }}
                            >
                                {block.body}
                            </p>
                        </div>
                    )
                if (block.type === 'analogy')
                    return (
                        <div key={bi} style={{ marginBottom: 20 }}>
                            <div
                                style={{
                                    fontSize: 13,
                                    color: '#d2aea8',
                                    fontFamily: 'monospace',
                                    letterSpacing: 1,
                                    marginBottom: 12,
                                    textTransform: 'uppercase',
                                }}
                            >
                                {block.title}
                            </div>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns:
                                        'repeat(auto-fit,minmax(200px,1fr))',
                                    gap: 10,
                                }}
                            >
                                {block.items.map((item, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            background: 'rgba(255,255,255,0.08)',
                                            border: '1px solid rgba(255,255,255,0.24)',
                                            borderRadius: 10,
                                            padding: '12px 14px',
                                            display: 'flex',
                                            gap: 10,
                                            alignItems: 'flex-start',
                                        }}
                                    >
                                        <span style={{ fontSize: 22 }}>
                                            {item.icon}
                                        </span>
                                        <span
                                            style={{
                                                color: '#f4d7cc',
                                                fontSize: 13,
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {item.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                if (block.type === 'components')
                    return (
                        <div
                            key={bi}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 12,
                                marginBottom: 16,
                            }}
                        >
                            {block.items.map((item, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: 'rgba(255,255,255,0.08)',
                                        border: `1px solid ${item.color}30`,
                                        borderLeft: `4px solid ${item.color}`,
                                        borderRadius: 10,
                                        padding: '14px 18px',
                                        display: 'flex',
                                        gap: 16,
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 26,
                                            fontWeight: 900,
                                            fontFamily: 'monospace',
                                            color: item.color,
                                            minWidth: 36,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {item.symbol}
                                    </div>
                                    <div>
                                        <div
                                            style={{
                                                fontWeight: 700,
                                                fontSize: 15,
                                                color: '#fff7f2',
                                                marginBottom: 4,
                                            }}
                                        >
                                            {item.name}
                                        </div>
                                        <div
                                            style={{
                                                color: '#e8c6bd',
                                                fontSize: 13,
                                                lineHeight: 1.6,
                                                marginBottom: 6,
                                            }}
                                        >
                                            {item.desc}
                                        </div>
                                        <code
                                            style={{
                                                background:
                                                    'rgba(255,255,255,0.05)',
                                                padding: '3px 10px',
                                                borderRadius: 6,
                                                fontSize: 13,
                                                color: item.color,
                                                fontFamily: 'monospace',
                                            }}
                                        >
                                            {item.example}
                                        </code>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                if (block.type === 'diagram-legend')
                    return (
                        <div
                            key={bi}
                            style={{
                                display: 'grid',
                                gridTemplateColumns:
                                    'repeat(auto-fit,minmax(220px,1fr))',
                                gap: 10,
                                marginBottom: 16,
                            }}
                        >
                            {block.items.map((item, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: 'rgba(255,255,255,0.08)',
                                        border: '1px solid rgba(255,255,255,0.24)',
                                        borderRadius: 10,
                                        padding: '12px 16px',
                                    }}
                                >
                                    <DiagramLegendVisual type={item.visual} />
                                    <div
                                        style={{
                                            fontWeight: 700,
                                            color: '#fff7f2',
                                            fontSize: 13,
                                            marginBottom: 4,
                                        }}
                                    >
                                        {item.label}
                                    </div>
                                    <div
                                        style={{
                                            color: '#d2aea8',
                                            fontSize: 12,
                                        }}
                                    >
                                        {item.desc}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                if (block.type === 'comparison')
                    return (
                        <div
                            key={bi}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 14,
                                marginBottom: 16,
                            }}
                        >
                            {[block.left, block.right].map((side, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: 'rgba(255,255,255,0.08)',
                                        border: `1px solid ${side.color}30`,
                                        borderRadius: 12,
                                        padding: '18px 20px',
                                    }}
                                >
                                    <div
                                        style={{
                                            fontWeight: 800,
                                            fontSize: 18,
                                            color: side.color,
                                            marginBottom: 14,
                                        }}
                                    >
                                        {side.title}
                                    </div>
                                    {side.points.map((p, j) => (
                                        <div
                                            key={j}
                                            style={{
                                                display: 'flex',
                                                gap: 10,
                                                marginBottom: 10,
                                                alignItems: 'flex-start',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: side.color,
                                                    fontSize: 16,
                                                    marginTop: 1,
                                                }}
                                            >
                                                •
                                            </span>
                                            <span
                                                style={{
                                                    color: '#e8c6bd',
                                                    fontSize: 13,
                                                    lineHeight: 1.6,
                                                }}
                                            >
                                                {p}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )
                if (block.type === 'table-example')
                    return (
                        <div key={bi} style={{ marginBottom: 16 }}>
                            <div
                                style={{
                                    fontSize: 13,
                                    color: '#d2aea8',
                                    marginBottom: 10,
                                }}
                            >
                                {block.title}
                            </div>
                            <div
                                style={{ overflowX: 'auto', marginBottom: 12 }}
                            >
                                <table
                                    style={{
                                        borderCollapse: 'collapse',
                                        fontFamily: 'monospace',
                                        fontSize: 13,
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            {block.headers.map((h) => (
                                                <th key={h} style={thStyle}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {block.rows.map((row, i) => (
                                            <tr key={i}>
                                                {row
                                                    .slice(0, 3)
                                                    .map((cell, j) => (
                                                        <td
                                                            key={j}
                                                            style={{
                                                                ...tdStyle,
                                                                color:
                                                                    row[3] ===
                                                                        'start+final' &&
                                                                    j === 0
                                                                        ? '#7ec8ff'
                                                                        : '#fff7f2',
                                                            }}
                                                        >
                                                            {cell}
                                                        </td>
                                                    ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: 16,
                                    flexWrap: 'wrap',
                                }}
                            >
                                {block.legend.map((l, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            fontSize: 12,
                                            color: '#ffd5c8',
                                            fontFamily: 'monospace',
                                        }}
                                    >
                                        <b>{l.symbol}</b> = {l.desc}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )
                if (block.type === 'steps')
                    return (
                        <div
                            key={bi}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 10,
                                marginBottom: 16,
                            }}
                        >
                            {block.items.map((s, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: 'flex',
                                        gap: 14,
                                        alignItems: 'flex-start',
                                        background: 'rgba(255,255,255,0.08)',
                                        border: '1px solid rgba(255,255,255,0.24)',
                                        borderRadius: 10,
                                        padding: '12px 16px',
                                    }}
                                >
                                    <div
                                        style={{
                                            background: '#ff7a59',
                                            color: '#fff',
                                            fontWeight: 800,
                                            fontSize: 13,
                                            width: 28,
                                            height: 28,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {s.step}
                                    </div>
                                    <div>
                                        <div
                                            style={{
                                                fontWeight: 700,
                                                color: '#fff7f2',
                                                fontSize: 14,
                                                marginBottom: 3,
                                            }}
                                        >
                                            {s.title}
                                        </div>
                                        <div
                                            style={{
                                                color: '#e8c6bd',
                                                fontSize: 13,
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {s.desc}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                if (block.type === 'example-trace')
                    return (
                        <div
                            key={bi}
                            style={{
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.24)',
                                borderRadius: 12,
                                padding: '18px 20px',
                                marginBottom: 16,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 13,
                                    color: '#d2aea8',
                                    marginBottom: 14,
                                }}
                            >
                                {block.title}
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 8,
                                    marginBottom: 14,
                                    alignItems: 'center',
                                }}
                            >
                                {block.steps.map((s, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6,
                                        }}
                                    >
                                        <div
                                            style={{
                                                background:
                                                    'rgba(255,122,89,0.20)',
                                                border: '1px solid rgba(255,122,89,0.34)',
                                                borderRadius: 8,
                                                padding: '6px 12px',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: 700,
                                                    color: '#ffd5c8',
                                                    fontFamily: 'monospace',
                                                }}
                                            >
                                                {s.to}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 10,
                                                    color: '#b99dab',
                                                }}
                                            >
                                                {s.note}
                                            </div>
                                        </div>
                                        {i < block.steps.length - 1 && (
                                            <span
                                                style={{
                                                    color: '#8f758d',
                                                    fontSize: 18,
                                                }}
                                            >
                                                →
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '8px 16px',
                                    borderRadius: 8,
                                    background: 'rgba(255,111,145,0.16)',
                                    border: '1px solid rgba(255,111,145,0.35)',
                                    color: '#ff6f91',
                                    fontSize: 14,
                                    fontWeight: 700,
                                }}
                            >
                                ✗ {block.result} — {block.reason}
                            </div>
                        </div>
                    )
                return null
            })}
        </div>
    )
}

function DiagramLegendVisual({ type }) {
    const svgProps = {
        width: 60,
        height: 36,
        style: { display: 'block', marginBottom: 8 },
    }
    if (type === 'circle')
        return (
            <svg {...svgProps}>
                <circle
                    cx={30}
                    cy={18}
                    r={14}
                    fill="rgba(255,255,255,0.08)"
                    stroke="#8f758d"
                    strokeWidth={2}
                />
                <text
                    x={30}
                    y={22}
                    textAnchor="middle"
                    fill="#fff7f2"
                    fontSize={11}
                    fontFamily="monospace"
                >
                    q
                </text>
            </svg>
        )
    if (type === 'double-circle')
        return (
            <svg {...svgProps}>
                <circle
                    cx={30}
                    cy={18}
                    r={14}
                    fill="rgba(102,217,184,0.16)"
                    stroke="#66d9b8"
                    strokeWidth={2}
                />
                <circle
                    cx={30}
                    cy={18}
                    r={9}
                    fill="none"
                    stroke="#66d9b8"
                    strokeWidth={1.5}
                />
            </svg>
        )
    if (type === 'arrow-in')
        return (
            <svg {...svgProps}>
                <line
                    x1={5}
                    y1={18}
                    x2={42}
                    y2={18}
                    stroke="#ffd166"
                    strokeWidth={2}
                />
                <polygon points="42,14 50,18 42,22" fill="#ffd166" />
            </svg>
        )
    if (type === 'arrow')
        return (
            <svg {...svgProps}>
                <line
                    x1={5}
                    y1={18}
                    x2={45}
                    y2={18}
                    stroke="#b195a4"
                    strokeWidth={2}
                />
                <polygon points="45,14 53,18 45,22" fill="#b195a4" />
                <text
                    x={29}
                    y={14}
                    textAnchor="middle"
                    fill="#ffd5c8"
                    fontSize={10}
                    fontFamily="monospace"
                >
                    a
                </text>
            </svg>
        )
    if (type === 'self-loop')
        return (
            <svg {...svgProps}>
                <path
                    d="M18,18 C18,2 42,2 42,18"
                    fill="none"
                    stroke="#ffb26b"
                    strokeWidth={1.8}
                />
                <polygon points="42,14 42,22 36,18" fill="#ffb26b" />
                <text
                    x={30}
                    y={10}
                    textAnchor="middle"
                    fill="#ffd5c8"
                    fontSize={10}
                    fontFamily="monospace"
                >
                    a
                </text>
            </svg>
        )
    if (type === 'label')
        return (
            <svg {...svgProps}>
                <line
                    x1={5}
                    y1={22}
                    x2={50}
                    y2={22}
                    stroke="#b195a4"
                    strokeWidth={1.5}
                />
                <text
                    x={27}
                    y={16}
                    textAnchor="middle"
                    fill="#ffd5c8"
                    fontSize={12}
                    fontFamily="monospace"
                    fontWeight="bold"
                >
                    b
                </text>
            </svg>
        )
    return null
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const glassStrong = {
    background: 'rgba(255,255,255,0.11)',
    border: '1px solid rgba(255,255,255,0.26)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    boxShadow: '0 20px 46px rgba(16,8,14,0.3)',
}

const glassSoft = {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.22)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
}

const thStyle = {
    background: 'rgba(255,122,89,0.16)',
    color: '#ffbca8',
    padding: '10px 16px',
    border: '1px solid rgba(255,255,255,0.24)',
    fontSize: 13,
}
const tdStyle = {
    border: '1px solid rgba(255,255,255,0.24)',
    padding: '9px 16px',
    textAlign: 'center',
}
const inputStyle = {
    flex: 1,
    minWidth: 120,
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.24)',
    borderRadius: 10,
    color: '#fff7f2',
    fontFamily: 'monospace',
    fontSize: 15,
    padding: '10px 14px',
    outline: 'none',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
}
const btnStyle = (disabled) => ({
    background: disabled ? 'rgba(255,255,255,0.24)' : '#ff7a59',
    color: disabled ? '#9d8598' : '#fff',
    border: '1px solid rgba(255,255,255,0.24)',
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 14,
    padding: '10px 22px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: disabled
        ? 'none'
        : '0 8px 24px rgba(255,122,89,0.32), inset 0 1px 0 rgba(255,255,255,0.2)',
})

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
    const [page, setPage] = useState('tutorial') // "tutorial" | "soal-0" | "soal-1" | "soal-2"
    const [theoryIdx, setTheoryIdx] = useState(0)
    const [soalTab, setSoalTab] = useState('diagram') // "diagram" | "tabel" | "uji"

    const activeDFA = page.startsWith('soal-')
        ? DFAS[parseInt(page.split('-')[1])]
        : null

    return (
        <div
            style={{
                fontFamily: 'DM Sans, sans-serif',
                background:
                    'radial-gradient(circle at 10% -10%, rgba(255,122,89,0.24), transparent 44%), radial-gradient(circle at 100% 0%, rgba(255,111,145,0.2), transparent 38%), radial-gradient(circle at 50% 110%, rgba(126,200,255,0.22), transparent 46%), linear-gradient(145deg, #1d0f19 0%, #261626 52%, #1a2b30 100%)',
                minHeight: '100vh',
                color: '#fff7f2',
            }}
        >
            {/* Google Fonts */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;600;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: radial-gradient(circle at 10% -10%, rgba(255,122,89,0.24), transparent 44%), radial-gradient(circle at 100% 0%, rgba(255,111,145,0.2), transparent 38%), radial-gradient(circle at 50% 110%, rgba(126,200,255,0.22), transparent 46%), linear-gradient(145deg, #1d0f19 0%, #261626 52%, #1a2b30 100%); background-attachment: fixed; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: rgba(255,255,255,0.08); } ::-webkit-scrollbar-thumb { background: #9b7d95; border-radius: 3px; }
        input:focus { border-color: #ff7a59 !important; }
      `}</style>

            {/* Top Nav */}
            <nav
                style={{
                    borderBottom: '1px solid rgba(255,255,255,0.24)',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0,
                    overflowX: 'auto',
                    background: 'rgba(33,18,28,0.72)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    boxShadow: '0 10px 30px rgba(12,7,14,0.35)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                }}
            >
                <div
                    style={{
                        fontWeight: 800,
                        fontSize: 15,
                        color: '#ff7a59',
                        paddingRight: 24,
                        borderRight: '1px solid rgba(255,255,255,0.24)',
                        marginRight: 16,
                        whiteSpace: 'nowrap',
                        padding: '16px 24px 16px 0',
                    }}
                >
                    FSA Lab
                </div>
                {[
                    { id: 'tutorial', label: '📚 Tutorial' },
                    { id: 'soal-0', label: 'Soal 1' },
                    { id: 'soal-1', label: 'Soal 2' },
                    { id: 'soal-2', label: 'Soal 3' },
                ].map((n) => (
                    <button
                        key={n.id}
                        onClick={() => {
                            setPage(n.id)
                            setSoalTab('diagram')
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: '16px 18px',
                            cursor: 'pointer',
                            fontSize: 14,
                            fontWeight: page === n.id ? 700 : 400,
                            color: page === n.id ? '#ff7a59' : '#d2aea8',
                            borderBottom: `2px solid ${page === n.id ? '#ff7a59' : 'transparent'}`,
                            whiteSpace: 'nowrap',
                            fontFamily: 'DM Sans, sans-serif',
                            transition: 'all 0.2s',
                        }}
                    >
                        {n.label}
                    </button>
                ))}
            </nav>

            <div
                style={{
                    maxWidth: 900,
                    margin: '0 auto',
                    padding: '32px 20px 60px',
                }}
            >
                {/* ── TUTORIAL PAGE ── */}
                {page === 'tutorial' && (
                    <div>
                        {/* Hero */}
                        <div style={{ textAlign: 'center', marginBottom: 48 }}>
                            <div
                                style={{
                                    display: 'inline-block',
                                    background: 'rgba(255,122,89,0.16)',
                                    border: '1px solid rgba(255,122,89,0.38)',
                                    color: '#ffbca8',
                                    fontSize: 11,
                                    letterSpacing: 2,
                                    padding: '4px 16px',
                                    borderRadius: 20,
                                    marginBottom: 14,
                                    fontFamily: 'monospace',
                                }}
                            >
                                TEORI BAHASA & AUTOMATA
                            </div>
                            <h1
                                style={{
                                    fontSize: 'clamp(28px,6vw,46px)',
                                    fontWeight: 800,
                                    background:
                                        'linear-gradient(135deg,#fff 30%,#ff7a59)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    lineHeight: 1.15,
                                    marginBottom: 12,
                                }}
                            >
                                Finite State Automata
                                <br />— Belajar Cepat dengan Simulasi
                            </h1>
                            <p
                                style={{
                                    color: '#d2aea8',
                                    fontSize: 15,
                                    lineHeight: 1.7,
                                    maxWidth: 540,
                                    margin: '0 auto 28px',
                                }}
                            >
                                Ringkasan teori yang simple dan visual untuk
                                mahasiswa, plus simulasi interaktif agar konsep
                                lebih cepat dipahami.
                            </p>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: 10,
                                    justifyContent: 'center',
                                    flexWrap: 'wrap',
                                }}
                            >
                                {[
                                    ['🤖 Apa itu FSA?', 0],
                                    ['⚙️ Komponen', 1],
                                    ['🔵 Diagram', 2],
                                    ['📊 Tabel', 3],
                                    ['⚖️ DFA vs NFA', 4],
                                    ['▶️ Cara Kerja', 5],
                                ].map(([label, idx]) => (
                                    <button
                                        key={idx}
                                        onClick={() => setTheoryIdx(idx)}
                                        style={{
                                            background:
                                                theoryIdx === idx
                                                    ? '#ff7a59'
                                                    : 'rgba(255,255,255,0.08)',
                                            border: `1px solid ${theoryIdx === idx ? '#ff7a59' : 'rgba(255,255,255,0.24)'}`,
                                            color:
                                                theoryIdx === idx
                                                    ? '#fff'
                                                    : '#e8c6bd',
                                            padding: '8px 16px',
                                            borderRadius: 10,
                                            cursor: 'pointer',
                                            fontSize: 13,
                                            fontWeight: 600,
                                            fontFamily: 'DM Sans, sans-serif',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Theory content */}
                        <div
                            style={{
                                ...glassStrong,
                                borderRadius: 16,
                                padding: '28px 30px',
                            }}
                        >
                            <TheorySection section={THEORY[theoryIdx]} />
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: 24,
                                    paddingTop: 20,
                                    borderTop: '1px solid rgba(255,255,255,0.24)',
                                }}
                            >
                                <button
                                    onClick={() =>
                                        setTheoryIdx((i) => Math.max(0, i - 1))
                                    }
                                    disabled={theoryIdx === 0}
                                    style={{
                                        ...btnStyle(theoryIdx === 0),
                                        background:
                                            theoryIdx === 0
                                                ? 'rgba(255,255,255,0.08)'
                                                : 'rgba(255,255,255,0.24)',
                                        color:
                                            theoryIdx === 0
                                                ? '#8f758d'
                                                : '#e8c6bd',
                                    }}
                                >
                                    ← Sebelumnya
                                </button>
                                <span
                                    style={{
                                        color: '#8f758d',
                                        fontSize: 13,
                                        alignSelf: 'center',
                                        fontFamily: 'monospace',
                                    }}
                                >
                                    {theoryIdx + 1} / {THEORY.length}
                                </span>
                                {theoryIdx < THEORY.length - 1 ? (
                                    <button
                                        onClick={() =>
                                            setTheoryIdx((i) => i + 1)
                                        }
                                        style={btnStyle(false)}
                                    >
                                        Selanjutnya →
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setPage('soal-0')}
                                        style={btnStyle(false)}
                                    >
                                        🚀 Ke Simulasi →
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Quick nav cards */}
                        <div style={{ marginTop: 32 }}>
                            <div
                                style={{
                                    fontSize: 13,
                                    color: '#8f758d',
                                    fontFamily: 'monospace',
                                    letterSpacing: 1,
                                    marginBottom: 16,
                                    textTransform: 'uppercase',
                                }}
                            >
                                Langsung ke Soal:
                            </div>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns:
                                        'repeat(auto-fit,minmax(240px,1fr))',
                                    gap: 14,
                                }}
                            >
                                {DFAS.map((d) => (
                                    <div
                                        key={d.id}
                                        onClick={() => {
                                            setPage(`soal-${d.id}`)
                                            setSoalTab('diagram')
                                        }}
                                        style={{
                                            ...glassStrong,
                                            borderRadius: 14,
                                            padding: '18px 20px',
                                            cursor: 'pointer',
                                            transition:
                                                'border-color 0.2s, transform 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            (e.currentTarget.style.borderColor =
                                                '#ff7a59')
                                            e.currentTarget.style.transform =
                                                'translateY(-2px)'
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget.style.borderColor =
                                                'rgba(255,255,255,0.24)')
                                            e.currentTarget.style.transform =
                                                'translateY(0)'
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 11,
                                                color: '#ff7a59',
                                                fontFamily: 'monospace',
                                                letterSpacing: 1,
                                                marginBottom: 6,
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            {d.soal}
                                        </div>
                                        <div
                                            style={{
                                                fontWeight: 700,
                                                color: '#fff7f2',
                                                fontSize: 15,
                                                marginBottom: 6,
                                            }}
                                        >
                                            {d.title}
                                        </div>
                                        <div
                                            style={{
                                                color: '#d2aea8',
                                                fontSize: 12,
                                            }}
                                        >
                                            Q={`{${d.states.join(',')}}`}{' '}
                                            &nbsp;Σ=
                                            {`{${d.alphabet.join(',')}}`}
                                        </div>
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
                            <div
                                style={{
                                    fontSize: 11,
                                    color: '#ff7a59',
                                    fontFamily: 'monospace',
                                    letterSpacing: 2,
                                    marginBottom: 8,
                                    textTransform: 'uppercase',
                                }}
                            >
                                {activeDFA.soal}
                            </div>
                            <h1
                                style={{
                                    fontSize: 26,
                                    fontWeight: 800,
                                    color: '#fff7f2',
                                    marginBottom: 6,
                                }}
                            >
                                {activeDFA.title}
                            </h1>
                            <p
                                style={{
                                    color: '#d2aea8',
                                    fontSize: 14,
                                    marginBottom: 16,
                                }}
                            >
                                {activeDFA.task}
                            </p>
                            {/* Spec chips */}
                            <div
                                style={{
                                    display: 'flex',
                                    gap: 10,
                                    flexWrap: 'wrap',
                                }}
                            >
                                {[
                                    [
                                        'Q (States)',
                                        `{${activeDFA.states.join(',')}}`,
                                    ],
                                    [
                                        'Σ (Alfabet)',
                                        `{${activeDFA.alphabet.join(',')}}`,
                                    ],
                                    [
                                        'S (Start)',
                                        activeDFA.states[activeDFA.start],
                                    ],
                                    [
                                        'F (Final)',
                                        `{${activeDFA.finals.map((f) => activeDFA.states[f]).join(',')}}`,
                                    ],
                                ].map(([label, val]) => (
                                    <div
                                        key={label}
                                        style={{
                                            ...glassSoft,
                                            borderRadius: 10,
                                            padding: '8px 14px',
                                            fontFamily: 'monospace',
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 10,
                                                color: '#8f758d',
                                                marginBottom: 2,
                                            }}
                                        >
                                            {label}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 13,
                                                color: '#ffe9e2',
                                                fontWeight: 700,
                                            }}
                                        >
                                            {val}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sub tabs */}
                        <div
                            style={{
                                display: 'flex',
                                gap: 8,
                                marginBottom: 20,
                            }}
                        >
                            {[
                                ['diagram', '🔵 Diagram'],
                                ['tabel', '📊 Tabel Transisi'],
                                ['uji', '🧪 Uji String'],
                            ].map(([id, label]) => (
                                <button
                                    key={id}
                                    onClick={() => setSoalTab(id)}
                                    style={{
                                        background:
                                            soalTab === id
                                                ? '#ff7a59'
                                                : 'rgba(255,255,255,0.08)',
                                        border: `1px solid ${soalTab === id ? '#ff7a59' : 'rgba(255,255,255,0.24)'}`,
                                        color:
                                            soalTab === id ? '#fff' : '#d2aea8',
                                        padding: '9px 18px',
                                        borderRadius: 10,
                                        cursor: 'pointer',
                                        fontSize: 13,
                                        fontWeight: 700,
                                        fontFamily: 'DM Sans, sans-serif',
                                    }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div
                            style={{
                                ...glassStrong,
                                borderRadius: 16,
                                padding: '24px',
                            }}
                        >
                            {soalTab === 'diagram' && (
                                <div>
                                    <div
                                        style={{
                                            fontSize: 13,
                                            color: '#8f758d',
                                            fontFamily: 'monospace',
                                            letterSpacing: 1,
                                            marginBottom: 16,
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        Diagram Transisi
                                    </div>
                                    <FSACanvas dfa={activeDFA} />
                                    <div
                                        style={{
                                            marginTop: 16,
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 16,
                                        }}
                                    >
                                        {[
                                            ['State Awal (S)', '#ffd166'],
                                            ['Final State (F)', '#66d9b8'],
                                            ['Start + Final', '#7ec8ff'],
                                            ['State Biasa', '#8f758d'],
                                        ].map(([l, c]) => (
                                            <div
                                                key={l}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 7,
                                                    fontSize: 12,
                                                    color: '#d2aea8',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: 12,
                                                        height: 12,
                                                        borderRadius: '50%',
                                                        border: `2px solid ${c}`,
                                                        background:
                                                            c === '#8f758d'
                                                                ? 'transparent'
                                                                : `${c}20`,
                                                    }}
                                                />
                                                {l}
                                            </div>
                                        ))}
                                    </div>
                                    {/* Fungsi transisi daftar */}
                                    <div
                                        style={{
                                            marginTop: 24,
                                            ...glassSoft,
                                            borderRadius: 12,
                                            padding: '16px 20px',
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 11,
                                                color: '#8f758d',
                                                fontFamily: 'monospace',
                                                letterSpacing: 1,
                                                marginBottom: 12,
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            Fungsi Transisi δ:
                                        </div>
                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns:
                                                    'repeat(auto-fill,minmax(190px,1fr))',
                                                gap: 8,
                                            }}
                                        >
                                            {activeDFA.states.map((s, i) =>
                                                activeDFA.alphabet.map(
                                                    (sym) => (
                                                        <code
                                                            key={`${i}-${sym}`}
                                                            style={{
                                                                background:
                                                                    'rgba(255,255,255,0.08)',
                                                                border: '1px solid rgba(255,255,255,0.24)',
                                                                borderRadius: 8,
                                                                padding:
                                                                    '5px 12px',
                                                                fontSize: 12,
                                                                color: '#ffd5c8',
                                                                fontFamily:
                                                                    'monospace',
                                                            }}
                                                        >
                                                            δ({s},{sym}) ={' '}
                                                            {
                                                                activeDFA
                                                                    .states[
                                                                    activeDFA
                                                                        .delta[
                                                                        i
                                                                    ][sym]
                                                                ]
                                                            }
                                                        </code>
                                                    ),
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {soalTab === 'tabel' && (
                                <div>
                                    <div
                                        style={{
                                            fontSize: 13,
                                            color: '#8f758d',
                                            fontFamily: 'monospace',
                                            letterSpacing: 1,
                                            marginBottom: 16,
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        Tabel Transisi (δ)
                                    </div>
                                    <TransitionTable dfa={activeDFA} />
                                    <div
                                        style={{
                                            marginTop: 24,
                                            ...glassSoft,
                                            borderRadius: 12,
                                            padding: '16px 20px',
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 12,
                                                color: '#8f758d',
                                                fontFamily: 'monospace',
                                                letterSpacing: 1,
                                                marginBottom: 10,
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            Cara Membaca Tabel:
                                        </div>
                                        <div
                                            style={{
                                                color: '#e8c6bd',
                                                fontSize: 13,
                                                lineHeight: 1.9,
                                            }}
                                        >
                                            • Baris = state asal &nbsp;|&nbsp;
                                            Kolom = simbol input &nbsp;|&nbsp;
                                            Isi sel = state tujuan
                                            <br />• Tanda{' '}
                                            <span style={{ color: '#ffd166' }}>
                                                →
                                            </span>{' '}
                                            di depan state menunjukkan initial
                                            state
                                            <br />• Tanda{' '}
                                            <span style={{ color: '#66d9b8' }}>
                                                *
                                            </span>{' '}
                                            di depan state menunjukkan
                                            final/accepting state
                                            <br />• Contoh membaca: baris q₀,
                                            kolom '{activeDFA.alphabet[0]}' →
                                            state tujuan adalah{' '}
                                            {
                                                activeDFA.states[
                                                    activeDFA.delta[0][
                                                        activeDFA.alphabet[0]
                                                    ]
                                                ]
                                            }
                                        </div>
                                    </div>
                                </div>
                            )}

                            {soalTab === 'uji' && (
                                <div>
                                    <div
                                        style={{
                                            fontSize: 13,
                                            color: '#8f758d',
                                            fontFamily: 'monospace',
                                            letterSpacing: 1,
                                            marginBottom: 8,
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        Uji String Input
                                    </div>
                                    <p
                                        style={{
                                            color: '#d2aea8',
                                            fontSize: 13,
                                            lineHeight: 1.7,
                                            marginBottom: 20,
                                        }}
                                    >
                                        Masukkan string dari alfabet{' '}
                                        {`{${activeDFA.alphabet.join(',')}}`}{' '}
                                        untuk diuji apakah diterima atau ditolak
                                        oleh DFA ini. Animasi akan menunjukkan
                                        jalur eksekusi langkah per langkah.
                                    </p>
                                    <StringTester dfa={activeDFA} />
                                    <div
                                        style={{
                                            marginTop: 24,
                                            ...glassSoft,
                                            borderRadius: 12,
                                            padding: '16px 20px',
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 11,
                                                color: '#8f758d',
                                                fontFamily: 'monospace',
                                                letterSpacing: 1,
                                                marginBottom: 10,
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            💡 Penjelasan DFA ini:
                                        </div>
                                        <p
                                            style={{
                                                color: '#e8c6bd',
                                                fontSize: 13,
                                                lineHeight: 1.8,
                                            }}
                                        >
                                            {activeDFA.explanation}
                                        </p>
                                        <div style={{ marginTop: 12 }}>
                                            <div
                                                style={{
                                                    fontSize: 11,
                                                    color: '#8f758d',
                                                    fontFamily: 'monospace',
                                                    marginBottom: 8,
                                                }}
                                            >
                                                Contoh string untuk dicoba:
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    gap: 8,
                                                    flexWrap: 'wrap',
                                                }}
                                            >
                                                {activeDFA.id === 0 &&
                                                    [
                                                        '00',
                                                        '11',
                                                        '0011',
                                                        '1010',
                                                        '101',
                                                        '0110',
                                                    ].map((s) => (
                                                        <ExampleChip
                                                            key={s}
                                                            str={s}
                                                        />
                                                    ))}
                                                {activeDFA.id === 1 &&
                                                    [
                                                        'ab',
                                                        'ba',
                                                        'abab',
                                                        'a',
                                                        'b',
                                                        'aab',
                                                    ].map((s) => (
                                                        <ExampleChip
                                                            key={s}
                                                            str={s}
                                                        />
                                                    ))}
                                                {activeDFA.id === 2 &&
                                                    [
                                                        'a',
                                                        'b',
                                                        'bb',
                                                        'bbb',
                                                        'ab',
                                                        'abb',
                                                        'abbb',
                                                    ].map((s) => (
                                                        <ExampleChip
                                                            key={s}
                                                            str={s}
                                                        />
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Nav between soals */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: 20,
                            }}
                        >
                            <button
                                onClick={() => setPage('tutorial')}
                                style={{
                                    ...btnStyle(false),
                                    background: 'rgba(255,255,255,0.08)',
                                    color: '#d2aea8',
                                }}
                            >
                                ← Tutorial
                            </button>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {activeDFA.id > 0 && (
                                    <button
                                        onClick={() =>
                                            setPage(`soal-${activeDFA.id - 1}`)
                                        }
                                        style={{
                                            ...btnStyle(false),
                                            background: 'rgba(255,255,255,0.24)',
                                            color: '#e8c6bd',
                                        }}
                                    >
                                        ← {DFAS[activeDFA.id - 1].soal}
                                    </button>
                                )}
                                {activeDFA.id < 2 && (
                                    <button
                                        onClick={() =>
                                            setPage(`soal-${activeDFA.id + 1}`)
                                        }
                                        style={btnStyle(false)}
                                    >
                                        {DFAS[activeDFA.id + 1].soal} →
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function ExampleChip({ str }) {
    return (
        <span
            style={{
                background: 'rgba(255,122,89,0.16)',
                border: '1px solid rgba(255,122,89,0.28)',
                borderRadius: 8,
                padding: '4px 12px',
                fontSize: 13,
                color: '#ffd5c8',
                fontFamily: 'monospace',
                cursor: 'default',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
            }}
        >
            "{str}"
        </span>
    )
}




