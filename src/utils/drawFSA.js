export function drawFSACanvas(canvas, dfa, activeState = null, traceEdge = null) {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width,
        H = canvas.height
    ctx.clearRect(0, 0, W, H)

    // Background
    ctx.fillStyle = '#1a1220'
    ctx.fillRect(0, 0, W, H)

    // Grid dots
    ctx.fillStyle = 'rgba(255,122,89,0.09)'
    for (let x = 20; x < W; x += 30)
        for (let y = 20; y < H; y += 30) {
            ctx.beginPath()
            ctx.arc(x, y, 1, 0, Math.PI * 2)
            ctx.fill()
        }

    const R = 28
    const pos = dfa.nodePos

    // Draw edges
    dfa.states.forEach((_, from) => {
        dfa.alphabet.forEach((sym) => {
            const to = dfa.delta[from][sym]
            const isActive =
                traceEdge && traceEdge.from === from && traceEdge.sym === sym
            if (from === to) {
                drawSelfLoop(ctx, pos[from].x, pos[from].y, sym, R, isActive)
            } else {
                const reverse =
                    dfa.delta[to] && Object.values(dfa.delta[to]).includes(from)
                drawEdge(
                    ctx,
                    pos[from],
                    pos[to],
                    sym,
                    R,
                    reverse ? 16 : 0,
                    isActive,
                )
            }
        })
    })

    // Draw nodes
    dfa.states.forEach((name, i) => {
        const isStart = i === dfa.start
        const isFinal = dfa.finals.includes(i)
        const isActive = activeState === i
        drawNode(ctx, pos[i].x, pos[i].y, name, isStart, isFinal, isActive, R)
    })
}

function drawNode(ctx, cx, cy, label, isStart, isFinal, isActive, R) {
    if (isActive) {
        ctx.shadowColor = '#ff7a59'
        ctx.shadowBlur = 22
    }

    let fill = 'rgba(255,255,255,0.08)',
        stroke = '#8f758d',
        lw = 2
    if (isFinal && isStart) {
        fill = 'rgba(126,200,255,0.20)'
        stroke = '#7ec8ff'
    } else if (isFinal) {
        fill = 'rgba(102,217,184,0.18)'
        stroke = '#66d9b8'
    } else if (isStart) {
        fill = 'rgba(255,209,102,0.20)'
        stroke = '#ffd166'
    }
    if (isActive) {
        fill = 'rgba(255,122,89,0.34)'
        stroke = '#ff9a80'
        lw = 2.5
    }

    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, Math.PI * 2)
    ctx.fillStyle = fill
    ctx.fill()
    ctx.strokeStyle = stroke
    ctx.lineWidth = lw
    ctx.stroke()
    ctx.shadowBlur = 0

    if (isFinal) {
        ctx.beginPath()
        ctx.arc(cx, cy, R - 5, 0, Math.PI * 2)
        ctx.strokeStyle = stroke
        ctx.lineWidth = 1.5
        ctx.stroke()
    }

    ctx.fillStyle = '#fff7f2'
    ctx.font = `bold 13px monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, cx, cy)
    ctx.textBaseline = 'alphabetic'

    if (isStart) {
        ctx.strokeStyle = '#ffd166'
        ctx.fillStyle = '#ffd166'
        ctx.lineWidth = 1.8
        ctx.beginPath()
        ctx.moveTo(cx - R - 28, cy)
        ctx.lineTo(cx - R - 2, cy)
        ctx.stroke()
        arrowHead(ctx, cx - R - 1, cy, 0, '#ffd166')
    }
}

function drawEdge(ctx, p1, p2, label, R, offset, isActive) {
    const col = isActive ? '#ffd166' : offset ? '#ffb26b' : '#b195a4'
    ctx.strokeStyle = col
    ctx.fillStyle = col
    ctx.lineWidth = isActive ? 2.5 : 1.6

    const dx = p2.x - p1.x,
        dy = p2.y - p1.y
    const len = Math.sqrt(dx * dx + dy * dy)
    const ux = dx / len,
        uy = dy / len
    const ox = offset ? -uy * offset : 0,
        oy = offset ? ux * offset : 0

    const sx = p1.x + ux * R + ox,
        sy = p1.y + uy * R + oy
    const ex = p2.x - ux * R + ox,
        ey = p2.y - uy * R + oy

    ctx.beginPath()
    ctx.moveTo(sx, sy)
    if (offset) {
        const mx = (sx + ex) / 2 + ox * 1.8,
            my = (sy + ey) / 2 + oy * 1.8
        ctx.quadraticCurveTo(mx, my, ex, ey)
        ctx.stroke()
        arrowHead(ctx, ex, ey, Math.atan2(ey - my, ex - mx), col)
        ctx.fillStyle = isActive ? '#ffd166' : '#ffd5c8'
        ctx.font = `bold 12px monospace`
        ctx.textAlign = 'center'
        ctx.fillText(label, mx, my - 9)
    } else {
        ctx.lineTo(ex, ey)
        ctx.stroke()
        arrowHead(ctx, ex, ey, Math.atan2(dy, dx), col)
        const lx = (sx + ex) / 2 - uy * 14,
            ly = (sy + ey) / 2 + ux * 14
        ctx.fillStyle = isActive ? '#ffd166' : '#ffd5c8'
        ctx.font = `bold 12px monospace`
        ctx.textAlign = 'center'
        ctx.fillText(label, lx, ly)
    }
}

function drawSelfLoop(ctx, cx, cy, label, R, isActive) {
    const col = isActive ? '#ffd166' : '#ffb26b'
    ctx.strokeStyle = col
    ctx.lineWidth = isActive ? 2.5 : 1.6
    ctx.beginPath()
    ctx.moveTo(cx - 14, cy - R + 4)
    ctx.bezierCurveTo(
        cx - 14,
        cy - R - 46,
        cx + 14,
        cy - R - 46,
        cx + 14,
        cy - R + 4,
    )
    ctx.stroke()
    arrowHead(ctx, cx + 14, cy - R + 3, Math.PI * 0.3, col)
    ctx.fillStyle = isActive ? '#ffd166' : '#ffd5c8'
    ctx.font = `bold 12px monospace`
    ctx.textAlign = 'center'
    ctx.fillText(label, cx, cy - R - 32)
}

function arrowHead(ctx, x, y, angle, color) {
    const s = 7
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(-s, -s / 2)
    ctx.lineTo(-s, s / 2)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
}
