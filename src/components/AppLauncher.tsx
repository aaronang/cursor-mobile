import type { App } from "../App"
import type { Wallpaper } from "./WallpaperPicker"
import { Palette } from "lucide-react"
import { useState } from "react"
import { WallpaperPicker } from "./WallpaperPicker"

interface AppLauncherProps {
  apps: App[]
  onAppOpen: (appId: string) => void
  currentWallpaper: Wallpaper
  onWallpaperChange: (wallpaper: Wallpaper) => void
}

export function AppLauncher({ apps, onAppOpen, currentWallpaper, onWallpaperChange }: AppLauncherProps) {
  const [isWallpaperPickerOpen, setIsWallpaperPickerOpen] = useState(false)

  return (
    <div className={`min-h-screen p-4 ${currentWallpaper.className}`}>
      {/* Wallpaper Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setIsWallpaperPickerOpen(true)}
          className="p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all shadow-sm"
        >
          <Palette className="w-5 h-5 text-stone-800" />
        </button>
      </div>

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
            <span className="text-xs font-medium text-gray-700 text-center leading-tight">
              {app.name}
            </span>
          </button>
        ))}
      </div>

      {/* Wallpaper Picker */}
      <WallpaperPicker
        isOpen={isWallpaperPickerOpen}
        onClose={() => setIsWallpaperPickerOpen(false)}
        onWallpaperChange={onWallpaperChange}
        currentWallpaper={currentWallpaper}
      />
    </div>
  )
}