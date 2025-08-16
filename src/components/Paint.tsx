import { useState, useRef, useEffect } from "react"
import { RotateCcw, Palette, Minus, Plus } from "lucide-react"

export function Paint() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentColor, setCurrentColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(5)
  const [isErasing, setIsErasing] = useState(false)

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#008000', '#FFC0CB', '#A52A2A', '#808080', '#FFD700'
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Set initial background
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.strokeStyle = isErasing ? '#FFFFFF' : currentColor

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const toggleEraser = () => {
    setIsErasing(!isErasing)
  }

  return (
    <div className="min-h-screen bg-stone-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Paint</h2>
          <p className="text-stone-600">Draw and create on your canvas</p>
        </div>

        {/* Tools */}
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-stone-800">Tools</h3>
            <button
              onClick={clearCanvas}
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-stone-50 font-medium rounded-lg hover:bg-stone-800 active:bg-stone-700 transition-colors shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Clear
            </button>
          </div>

          {/* Color Palette */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-4 h-4 text-stone-600" />
              <span className="text-sm font-medium text-stone-700">Colors</span>
            </div>
            <div className="grid grid-cols-15 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setCurrentColor(color)
                    setIsErasing(false)
                  }}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    currentColor === color && !isErasing
                      ? 'border-stone-900 ring-2 ring-stone-400'
                      : 'border-stone-200 hover:border-stone-400'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Brush Size */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-stone-700">Brush Size</span>
              <span className="text-sm text-stone-500">{brushSize}px</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setBrushSize(Math.max(1, brushSize - 1))}
                className="w-8 h-8 bg-stone-200 rounded-lg flex items-center justify-center hover:bg-stone-300 transition-colors"
              >
                <Minus className="w-4 h-4 text-stone-600" />
              </button>
              <div className="w-32 h-2 bg-stone-200 rounded-full">
                <div 
                  className="h-full bg-stone-900 rounded-full transition-all"
                  style={{ width: `${(brushSize / 20) * 100}%` }}
                />
              </div>
              <button
                onClick={() => setBrushSize(Math.min(20, brushSize + 1))}
                className="w-8 h-8 bg-stone-200 rounded-lg flex items-center justify-center hover:bg-stone-300 transition-colors"
              >
                <Plus className="w-4 h-4 text-stone-600" />
              </button>
            </div>
          </div>

          {/* Eraser Toggle */}
          <div>
            <button
              onClick={toggleEraser}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                isErasing
                  ? 'bg-stone-900 text-stone-50 border-stone-900'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
              }`}
            >
              {isErasing ? 'Drawing Mode' : 'Eraser Mode'}
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onMouseMove={draw}
            className="w-full h-96 border border-stone-200 rounded-lg cursor-crosshair"
          />
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-stone-600 text-sm">
          <p>• Click and drag to draw</p>
          <p>• Use the eraser to remove drawings</p>
          <p>• Adjust brush size and colors</p>
        </div>
      </div>
    </div>
  )
}