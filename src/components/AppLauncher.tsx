import type { App } from "../App"

interface AppLauncherProps {
  apps: App[]
  onAppOpen: (appId: string) => void
}

export function AppLauncher({ apps, onAppOpen }: AppLauncherProps) {
  return (
    <div className="min-h-screen p-4 bg-stone-50">
      {/* App Grid */}
      <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto pt-20">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => onAppOpen(app.id)}
            className="group flex flex-col items-center space-y-3"
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
    </div>
  )
}