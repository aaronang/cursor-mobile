import type { App } from "../App"
import type { Wallpaper } from "./WallpaperPicker"

interface AppLauncherProps {
  apps: App[]
  onAppOpen: (appId: string) => void
  currentWallpaper: Wallpaper
}

export function AppLauncher({ apps, onAppOpen, currentWallpaper }: AppLauncherProps) {
  // Determine label color based on wallpaper brightness
  const getLabelColor = (wallpaperId: string) => {
    const lightWallpapers = ['stone-50', 'stone-100', 'stone-200', 'stone-300']
    return lightWallpapers.includes(wallpaperId) ? 'text-stone-800' : 'text-stone-100'
  }

  return (
    <div className={`min-h-screen p-4 ${currentWallpaper.className}`}>
      {/* App Grid */}
      <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto pt-12">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => onAppOpen(app.id)}
            className="group flex flex-col items-center space-y-3"
          >
            <div className="w-16 h-16 bg-stone-900 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow border border-stone-50/15">
              {app.icon}
            </div>
            <span className={`text-xs font-medium text-center leading-tight transition-colors ${getLabelColor(currentWallpaper.id)}`}>
              {app.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}