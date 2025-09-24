import ModernDesktop from './components/desktop/ModernDesktop';
import { WallpaperProvider } from './contexts/WallpaperContext';
import './styles/index.css';
import './styles/modern-desktop.css';
import './styles/enhanced-wallpaper.css';
import './styles/ultimate-desktop.css'; // Added for enhanced wallpaper effects

function App() {
  return (
    <WallpaperProvider>
      <div className="App">
        <ModernDesktop />
      </div>
    </WallpaperProvider>
  );
}

export default App;
