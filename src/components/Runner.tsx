import { useState, useEffect, useRef, useCallback } from "react"
import { Play, RotateCcw, X } from "lucide-react"

type GameObject = {
  x: number
  y: number
  width: number
  height: number
}

type Obstacle = GameObject & {
  type: 'small' | 'medium' | 'large'
}

export function Runner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number | undefined>(undefined)
  const [gameState, setGameState] = useState<'instructions' | 'playing' | 'paused' | 'gameOver'>('instructions')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [playerX, setPlayerX] = useState(200)
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [gameSpeed, setGameSpeed] = useState(3)
  const [obstacleSpawnRate, setObstacleSpawnRate] = useState(0)
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set())

  const PLAYER_WIDTH = 30
  const PLAYER_HEIGHT = 30
  const CANVAS_WIDTH = window.innerWidth
  const CANVAS_HEIGHT = window.innerHeight
  const PLAYER_MOVE_SPEED = 5

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!canvas || !ctx) return

    // Set canvas to full screen
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }, [])

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return

    setScore(prev => prev + 1)
    setObstacleSpawnRate(prev => prev + 1)

    // Move obstacles down
    setObstacles(prev => 
      prev
        .map(obs => ({ ...obs, y: obs.y + gameSpeed }))
        .filter(obs => obs.y < CANVAS_HEIGHT)
    )

    // Spawn new obstacles from top
    if (obstacleSpawnRate > 50) {
      const newObstacle: Obstacle = {
        x: Math.random() * (CANVAS_WIDTH - 60),
        y: -20, // Start above the canvas
        width: 60,
        height: 20,
        type: Math.random() > 0.7 ? 'large' : Math.random() > 0.5 ? 'medium' : 'small'
      }
      setObstacles(prev => [...prev, newObstacle])
      setObstacleSpawnRate(0)
    }

    // Handle continuous player movement
    if (keysPressed.has('ArrowLeft') || keysPressed.has('a') || keysPressed.has('A')) {
      setPlayerX(prev => Math.max(0, prev - PLAYER_MOVE_SPEED))
    }
    if (keysPressed.has('ArrowRight') || keysPressed.has('d') || keysPressed.has('D')) {
      setPlayerX(prev => Math.min(CANVAS_WIDTH - PLAYER_WIDTH, prev + PLAYER_MOVE_SPEED))
    }

    // Check collisions
    const playerBounds = {
      x: playerX,
      y: CANVAS_HEIGHT - PLAYER_HEIGHT - 20,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT
    }

    const collision = obstacles.some(obs => 
      playerBounds.x < obs.x + obs.width &&
      playerBounds.x + playerBounds.width > obs.x &&
      playerBounds.y < obs.y + obs.height &&
      playerBounds.y + playerBounds.height > obs.y
    )

    if (collision) {
      gameOver()
      return
    }

    // Increase game speed over time
    if (score > 0 && score % 500 === 0) {
      setGameSpeed(prev => Math.min(prev + 0.5, 8))
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)
  }, [gameState, score, obstacles, playerX, gameSpeed, obstacleSpawnRate, keysPressed, CANVAS_WIDTH, CANVAS_HEIGHT])

  // Handle player movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return

      const key = e.key.toLowerCase()
      if (['arrowleft', 'arrowright', 'a', 'd'].includes(key)) {
        e.preventDefault()
        setKeysPressed(prev => new Set(prev).add(e.key))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (['arrowleft', 'arrowright', 'a', 'd'].includes(key)) {
        setKeysPressed(prev => {
          const newSet = new Set(prev)
          newSet.delete(e.key)
          return newSet
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [gameState])

  // Touch controls for mobile
  const handleTouch = (e: React.TouchEvent) => {
    if (gameState !== 'playing') return

    const touch = e.touches[0]
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const touchX = touch.clientX - rect.left

    if (touchX < CANVAS_WIDTH / 2) {
      setPlayerX(prev => Math.max(0, prev - 20))
    } else {
      setPlayerX(prev => Math.min(CANVAS_WIDTH - PLAYER_WIDTH, prev + 20))
    }
  }

  const startGame = () => {
    setGameState('playing')
    setScore(0)
    setPlayerX(CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2)
    setObstacles([])
    setGameSpeed(3)
    setObstacleSpawnRate(0)
    setKeysPressed(new Set())
  }

  const pauseGame = () => {
    setGameState('paused')
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current)
    }
  }

  const resumeGame = () => {
    setGameState('playing')
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

  const quitGame = () => {
    setGameState('instructions')
    setScore(0)
    setPlayerX(CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2)
    setObstacles([])
    setGameSpeed(3)
    setObstacleSpawnRate(0)
    setKeysPressed(new Set())
  }

  // Start game loop when playing
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState, gameLoop])

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw background
    ctx.fillStyle = '#87CEEB'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw ground
    ctx.fillStyle = '#8FBC8F'
    ctx.fillRect(0, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 20)

    // Draw player
    ctx.fillStyle = '#FF6B6B'
    ctx.fillRect(playerX, CANVAS_HEIGHT - PLAYER_HEIGHT - 20, PLAYER_WIDTH, PLAYER_HEIGHT)

    // Draw obstacles
    ctx.fillStyle = '#8B4513'
    obstacles.forEach(obs => {
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height)
    })

    // Draw score
    ctx.fillStyle = '#000000'
    ctx.font = '20px Arial'
    ctx.fillText(`Score: ${score}`, 10, 30)
    ctx.fillText(`High Score: ${highScore}`, 10, 60)
  }, [playerX, obstacles, score, highScore, CANVAS_WIDTH, CANVAS_HEIGHT])

  const renderInstructions = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-stone-800 mb-4">Runner</h2>
        <p className="text-stone-600 mb-6">Dodge falling obstacles and survive as long as you can!</p>
        
        <div className="text-left text-sm text-stone-600 mb-6 space-y-2">
          <p>• Hold A/D or Arrow Keys to move continuously</p>
          <p>• Tap left/right on mobile</p>
          <p>• Dodge falling obstacles and survive!</p>
        </div>

        <button
          onClick={startGame}
          className="inline-flex items-center gap-2 px-8 py-3 bg-stone-900 text-stone-50 text-lg font-medium rounded-lg hover:bg-stone-800 active:bg-stone-700 transition-colors shadow-lg"
        >
          <Play className="w-5 h-5" />
          Start Game
        </button>
        
        {highScore > 0 && (
          <p className="mt-4 text-stone-500">High Score: {highScore}</p>
        )}
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
        <div className="space-y-3">
          <button
            onClick={startGame}
            className="block w-full px-8 py-3 bg-stone-900 text-stone-50 text-lg font-medium rounded-lg hover:bg-stone-800 active:bg-stone-700 transition-colors shadow-lg"
          >
            <RotateCcw className="w-5 h-5 inline mr-2" />
            Play Again
          </button>
          <button
            onClick={quitGame}
            className="block w-full px-8 py-3 bg-stone-200 text-stone-800 text-lg font-medium rounded-lg hover:bg-stone-300 transition-colors"
          >
            <X className="w-5 h-5 inline mr-2" />
            Quit
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-stone-50">
      {/* Game Canvas - Full Screen */}
      <canvas
        ref={canvasRef}
        onTouchStart={handleTouch}
        className="w-full h-full cursor-pointer"
      />

      {/* Game Controls - Only show when playing */}
      {gameState === 'playing' && (
        <div className="absolute top-4 right-4">
          <button
            onClick={pauseGame}
            className="px-4 py-2 bg-stone-900 text-stone-50 font-medium rounded-lg hover:bg-stone-800 active:bg-stone-700 transition-colors shadow-lg"
          >
            Pause
          </button>
        </div>
      )}

      {/* Pause Screen */}
      {gameState === 'paused' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">Game Paused</h2>
            <button
              onClick={resumeGame}
              className="inline-flex items-center gap-2 px-6 py-2 bg-stone-900 text-stone-50 font-medium rounded-lg hover:bg-stone-800 active:bg-stone-700 transition-colors shadow-sm"
            >
              <Play className="w-4 h-4" />
              Resume
            </button>
          </div>
        </div>
      )}

      {/* Instructions Screen */}
      {gameState === 'instructions' && renderInstructions()}

      {/* Game Over Dialog */}
      {gameState === 'gameOver' && renderGameOver()}
    </div>
  )
}