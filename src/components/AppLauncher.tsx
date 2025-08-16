import type { App } from "../App"
import type { Wallpaper } from "./WallpaperPicker"

interface AppLauncherProps {
  apps: App[]
  onAppOpen: (appId: string) => void
  currentWallpaper: Wallpaper
  currentLayout: 'grid' | 'list'
}

export function AppLauncher({ apps, onAppOpen, currentWallpaper, currentLayout }: AppLauncherProps) {
  // Determine label color based on wallpaper brightness
  const getLabelColor = (wallpaperId: string) => {
    const lightWallpapers = ['stone-50', 'stone-100', 'stone-200', 'stone-300']
    return lightWallpapers.includes(wallpaperId) ? 'text-stone-800' : 'text-stone-100'
  }

  const renderGridLayout = () => (
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
  )

  const renderListLayout = () => (
    <div className="max-w-sm mx-auto pt-12 space-y-3">
      {apps.map((app) => (
        <button
          key={app.id}
          onClick={() => onAppOpen(app.id)}
          className="w-full flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all border border-white/30 hover:bg-white/90"
        >
          <div className="w-12 h-12 bg-stone-900 rounded-xl flex items-center justify-center shadow-sm border border-stone-50/15">
            {app.icon}
          </div>
          <span className={`text-sm font-medium transition-colors ${getLabelColor(currentWallpaper.id)}`}>
            {app.name}
          </span>
        </button>
      ))}
    </div>
  )

  return (
    <div className={`min-h-screen p-4 ${currentWallpaper.className}`}>
      {currentLayout === 'grid' ? renderGridLayout() : renderListLayout()}
    </div>
  )
}