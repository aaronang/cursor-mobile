import { useState, useEffect } from "react"
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

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      const appId = path.substring(1) // Remove leading slash
      
      if (appId && apps.find(a => a.id === appId)) {
        setCurrentApp(appId)
      } else {
        setCurrentApp(null)
      }
    }

    // Check initial URL on load
    const path = window.location.pathname
    const appId = path.substring(1)
    if (appId && apps.find(a => a.id === appId)) {
      setCurrentApp(appId)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [apps])

  const handleAppOpen = (appId: string) => {
    setCurrentApp(appId)
    // Update URL without adding to history (replace current entry)
    window.history.pushState({ app: appId }, '', `/${appId}`)
  }

  if (currentApp) {
    const app = apps.find(a => a.id === currentApp)
    if (app) {
      const AppComponent = app.component
      return (
        <div className="fixed inset-0 z-50 bg-white">
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
