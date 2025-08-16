import type { Wallpaper } from "./WallpaperPicker"

interface SettingsProps {
  currentWallpaper: Wallpaper
  onWallpaperChange: (wallpaper: Wallpaper) => void
}

export function Settings({ currentWallpaper, onWallpaperChange }: SettingsProps) {
  const wallpapers: Wallpaper[] = [
    {
      id: "stone-50",
      name: "Light Stone",
      className: "bg-stone-50",
      preview: "bg-stone-50"
    },
    {
      id: "stone-100",
      name: "Warm Stone",
      className: "bg-stone-100",
      preview: "bg-stone-100"
    },
    {
      id: "stone-200",
      name: "Medium Stone",
      className: "bg-stone-200",
      preview: "bg-stone-200"
    },
    {
      id: "stone-300",
      name: "Dark Stone",
      className: "bg-stone-300",
      preview: "bg-stone-300"
    },
    {
      id: "stone-400",
      name: "Rich Stone",
      className: "bg-stone-400",
      preview: "bg-stone-400"
    },
    {
      id: "stone-500",
      name: "Deep Stone",
      className: "bg-stone-500",
      preview: "bg-stone-500"
    },
    {
      id: "stone-600",
      name: "Charcoal",
      className: "bg-stone-600",
      preview: "bg-stone-600"
    },
    {
      id: "stone-700",
      name: "Dark Charcoal",
      className: "bg-stone-700",
      preview: "bg-stone-700"
    },
    {
      id: "stone-800",
      name: "Deep Charcoal",
      className: "bg-stone-800",
      preview: "bg-stone-800"
    },
    {
      id: "stone-900",
      name: "Black Stone",
      className: "bg-stone-900",
      preview: "bg-stone-900"
    }
  ]

  return (
    <div className="min-h-screen bg-stone-50 overflow-y-auto">
      <div className="max-w-sm mx-auto p-4 pt-8">
        {/* Wallpaper Section */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-stone-200">
          <h3 className="text-lg font-semibold text-stone-800 mb-4">Wallpaper</h3>
          <p className="text-sm text-stone-600 mb-4">Choose your preferred background color</p>
          
          <div className="grid grid-cols-2 gap-3">
            {wallpapers.map((wallpaper) => (
              <button
                key={wallpaper.id}
                onClick={() => onWallpaperChange(wallpaper)}
                className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                  currentWallpaper.id === wallpaper.id
                    ? 'border-stone-900 ring-2 ring-stone-400'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className={`w-full h-16 ${wallpaper.preview} flex items-center justify-center`}>
                  <span className={`text-sm font-medium ${
                    ['stone-50', 'stone-100', 'stone-200', 'stone-300'].includes(wallpaper.id)
                      ? 'text-stone-800'
                      : 'text-stone-100'
                  }`}>
                    {wallpaper.name}
                  </span>
                </div>
                {currentWallpaper.id === wallpaper.id && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-stone-900 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Current Selection Display */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
          <h3 className="text-lg font-semibold text-stone-800 mb-4">Current Theme</h3>
          <div className={`w-full h-20 ${currentWallpaper.preview} rounded-lg flex items-center justify-center border border-stone-200`}>
            <span className={`text-lg font-medium ${
              ['stone-50', 'stone-100', 'stone-200', 'stone-300'].includes(currentWallpaper.id)
                ? 'text-stone-800'
                : 'text-stone-100'
            }`}>
              {currentWallpaper.name}
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-stone-600 text-sm">
          <p className="mb-2">Settings will be saved automatically</p>
          <p>Changes apply immediately to your app launcher</p>
        </div>
      </div>
    </div>
  )
}