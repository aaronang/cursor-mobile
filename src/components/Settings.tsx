import { useState } from "react"
import type { Wallpaper } from "./WallpaperPicker"
import { ChevronRight, Palette, Grid3X3, List } from "lucide-react"

interface SettingsProps {
  currentWallpaper: Wallpaper
  onWallpaperChange: (wallpaper: Wallpaper) => void
  currentLayout: 'grid' | 'list'
  onLayoutChange: (layout: 'grid' | 'list') => void
}

export function Settings({ currentWallpaper, onWallpaperChange, currentLayout, onLayoutChange }: SettingsProps) {
  const [currentSection, setCurrentSection] = useState<'main' | 'appearance' | 'versions'>('main')

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

  const layouts = [
    {
      id: 'grid',
      name: 'Grid Layout',
      description: 'Apps displayed in a grid format',
      icon: <Grid3X3 className="w-5 h-5" />,
      preview: 'grid grid-cols-3 gap-4'
    },
    {
      id: 'list',
      name: 'List Layout',
      description: 'Apps displayed in a list format',
      icon: <List className="w-5 h-5" />,
      preview: 'flex flex-col space-y-3'
    }
  ]

  const renderMainSettings = () => (
    <div className="space-y-1">
      <button
        onClick={() => setCurrentSection('appearance')}
        className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-stone-200 rounded-lg flex items-center justify-center">
            <Palette className="w-4 h-4 text-stone-600" />
          </div>
          <div className="text-left">
            <div className="font-medium text-stone-800">Appearance</div>
            <div className="text-sm text-stone-500">Theme and visual settings</div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-stone-400" />
      </button>

      <button
        onClick={() => setCurrentSection('versions')}
        className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-stone-200 rounded-lg flex items-center justify-center">
            <Grid3X3 className="w-4 h-4 text-stone-600" />
          </div>
          <div className="text-left">
            <div className="font-medium text-stone-800">Versions</div>
            <div className="text-sm text-stone-500">App launcher layout options</div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-stone-400" />
      </button>
    </div>
  )

  const renderAppearance = () => (
    <div className="space-y-4">
      {/* Back Button */}
      <button
        onClick={() => setCurrentSection('main')}
        className="flex items-center space-x-2 text-stone-600 hover:text-stone-800 transition-colors"
      >
        <ChevronRight className="w-5 h-5 rotate-180" />
        <span>Appearance</span>
      </button>

      {/* Wallpaper Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Theme</h3>
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
    </div>
  )

  const renderVersions = () => (
    <div className="space-y-4">
      {/* Back Button */}
      <button
        onClick={() => setCurrentSection('main')}
        className="flex items-center space-x-2 text-stone-600 hover:text-stone-800 transition-colors"
      >
        <ChevronRight className="w-5 h-5 rotate-180" />
        <span>Versions</span>
      </button>

      {/* Layout Options */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Layout Style</h3>
        <p className="text-sm text-stone-600 mb-4">Choose how your apps are displayed</p>
        
        <div className="space-y-3">
          {layouts.map((layout) => (
            <button
              key={layout.id}
              onClick={() => onLayoutChange(layout.id as 'grid' | 'list')}
              className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                currentLayout === layout.id
                  ? 'border-stone-900 bg-stone-50'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-stone-200 rounded-lg flex items-center justify-center">
                  {layout.icon}
                </div>
                <div className="text-left">
                  <div className="font-medium text-stone-800">{layout.name}</div>
                  <div className="text-sm text-stone-500">{layout.description}</div>
                </div>
              </div>
              {currentLayout === layout.id && (
                <div className="w-4 h-4 bg-stone-900 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Preview</h3>
        <div className={`${layouts.find(l => l.id === currentLayout)?.preview} p-4 bg-stone-100 rounded-lg`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-stone-50 rounded"></div>
            </div>
            <span className="text-sm font-medium text-stone-800">Sample App</span>
          </div>
          {currentLayout === 'grid' && (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-stone-50 rounded"></div>
                </div>
                <span className="text-sm font-medium text-stone-800">Sample App</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-stone-50 rounded"></div>
                </div>
                <span className="text-sm font-medium text-stone-800">Sample App</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-stone-50 overflow-y-auto">
      <div className="max-w-sm mx-auto p-4 pt-8">
        {currentSection === 'main' && renderMainSettings()}
        {currentSection === 'appearance' && renderAppearance()}
        {currentSection === 'versions' && renderVersions()}
      </div>
    </div>
  )
}