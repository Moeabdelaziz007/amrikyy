import { OSDesktop } from './components/os/OSDesktop';
import { WallpaperProvider } from './contexts/WallpaperContext';
import './styles/index.css';

function App() {
  return (
    <WallpaperProvider>
      <div className="App">
        <OSDesktop />
      </div>
    </WallpaperProvider>
  );
}

export default App;
