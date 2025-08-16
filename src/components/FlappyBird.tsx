import { useState, useEffect, useRef, useCallback } from "react"
import { Play, RotateCcw } from "lucide-react"

type Bird = {
  y: number
  velocity: number
}

type Pipe = {
  x: number
  topHeight: number
  bottomY: number
  passed: boolean
}

const FlappyBird = () => {
  const [gameState, setGameState] = useState<'instructions' | 'playing' | 'gameOver'>('instructions')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [bird, setBird] = useState<Bird>({ y: 300, velocity: 0 })
  const [pipes, setPipes] = useState<Pipe[]>([])
  const [gameSpeed, setGameSpeed] = useState(3)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number | undefined>(undefined)
  const lastTimeRef = useRef<number | undefined>(undefined)

  const GRAVITY = 0.5
  const FLAP_STRENGTH = -8
  const PIPE_WIDTH = 60
  const BIRD_SIZE = 20

  const startGame = () => {
    setGameState('playing')
    setScore(0)
    setBird({ y: 300, velocity: 0 })
    setPipes([])
    setGameSpeed(3)
  }

  const flap = () => {
    if (gameState === 'playing') {
      setBird(prev => ({ ...prev, velocity: FLAP_STRENGTH }))
    }
  }

  const gameOver = () => {
    setGameState('gameOver')
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current)
    }
    if (score > highScore) {
      setHighScore(score)
    }
  }

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return

    // Update bird
    setBird(prev => {
      const newVelocity = prev.velocity + GRAVITY
      const newY = prev.y + newVelocity
      
      // Check if bird hits ground or ceiling
      if (newY <= 0 || newY >= 600) {
        gameOver()
        return prev
      }
      
      return { y: newY, velocity: newVelocity }
    })

    // Update pipes
    setPipes(prev => {
      const newPipes = prev
        .map(pipe => ({ ...pipe, x: pipe.x - gameSpeed }))
        .filter(pipe => pipe.x > -PIPE_WIDTH)

      // Spawn new pipes every 2 seconds
      if (Math.random() < 0.02) { // 2% chance per frame at 60fps ≈ every 2 seconds
        const newPipe: Pipe = {
          x: 800,
          topHeight: Math.random() * 200 + 100,
          bottomY: Math.random() * 200 + 350,
          passed: false
        }
        newPipes.push(newPipe)
      }

      return newPipes
    })

    // Check collisions
    setPipes(prev => {
      return prev.map(pipe => {
        // Check if bird passed pipe
        if (!pipe.passed && pipe.x + PIPE_WIDTH < 200) {
          setScore(s => s + 1)
          return { ...pipe, passed: true }
        }

        // Check collision with pipe
        if (200 < pipe.x + PIPE_WIDTH && 200 + BIRD_SIZE > pipe.x) {
          if (bird.y < pipe.topHeight || bird.y + BIRD_SIZE > pipe.bottomY) {
            gameOver()
          }
        }

        return pipe
      })
    })

    // Increase difficulty
    setGameSpeed(prev => Math.min(prev + 0.001, 8))
  }, [gameState, bird.y])

  // Game loop
  useEffect(() => {
    if (gameState === 'playing') {
      const gameLoop = (currentTime: number) => {
        if (lastTimeRef.current !== undefined) {
          updateGame()
        }
        lastTimeRef.current = currentTime
        gameLoopRef.current = requestAnimationFrame(gameLoop)
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState, updateGame])

  // Handle input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        flap()
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      flap()
    }

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      flap()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('mousedown', handleMouseDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#fafaf9' // stone-50
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (gameState === 'playing') {
      // Draw bird emoji
      ctx.font = '24px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('🐦', 200 + BIRD_SIZE/2, bird.y + BIRD_SIZE/2)

      // Draw pipes
      ctx.fillStyle = '#78716c' // stone-500
      pipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight)
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, 600 - pipe.bottomY)
        
        // Pipe caps
        ctx.fillStyle = '#57534e' // stone-600
        ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, PIPE_WIDTH + 10, 20)
        ctx.fillRect(pipe.x - 5, pipe.bottomY, PIPE_WIDTH + 10, 20)
        ctx.fillStyle = '#78716c' // stone-500
      })

      // Draw score
      ctx.fillStyle = '#44403c' // stone-700
      ctx.font = '48px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(score.toString(), canvas.width / 2, 100)
    }
  }, [gameState, bird.y, pipes, score])

  const renderInstructions = () => (
    <div className="fixed inset-0 bg-stone-50 flex items-center justify-center p-4 z-50">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-stone-800 mb-6">Flappy Bird</h1>
        <div className="space-y-4 text-stone-600 mb-8">
          <p>Tap or press Space to flap!</p>
          <p>Avoid the pipes and try to get the highest score.</p>
        </div>
        <button
          onClick={startGame}
          className="px-8 py-4 bg-stone-900 text-stone-50 text-xl font-medium rounded-lg hover:bg-stone-800 active:bg-stone-700 transition-colors shadow-lg"
        >
          <Play className="w-6 h-6 inline mr-2" />
          Start Game
        </button>
      </div>
    </div>
  )

  const renderGameOver = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-stone-800 mb-4">Game Over!</h2>
        <p className="text-stone-600 mb-2">Final Score: {score}</p>
        {score > highScore && (
          <p className="text-green-600 font-medium mb-4">New High Score! 🎉</p>
        )}
        <div>
          <button
            onClick={startGame}
            className="w-full px-8 py-3 bg-stone-900 text-stone-50 text-lg font-medium rounded-lg hover:bg-stone-800 active:bg-stone-700 transition-colors shadow-lg"
          >
            <RotateCcw className="w-5 h-5 inline mr-2" />
            Play Again
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-stone-50">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      
      {gameState === 'instructions' && renderInstructions()}
      {gameState === 'gameOver' && renderGameOver()}
    </div>
  )
}

export default FlappyBird