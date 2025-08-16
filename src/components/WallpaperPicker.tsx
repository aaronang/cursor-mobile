import { X } from "lucide-react"

export type Wallpaper = {
  id: string
  name: string
  className: string
  preview: string
}

interface WallpaperPickerProps {
  isOpen: boolean
  onClose: () => void
  onWallpaperChange: (wallpaper: Wallpaper) => void
  currentWallpaper: Wallpaper
}

export function WallpaperPicker({ isOpen, onClose, onWallpaperChange, currentWallpaper }: WallpaperPickerProps) {
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <h2 className="text-lg font-semibold text-stone-800">Change Wallpaper</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        {/* Wallpaper Grid */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-2 gap-3">
            {wallpapers.map((wallpaper) => (
              <button
                key={wallpaper.id}
                onClick={() => {
                  onWallpaperChange(wallpaper)
                  onClose()
                }}
                className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                  currentWallpaper.id === wallpaper.id
                    ? 'border-stone-900 ring-2 ring-stone-400'
                    : 'border-stone-200 hover:border-stone-400'
                }`}
              >
                <div className={`w-full h-20 ${wallpaper.preview} flex items-center justify-center`}>
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
      </div>
    </div>
  )
}