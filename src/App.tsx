import { useState } from "react"
import { AppLauncher } from "./components/AppLauncher"
import { TicTacToe } from "./components/TicTacToe"
import { X } from "lucide-react"

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
      icon: <X className="w-8 h-8" />,
      color: "bg-blue-500",
      component: TicTacToe
    }
  ]

  const handleAppOpen = (appId: string) => {
    setCurrentApp(appId)
  }

  const handleAppClose = () => {
    setCurrentApp(null)
  }

  if (currentApp) {
    const app = apps.find(a => a.id === currentApp)
    if (app) {
      const AppComponent = app.component
      return (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-lg font-semibold">{app.name}</h1>
            <button
              onClick={handleAppClose}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            <AppComponent />
          </div>
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
