import type { App } from "../App"

interface AppLauncherProps {
  apps: App[]
  onAppOpen: (appId: string) => void
}

export function AppLauncher({ apps, onAppOpen }: AppLauncherProps) {
  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="text-center mb-8 pt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">App Launcher</h1>
        <p className="text-gray-600">Tap an app to open</p>
      </div>

      {/* App Grid */}
      <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => onAppOpen(app.id)}
            className="group flex flex-col items-center space-y-3 p-4 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <div className={`w-16 h-16 ${app.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow`}>
              {app.icon}
            </div>
            <span className="text-sm font-medium text-gray-700 text-center leading-tight">
              {app.name}
            </span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-gray-500 text-sm">
        <p>More apps coming soon!</p>
      </div>
    </div>
  )
}