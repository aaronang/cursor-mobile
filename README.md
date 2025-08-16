# App Launcher

A mobile-friendly app launcher built with React, TypeScript, and Tailwind CSS. Similar to iOS and Android home screens, this launcher provides a clean interface for organizing and launching apps.

## Features

- **Mobile-First Design**: Optimized for touch devices with responsive layout
- **App Grid**: Clean, organized grid layout for app icons
- **Tic Tac Toe Game**: Built-in game as the first app
- **Touch-Friendly**: Proper touch interactions and mobile optimizations
- **Modern UI**: Beautiful design with smooth animations and transitions

## Apps Included

### Tic Tac Toe
- Classic 3x3 grid game
- Two-player gameplay (X and O)
- Win detection and draw handling
- Reset functionality
- Mobile-optimized touch controls

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production
Build the app for production:
```bash
npm run build
```

### Preview Production Build
Preview the production build:
```bash
npm run preview
```

## Mobile Features

- **Touch Optimized**: All buttons and interactions are designed for touch devices
- **Responsive Design**: Adapts to different screen sizes
- **Mobile Meta Tags**: Proper viewport and PWA meta tags
- **Touch-Friendly Sizing**: Minimum 44px touch targets
- **Smooth Animations**: Optimized for mobile performance

## Adding New Apps

To add new apps to the launcher:

1. Create a new component in `src/components/`
2. Add the app to the `apps` array in `src/App.tsx`
3. Include:
   - `id`: Unique identifier
   - `name`: Display name
   - `icon`: React component for the icon
   - `color`: Tailwind CSS color class
   - `component`: The React component to render

Example:
```typescript
{
  id: "calculator",
  name: "Calculator",
  icon: <Calculator className="w-8 h-8" />,
  color: "bg-green-500",
  component: Calculator
}
```

## Technology Stack

- **React 19**: Latest React with modern features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and dev server
- **Lucide React**: Beautiful icon library
- **shadcn/ui**: High-quality UI components

## Browser Support

- Modern browsers with ES6+ support
- Mobile browsers (iOS Safari, Chrome Mobile, etc.)
- Touch-enabled devices recommended

## License

This project is open source and available under the MIT License.
