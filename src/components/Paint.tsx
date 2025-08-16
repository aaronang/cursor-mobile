import { useState, useRef, useEffect } from "react"
import { RotateCcw, Palette, Minus, Plus, Settings } from "lucide-react"

export function Paint() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentColor, setCurrentColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(5)
  const [isErasing, setIsErasing] = useState(false)
  const [showTools, setShowTools] = useState(false)

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

    // Set canvas size to fit the available space
    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        const rect = container.getBoundingClientRect()
        canvas.width = rect.width
        canvas.height = rect.height
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let clientX: number, clientY: number

    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0]
      clientX = touch.clientX
      clientY = touch.clientY
    } else {
      // Mouse event
      clientX = e.clientX
      clientY = e.clientY
    }

    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

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

  const toggleTools = () => {
    setShowTools(!showTools)
  }

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Paint</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleTools}
            className="p-2 rounded-lg hover:bg-stone-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={clearCanvas}
            className="px-3 py-2 bg-stone-700 rounded-lg hover:bg-stone-600 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      {/* Tools Panel - Slides down when active */}
      {showTools && (
        <div className="bg-stone-100 border-b border-stone-200 p-4">
          <div className="max-w-md mx-auto space-y-4">
            {/* Color Palette */}
            <div>
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
            <div>
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
        </div>
      )}

      {/* Canvas - Takes remaining space */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          className="w-full h-full cursor-crosshair touch-none"
        />
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-stone-100 border-t border-stone-200 p-2 text-center text-sm text-stone-600">
        {isErasing ? 'Eraser Mode' : `Drawing with ${currentColor} - Size: ${brushSize}px`}
      </div>
    </div>
  )
}