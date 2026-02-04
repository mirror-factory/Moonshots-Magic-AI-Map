# Animation Reference — Exact Implementation

## Hero Effect (Multi-Layer Blur Stack)

### Blur Layer Template (React + Tailwind)

Each blur layer is an absolutely positioned container with a styled `<p>`:

```tsx
<div
  className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-[{DURATION}ms] ease-out"
  style={{
    transform: active ? "translateY(0)" : "translateY(100%)",
    opacity: active ? 1 : 0,
    transitionDelay: "{DELAY}ms",
  }}
>
  <p
    className={`${oswald.className} text-4xl md:text-5xl font-bold leading-[0.85] text-center`}
    style={{
      color: "{COLOR}",
      filter: "blur({BLUR}px)",
      transform: "scaleY({SCALEY}) translateY({TRANSLATEY}%)",
      opacity: {OPACITY},
    }}
  >
    MOONSHOTS
    <br />& MAGIC
  </p>
</div>
```

### Main Crisp Text

```tsx
<p
  className={`${oswald.className} relative text-4xl md:text-5xl font-bold leading-[0.85] text-center transition-all duration-[600ms] ease-out`}
  style={{
    color: "#ffffff",
    textShadow: active
      ? "0 0 10px rgba(255, 255, 255, 0.5), 0 0 30px rgba(100, 150, 255, 0.4)"
      : "none",
    transform: active ? "translateY(0)" : "translateY(100%)",
    opacity: active ? 1 : 0,
    transitionDelay: "250ms",
  }}
>
  MOONSHOTS
  <br />& MAGIC
</p>
```

### Blue Ambient Glow (appears before text)

```tsx
<div
  className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-[1000ms]"
  style={{
    opacity: active ? 1 : 0,
    transform: active ? "scale(1)" : "scale(0.5)",
  }}
>
  <div
    className="w-[70%] h-[60%]"
    style={{
      background:
        "radial-gradient(ellipse at center, rgba(30, 60, 220, 0.4) 0%, rgba(20, 40, 180, 0.2) 40%, transparent 70%)",
      filter: "blur(50px)",
    }}
  />
</div>
```

## Film Grain (Canvas)

```tsx
function FilmGrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
    }
    resize()

    let animationId: number
    const renderNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 255
        data[i] = noise
        data[i + 1] = noise
        data[i + 2] = noise
        data[i + 3] = Math.random() * 80 + 40 // alpha 40-120
      }
      ctx.putImageData(imageData, 0, 0)
      animationId = requestAnimationFrame(renderNoise)
    }
    renderNoise()

    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-50 mix-blend-overlay"
    />
  )
}
```

## SVG Static Grain Overlay

```tsx
<div
  className="absolute inset-0 pointer-events-none"
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    backgroundSize: "150px 150px",
    opacity: 0.4,
  }}
/>
```

## Pulsing Glow Layers

```tsx
// 3 layers, each with animation
const pulseGlowLayers = [
  { color: "#1830dd", blur: 40, scaleY: 3.5, translateY: 35, delay: "0s" },
  { color: "#2545ee", blur: 25, scaleY: 2.5, translateY: 25, delay: "0.1s" },
  { color: "#3560ff", blur: 12, scaleY: 1.5, translateY: 12, delay: "0.2s" },
]

// Each layer style:
{
  color: layer.color,
  filter: `blur(${layer.blur}px)`,
  transform: `scaleY(${layer.scaleY}) translateY(${layer.translateY}%)`,
  animationName: "pulse-glow",
  animationDuration: "2s",
  animationTimingFunction: "ease-in-out",
  animationIterationCount: "infinite",
  animationDelay: layer.delay,
}
```

## Static Stars

```tsx
{Array.from({ length: 150 }, (_, i) => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() * 2 + 0.5,
  opacity: Math.random() * 0.6 + 0.2,
})).map((star, i) => (
  <div
    key={i}
    className="absolute rounded-full bg-white"
    style={{
      left: star.left,
      top: star.top,
      width: `${star.size}px`,
      height: `${star.size}px`,
      opacity: star.opacity,
    }}
  />
))}
```
