import { AINotesApp } from "../apps/AINotesApp";
import { AITravelApp } from "../apps/AITravelApp";
import { AIChatbotApp } from "../apps/AIChatbotApp";
import { AICalculatorApp } from "../apps/AICalculatorApp";
import { AIWeatherApp } from "../apps/AIWeatherApp";
import { SettingsApp } from "../apps/SettingsApp";
import { AppWindow } from "./AppWindow";

interface WindowManagerProps {
  openApps: string[];
  activeApp: string | null;
  onClose: (appId: string) => void;
  onMinimize: (appId: string) => void;
  onFocus: (appId: string) => void;
}

const appComponents = {
  "ai-notes": AINotesApp,
  "ai-travel": AITravelApp,
  "ai-chatbot": AIChatbotApp,
  "ai-calculator": AICalculatorApp,
  "ai-weather": AIWeatherApp,
  "settings": SettingsApp,
};

const appTitles = {
  "ai-notes": "AI Notes",
  "ai-travel": "AI Travel Agency",
  "ai-chatbot": "AI Assistant",
  "ai-calculator": "AI Calculator",
  "ai-weather": "AI Weather",
  "settings": "System Settings",
};

export const WindowManager = ({ 
  openApps, 
  activeApp, 
  onClose, 
  onMinimize, 
  onFocus 
}: WindowManagerProps) => {
  return (
    <div className="absolute inset-0">
      {openApps.map((appId, index) => {
        const AppComponent = appComponents[appId as keyof typeof appComponents];
        const isActive = activeApp === appId;
        
        if (!AppComponent) return null;
        
        return (
          <AppWindow
            key={appId}
            appId={appId}
            title={appTitles[appId as keyof typeof appTitles]}
            isActive={isActive}
            onClose={() => onClose(appId)}
            onMinimize={() => onMinimize(appId)}
            onFocus={() => onFocus(appId)}
            style={{
              zIndex: isActive ? 40 : 30 - index,
              transform: `translate(${index * 30}px, ${index * 30}px)`
            }}
          >
            <AppComponent />
          </AppWindow>
        );
      })}
    </div>
  );
};
