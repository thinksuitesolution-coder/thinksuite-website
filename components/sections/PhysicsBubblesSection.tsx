'use client'

import { useEffect, useRef } from 'react'

const skills = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'Python',
  'AI / ML', 'AWS', 'Firebase', 'PostgreSQL', 'MongoDB',
  'GraphQL', 'Docker', 'Figma', 'SEO', 'Analytics',
  'Branding', 'Swift', 'Flutter', 'Redis', 'Kubernetes',
]

const PALETTE = ['#2563eb', '#7c3aed', '#d97706', '#059669', '#0ea5e9', '#ea580c']

export default function PhysicsBubblesSection() {
  const canvasWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = canvasWrapRef.current
    if (!wrap) return

    let engine: any, render: any, runner: any, mouse: any, mouseConstraint: any
    let raf = 0
    let bodies: any[] = []
    let Matter: any

    const W = wrap.clientWidth
    const H = Math.min(600, window.innerHeight * 0.72)

    const init = async () => {
      Matter = await import('matter-js')
      const { Engine, Render, Runner, Bodies, Body, World, Mouse, MouseConstraint: MC, Events } = Matter

      engine = Engine.create({ gravity: { x: 0, y: 0.15 } })
      const world = engine.world

      render = Render.create({
        element: wrap,
        engine,
        options: {
          width: W,
          height: H,
          wireframes: false,
          background: 'transparent',
        },
      })

      // Walls
      const walls = [
        Bodies.rectangle(W / 2, H + 25, W * 2, 50, { isStatic: true, render: { fillStyle: 'transparent' } }),
        Bodies.rectangle(-25,   H / 2, 50, H * 2, { isStatic: true, render: { fillStyle: 'transparent' } }),
        Bodies.rectangle(W + 25, H / 2, 50, H * 2, { isStatic: true, render: { fillStyle: 'transparent' } }),
        Bodies.rectangle(W / 2, -25,   W * 2, 50, { isStatic: true, render: { fillStyle: 'transparent' } }),
      ]
      World.add(world, walls)

      // Bubbles
      bodies = skills.map((skill, i) => {
        const r = 40 + Math.random() * 28
        const x = 80 + Math.random() * (W - 160)
        const y = 80 + Math.random() * (H * 0.6)
        const color = PALETTE[i % PALETTE.length]
        const body = Bodies.circle(x, y, r, {
          restitution: 0.6,
          friction: 0.01,
          frictionAir: 0.018,
          render: {
            fillStyle: color + '22',
            strokeStyle: color,
            lineWidth: 2,
          },
        })
        ;(body as any).label = skill
        ;(body as any).bubbleColor = color
        ;(body as any).bubbleR = r
        Body.setVelocity(body, { x: (Math.random() - 0.5) * 3, y: (Math.random() - 0.5) * 3 })
        return body
      })
      World.add(world, bodies)

      // Mouse
      mouse = Mouse.create(render.canvas)
      mouseConstraint = MC.create(engine, {
        mouse,
        constraint: { stiffness: 0.15, render: { visible: false } },
      })
      World.add(world, mouseConstraint)

      // Draw text on bubbles after render
      Events.on(render, 'afterRender', () => {
        const ctx = render.context as CanvasRenderingContext2D
        bodies.forEach(b => {
          const { x, y } = b.position
          const r = b.bubbleR as number
          const color = b.bubbleColor as string
          const label = b.label as string

          ctx.save()
          ctx.translate(x, y)
          ctx.rotate(b.angle)
          ctx.fillStyle = color
          ctx.font = `600 ${Math.max(10, r * 0.28)}px 'Space Grotesk', sans-serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(label, 0, 0)
          ctx.restore()
        })
      })

      Render.run(render)
      runner = Runner.create()
      Runner.run(runner, engine)
    }

    init()

    return () => {
      if (Matter && render) Matter.Render.stop(render)
      if (Matter && runner) Matter.Runner.stop(runner)
      if (Matter && engine) Matter.Engine.clear(engine)
      if (render?.canvas) render.canvas.remove()
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="pb-section">
      <div className="pb-header">
        <span className="pb-eyebrow">Technologies & Skills</span>
        <h2 className="pb-heading">
          Built with the<br />right tools.
        </h2>
        <p className="pb-subtext">Drag, push and play. Our tech stack in motion.</p>
      </div>
      <div className="pb-canvas-wrap" ref={canvasWrapRef} />
    </section>
  )
}
