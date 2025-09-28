import React, { useState } from 'react';
import { useUserSettings } from '../../contexts/UserSettingsContext';

// File Manager App
export const FileManagerApp: React.FC = () => {
  const [files, setFiles] = useState([
    { name: 'Documents', type: 'folder', size: '2.3 GB', modified: '2024-01-15' },
    { name: 'Pictures', type: 'folder', size: '1.8 GB', modified: '2024-01-14' },
    { name: 'Videos', type: 'folder', size: '5.2 GB', modified: '2024-01-13' },
    { name: 'project.aios', type: 'file', size: '45 MB', modified: '2024-01-12' },
    { name: 'settings.json', type: 'file', size: '2 KB', modified: '2024-01-11' },
  ]);

  return (
    <div className="file-manager">
      <div className="file-manager-header">
        <h2>📁 File Manager</h2>
        <div className="file-actions">
          <button className="action-btn">📁 New Folder</button>
          <button className="action-btn">📄 New File</button>
          <button className="action-btn">📤 Upload</button>
        </div>
      </div>
      
      <div className="file-grid">
        {files.map((file, index) => (
          <div key={index} className="file-item">
            <div className="file-icon">
              {file.type === 'folder' ? '📁' : '📄'}
            </div>
            <div className="file-info">
              <div className="file-name">{file.name}</div>
              <div className="file-details">
                <span className="file-size">{file.size}</span>
                <span className="file-date">{file.modified}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Weather App
export const WeatherApp: React.FC = () => {
  const [weather, setWeather] = useState({
    location: 'New York',
    temperature: 72,
    condition: 'Sunny',
    humidity: 65,
    wind: 12,
    forecast: [
      { day: 'Today', high: 75, low: 60, condition: 'Sunny' },
      { day: 'Tomorrow', high: 78, low: 62, condition: 'Partly Cloudy' },
      { day: 'Wednesday', high: 73, low: 58, condition: 'Rainy' },
    ]
  });

  return (
    <div className="weather-app">
      <div className="weather-header">
        <h2>🌤️ Weather</h2>
        <div className="location">{weather.location}</div>
      </div>
      
      <div className="current-weather">
        <div className="temperature">{weather.temperature}°F</div>
        <div className="condition">{weather.condition}</div>
        <div className="weather-details">
          <div className="detail">
            <span className="label">Humidity</span>
            <span className="value">{weather.humidity}%</span>
          </div>
          <div className="detail">
            <span className="label">Wind</span>
            <span className="value">{weather.wind} mph</span>
          </div>
        </div>
      </div>
      
      <div className="forecast">
        <h3>5-Day Forecast</h3>
        <div className="forecast-list">
          {weather.forecast.map((day, index) => (
            <div key={index} className="forecast-item">
              <div className="day">{day.day}</div>
              <div className="temps">
                <span className="high">{day.high}°</span>
                <span className="low">{day.low}°</span>
              </div>
              <div className="condition">{day.condition}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Settings App
export const SettingsApp: React.FC = () => {
  const { settings, updateSetting, updateWidget } = useUserSettings();
  const [activeTab, setActiveTab] = useState('appearance');

  const tabs = [
    { id: 'appearance', name: 'Appearance', icon: '🎨' },
    { id: 'behavior', name: 'Behavior', icon: '⚙️' },
    { id: 'widgets', name: 'Widgets', icon: '📊' },
    { id: 'shortcuts', name: 'Shortcuts', icon: '⌨️' },
  ];

  return (
    <div className="settings-app">
      <div className="settings-header">
        <h2>⚙️ Settings</h2>
      </div>
      
      <div className="settings-content">
        <div className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-name">{tab.name}</span>
            </button>
          ))}
        </div>
        
        <div className="settings-panel">
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h3>Appearance</h3>
              <div className="setting-item">
                <label>Theme</label>
                <select aria-label="Select option" 
                  value={settings.theme} 
                  onChange={(e) => updateSetting('theme', e.target.value)}
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div className="setting-item">
                <label>Desktop Layout</label>
                <select aria-label="Select option" 
                  value={settings.desktopLayout} 
                  onChange={(e) => updateSetting('desktopLayout', e.target.value)}
                >
                  <option value="grid">Grid</option>
                  <option value="list">List</option>
                  <option value="compact">Compact</option>
                </select>
              </div>
              <div className="setting-item">
                <label>
                  <input 
                    type="checkbox" 
                    checked={settings.animations}
                    onChange={(e) => updateSetting('animations', e.target.checked)}
                  />
                  Enable Animations
                </label>
              </div>
            </div>
          )}
          
          {activeTab === 'behavior' && (
            <div className="settings-section">
              <h3>Behavior</h3>
              <div className="setting-item">
                <label>
                  <input 
                    type="checkbox" 
                    checked={settings.soundEffects}
                    onChange={(e) => updateSetting('soundEffects', e.target.checked)}
                  />
                  Sound Effects
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input 
                    type="checkbox" 
                    checked={settings.notifications}
                    onChange={(e) => updateSetting('notifications', e.target.checked)}
                  />
                  Notifications
                </label>
              </div>
            </div>
          )}
          
          {activeTab === 'widgets' && (
            <div className="settings-section">
              <h3>Widgets</h3>
              {Object.entries(settings.widgets).map(([widget, enabled]) => (
                <div key={widget} className="setting-item">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={enabled}
                      onChange={(e) => updateWidget(widget as keyof typeof settings.widgets, e.target.checked)}
                    />
                    {widget.charAt(0).toUpperCase() + widget.slice(1)} Widget
                  </label>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'shortcuts' && (
            <div className="settings-section">
              <h3>Keyboard Shortcuts</h3>
              <div className="shortcuts-list">
                {Object.entries(settings.shortcuts).map(([key, appId]) => (
                  <div key={key} className="shortcut-item">
                    <span className="shortcut-key">{key}</span>
                    <span className="shortcut-app">{appId}</span>
                    <button className="remove-shortcut">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Calendar App
export const CalendarApp: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([
    { id: 1, title: 'Team Meeting', date: '2024-01-15', time: '10:00 AM', type: 'meeting' },
    { id: 2, title: 'Project Deadline', date: '2024-01-18', time: '5:00 PM', type: 'deadline' },
    { id: 3, title: 'Lunch with Client', date: '2024-01-20', time: '12:00 PM', type: 'appointment' },
  ]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  return (
    <div className="calendar-app">
      <div className="calendar-header">
        <h2>📅 Calendar</h2>
        <div className="calendar-nav">
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
            ←
          </button>
          <span className="current-month">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
            →
          </button>
        </div>
      </div>
      
      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        
        <div className="calendar-days">
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty"></div>
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dayEvents = events.filter(event => 
              new Date(event.date).getDate() === day
            );
            return (
              <div key={day} className="calendar-day">
                <span className="day-number">{day}</span>
                {dayEvents.map(event => (
                  <div key={event.id} className={`event ${event.type}`}>
                    {event.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="upcoming-events">
        <h3>Upcoming Events</h3>
        {events.slice(0, 3).map(event => (
          <div key={event.id} className="event-item">
            <div className="event-time">{event.time}</div>
            <div className="event-title">{event.title}</div>
            <div className="event-date">{event.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Notes App
export const NotesApp: React.FC = () => {
  const [notes, setNotes] = useState([
    { id: 1, title: 'Meeting Notes', content: 'Discuss project timeline and deliverables...', created: '2024-01-15' },
    { id: 2, title: 'Ideas', content: 'New feature ideas for the AIOS system...', created: '2024-01-14' },
    { id: 3, title: 'Todo List', content: '1. Fix authentication bug\n2. Add new widgets\n3. Test performance', created: '2024-01-13' },
  ]);
  const [selectedNote, setSelectedNote] = useState(notes[0]);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="notes-app">
      <div className="notes-header">
        <h2>📝 Notes</h2>
        <div className="notes-actions">
          <button className="action-btn" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Save' : 'Edit'}
          </button>
          <button className="action-btn">New Note</button>
        </div>
      </div>
      
      <div className="notes-content">
        <div className="notes-sidebar">
          {notes.map(note => (
            <div 
              key={note.id} 
              className={`note-item ${selectedNote?.id === note.id ? 'active' : ''}`}
              onClick={() => setSelectedNote(note)}
            >
              <div className="note-title">{note.title}</div>
              <div className="note-preview">{note.content.substring(0, 50)}...</div>
              <div className="note-date">{note.created}</div>
            </div>
          ))}
        </div>
        
        <div className="notes-editor">
          {selectedNote && (
            <>
              <input 
                type="text" 
                className="note-title-input"
                value={selectedNote.title}
                readOnly={!isEditing}
                onChange={(e) => setSelectedNote({...selectedNote, title: e.target.value})}
                aria-label="Note title"
                placeholder="Enter note title"
              />
              <textarea aria-label="Text area" 
                className="note-content-input"
                value={selectedNote.content}
                readOnly={!isEditing}
                onChange={(e) => setSelectedNote({...selectedNote, content: e.target.value})}
                rows={20}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
