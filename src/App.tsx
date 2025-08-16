import { useState, useRef } from "react"
import { AppLauncher } from "./components/AppLauncher"
import { TicTacToe } from "./components/TicTacToe"
import { Sudoku } from "./components/Sudoku"
import { X, Grid3X3 } from "lucide-react"

export type App = {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  component: React.ComponentType
}

function App() {
  const [currentApp, setCurrentApp] = useState<string | null>(null)
  const [isSwiping, setIsSwiping] = useState(false)
  const [swipeStart, setSwipeStart] = useState<number | null>(null)
  const appContainerRef = useRef<HTMLDivElement>(null)

  const apps: App[] = [
    {
      id: "tictactoe",
      name: "Tic Tac Toe",
      icon: <X className="w-8 h-8 text-stone-50" />,
      color: "bg-blue-500",
      component: TicTacToe
    },
    {
      id: "sudoku",
      name: "Sudoku",
      icon: <Grid3X3 className="w-8 h-8 text-stone-50" />,
      color: "bg-blue-500",
      component: Sudoku
    }
  ]

  const handleAppOpen = (appId: string) => {
    setCurrentApp(appId)
  }

  const handleAppClose = () => {
    setCurrentApp(null)
  }

  // Touch event handlers for swipe-to-go-back
  const handleTouchStart = (e: React.TouchEvent) => {
    setSwipeStart(e.touches[0].clientX)
    setIsSwiping(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (swipeStart === null) return
    
    const currentX = e.touches[0].clientX
    const diff = currentX - swipeStart
    
    // If swiping right (back gesture), show visual feedback
    if (diff > 50) {
      setIsSwiping(true)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (swipeStart === null) return
    
    const currentX = e.changedTouches[0].clientX
    const diff = currentX - swipeStart
    
    // If swiped right more than 100px, go back
    if (diff > 100) {
      handleAppClose()
    }
    
    setSwipeStart(null)
    setIsSwiping(false)
  }

  if (currentApp) {
    const app = apps.find(a => a.id === currentApp)
    if (app) {
      const AppComponent = app.component
      return (
        <div 
          ref={appContainerRef}
          className={`fixed inset-0 z-50 bg-white transition-transform duration-300 ${
            isSwiping ? 'translate-x-8' : 'translate-x-0'
          }`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AppComponent />
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen">
      <AppLauncher apps={apps} onAppOpen={handleAppOpen} />
    </div>
  )
}

export default App
