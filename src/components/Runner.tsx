import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Pause } from "lucide-react"

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
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [playerX, setPlayerX] = useState(200)
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [gameSpeed, setGameSpeed] = useState(3)
  const [obstacleSpawnRate, setObstacleSpawnRate] = useState(0)

  const PLAYER_WIDTH = 30
  const PLAYER_HEIGHT = 30
  const CANVAS_WIDTH = 400
  const CANVAS_HEIGHT = 600

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!canvas || !ctx) return

    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
  }, [])

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return

    setScore(prev => prev + 1)
    setObstacleSpawnRate(prev => prev + 1)

    // Move obstacles up
    setObstacles(prev => 
      prev
        .map(obs => ({ ...obs, y: obs.y - gameSpeed }))
        .filter(obs => obs.y + obs.height > 0)
    )

    // Spawn new obstacles
    if (obstacleSpawnRate > 50) {
      const newObstacle: Obstacle = {
        x: Math.random() * (CANVAS_WIDTH - 60),
        y: CANVAS_HEIGHT,
        width: 60,
        height: 20,
        type: Math.random() > 0.7 ? 'large' : Math.random() > 0.5 ? 'medium' : 'small'
      }
      setObstacles(prev => [...prev, newObstacle])
      setObstacleSpawnRate(0)
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
  }, [gameState, score, obstacles, playerX, gameSpeed, obstacleSpawnRate])

  // Handle player movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setPlayerX(prev => Math.max(0, prev - 20))
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          setPlayerX(prev => Math.min(CANVAS_WIDTH - PLAYER_WIDTH, prev + 20))
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
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
    setPlayerX(200)
    setObstacles([])
    setGameSpeed(3)
    setObstacleSpawnRate(0)
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
  }, [playerX, obstacles, score, highScore])

  const renderMenu = () => (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-stone-800 mb-4">Runner</h2>
      <p className="text-stone-600 mb-6">Dodge obstacles and run as far as you can!</p>
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
  )

  const renderGameOver = () => (
    <div className="text-center">
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
          Play Again
        </button>
        <button
          onClick={() => setGameState('menu')}
          className="block w-full px-8 py-3 bg-stone-200 text-stone-800 text-lg font-medium rounded-lg hover:bg-stone-300 transition-colors"
        >
          Main Menu
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-stone-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Game Canvas */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 mb-4">
          <canvas
            ref={canvasRef}
            onTouchStart={handleTouch}
            className="w-full border border-stone-200 rounded-lg cursor-pointer"
            style={{ height: CANVAS_HEIGHT * 0.8 }}
          />
        </div>

        {/* Game Controls */}
        {gameState === 'playing' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-stone-600">Score: {score}</span>
              <button
                onClick={pauseGame}
                className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-stone-50 font-medium rounded-lg hover:bg-stone-800 active:bg-stone-700 transition-colors shadow-sm"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
            </div>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 mb-4">
            <div className="text-center">
              <p className="text-stone-600 mb-3">Game Paused</p>
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

        {/* Game Content */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
          {gameState === 'menu' && renderMenu()}
          {gameState === 'gameOver' && renderGameOver()}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-stone-600 text-sm">
          <p>• Use A/D or Arrow Keys to move</p>
          <p>• Tap left/right on mobile</p>
          <p>• Dodge obstacles and survive!</p>
        </div>
      </div>
    </div>
  )
}