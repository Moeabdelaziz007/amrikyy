import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  orderBy
} from 'firebase/firestore';

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  allDay: boolean;
  location: string;
  attendees: string[];
  color: string;
  category: 'work' | 'personal' | 'meeting' | 'reminder' | 'holiday';
  recurring: {
    enabled: boolean;
    pattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
  };
  reminder: {
    enabled: boolean;
    minutes: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface CalendarView {
  type: 'month' | 'week' | 'day' | 'agenda';
  date: Date;
}

export const EnhancedCalendarApp: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>({ type: 'month', date: new Date() });
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Mock events for demonstration
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Weekly team standup and project updates',
      startTime: new Date('2024-01-25T10:00:00'),
      endTime: new Date('2024-01-25T11:00:00'),
      allDay: false,
      location: 'Conference Room A',
      attendees: ['john@example.com', 'jane@example.com'],
      color: '#3B82F6',
      category: 'work',
      recurring: { enabled: true, pattern: 'weekly', interval: 1 },
      reminder: { enabled: true, minutes: 15 },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Doctor Appointment',
      description: 'Annual health checkup',
      startTime: new Date('2024-01-26T14:00:00'),
      endTime: new Date('2024-01-26T15:00:00'),
      allDay: false,
      location: 'Medical Center',
      attendees: [],
      color: '#10B981',
      category: 'personal',
      recurring: { enabled: false, pattern: 'yearly', interval: 1 },
      reminder: { enabled: true, minutes: 30 },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      title: 'Project Deadline',
      description: 'Final submission for Q1 project',
      startTime: new Date('2024-01-30T09:00:00'),
      endTime: new Date('2024-01-30T17:00:00'),
      allDay: true,
      location: 'Office',
      attendees: ['team@example.com'],
      color: '#EF4444',
      category: 'work',
      recurring: { enabled: false, pattern: 'monthly', interval: 1 },
      reminder: { enabled: true, minutes: 60 },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!user) {
      setLoading(false);
      return;
    }

    // Load events from Firestore
    const loadEvents = async () => {
      try {
        // For demo purposes, use mock data
        setEvents(mockEvents);
        setLoading(false);
      } catch (error) {
        console.error('Error loading events:', error);
        setLoading(false);
      }
    };

    loadEvents();
  }, [user]);

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Date[] = [];
    
    // Add previous month's trailing days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }
    
    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    // Add next month's leading days
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push(new Date(year, month + 1, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date): Event[] => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventsForWeek = (startDate: Date): Event[] => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate >= startDate && eventDate <= endDate;
    });
  };

  const getFilteredEvents = (): Event[] => {
    let filtered = events;
    
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(event => event.category === filterCategory);
    }
    
    return filtered.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === view.date.getMonth();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(view.date);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setView({ ...view, date: newDate });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(view.date);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setView({ ...view, date: newDate });
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(view.date);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setView({ ...view, date: newDate });
  };

  const goToToday = () => {
    const today = new Date();
    setView({ ...view, date: today });
    setSelectedDate(today);
  };

  const createNewEvent = () => {
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  const editEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const deleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        // In a real app, this would delete from Firestore
        setEvents(prev => prev.filter(event => event.id !== eventId));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const getCategoryColor = (category: string): string => {
    const colors = {
      work: '#3B82F6',
      personal: '#10B981',
      meeting: '#8B5CF6',
      reminder: '#F59E0B',
      holiday: '#EF4444'
    };
    return colors[category as keyof typeof colors] || '#6B7280';
  };

  const getCategoryIcon = (category: string): string => {
    const icons = {
      work: '💼',
      personal: '👤',
      meeting: '🤝',
      reminder: '⏰',
      holiday: '🎉'
    };
    return icons[category as keyof typeof icons] || '📅';
  };

  if (loading) {
    return (
      <div className="enhanced-calendar-app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="enhanced-calendar-app">
        <div className="auth-required">
          <h2>🔐 Authentication Required</h2>
          <p>Please sign in to access calendar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-calendar-app">
      {/* Header */}
      <div className="calendar-header">
        <div className="header-left">
          <h2>📅 Enhanced Calendar</h2>
          <div className="date-navigation">
            <button 
              className="nav-btn"
              onClick={() => {
                if (view.type === 'month') navigateMonth('prev');
                if (view.type === 'week') navigateWeek('prev');
                if (view.type === 'day') navigateDay('prev');
              }}
            >
              ←
            </button>
            <button className="today-btn" onClick={goToToday}>
              Today
            </button>
            <button 
              className="nav-btn"
              onClick={() => {
                if (view.type === 'month') navigateMonth('next');
                if (view.type === 'week') navigateWeek('next');
                if (view.type === 'day') navigateDay('next');
              }}
            >
              →
            </button>
          </div>
        </div>

        <div className="header-center">
          <div className="current-date">
            {view.type === 'month' && view.date.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
            {view.type === 'week' && `Week of ${formatDate(view.date)}`}
            {view.type === 'day' && formatDate(view.date)}
            {view.type === 'agenda' && 'Agenda View'}
          </div>
        </div>

        <div className="header-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="view-controls">
            <button
              className={`view-btn ${view.type === 'month' ? 'active' : ''}`}
              onClick={() => setView({ type: 'month', date: view.date })}
            >
              Month
            </button>
            <button
              className={`view-btn ${view.type === 'week' ? 'active' : ''}`}
              onClick={() => setView({ type: 'week', date: view.date })}
            >
              Week
            </button>
            <button
              className={`view-btn ${view.type === 'day' ? 'active' : ''}`}
              onClick={() => setView({ type: 'day', date: view.date })}
            >
              Day
            </button>
            <button
              className={`view-btn ${view.type === 'agenda' ? 'active' : ''}`}
              onClick={() => setView({ type: 'agenda', date: view.date })}
            >
              Agenda
            </button>
          </div>

          <button className="create-event-btn" onClick={createNewEvent}>
            + New Event
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="calendar-filters">
        <div className="filter-group">
          <label>Category:</label>
          <select aria-label="Select option"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="meeting">Meeting</option>
            <option value="reminder">Reminder</option>
            <option value="holiday">Holiday</option>
          </select>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="calendar-content">
        {view.type === 'month' && (
          <div className="month-view">
            <div className="weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>
            <div className="days-grid">
              {getDaysInMonth(view.date).map((date, index) => {
                const dayEvents = getEventsForDate(date);
                return (
                  <div
                    key={index}
                    className={`day-cell ${!isCurrentMonth(date) ? 'other-month' : ''} ${isToday(date) ? 'today' : ''}`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="day-number">{date.getDate()}</div>
                    <div className="day-events">
                      {dayEvents.slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          className="event-dot"
                          style={{ backgroundColor: event.color }}
                          title={event.title}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="more-events">+{dayEvents.length - 3}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view.type === 'week' && (
          <div className="week-view">
            <div className="week-header">
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date(view.date);
                date.setDate(view.date.getDate() - view.date.getDay() + i);
                return (
                  <div key={i} className="week-day-header">
                    <div className="week-day-name">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className={`week-day-number ${isToday(date) ? 'today' : ''}`}>
                      {date.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="week-content">
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date(view.date);
                date.setDate(view.date.getDate() - view.date.getDay() + i);
                const dayEvents = getEventsForDate(date);
                return (
                  <div key={i} className="week-day-column">
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        className="week-event"
                        style={{ backgroundColor: event.color }}
                        onClick={() => editEvent(event)}
                      >
                        <div className="event-time">
                          {event.allDay ? 'All Day' : formatTime(event.startTime)}
                        </div>
                        <div className="event-title">{event.title}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view.type === 'day' && (
          <div className="day-view">
            <div className="day-header">
              <h3>{formatDate(view.date)}</h3>
            </div>
            <div className="day-timeline">
              {Array.from({ length: 24 }, (_, hour) => {
                const hourEvents = events.filter(event => {
                  const eventHour = new Date(event.startTime).getHours();
                  return eventHour === hour && 
                         new Date(event.startTime).toDateString() === view.date.toDateString();
                });
                
                return (
                  <div key={hour} className="timeline-hour">
                    <div className="hour-label">
                      {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                    </div>
                    <div className="hour-content">
                      {hourEvents.map(event => (
                        <div
                          key={event.id}
                          className="timeline-event"
                          style={{ backgroundColor: event.color }}
                          onClick={() => editEvent(event)}
                        >
                          <div className="event-title">{event.title}</div>
                          <div className="event-time">
                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view.type === 'agenda' && (
          <div className="agenda-view">
            <div className="agenda-header">
              <h3>Upcoming Events</h3>
            </div>
            <div className="agenda-list">
              {getFilteredEvents().map(event => (
                <div
                  key={event.id}
                  className="agenda-item"
                  onClick={() => editEvent(event)}
                >
                  <div className="agenda-date">
                    <div className="date-day">{event.startTime.getDate()}</div>
                    <div className="date-month">
                      {event.startTime.toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </div>
                  <div className="agenda-content">
                    <div className="agenda-title">{event.title}</div>
                    <div className="agenda-details">
                      <span className="agenda-time">
                        {event.allDay ? 'All Day' : formatTime(event.startTime)}
                      </span>
                      {event.location && (
                        <span className="agenda-location">📍 {event.location}</span>
                      )}
                    </div>
                    <div className="agenda-category">
                      <span 
                        className="category-badge"
                        style={{ backgroundColor: getCategoryColor(event.category) }}
                      >
                        {getCategoryIcon(event.category)} {event.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Event Details Sidebar */}
      {showEventDetails && selectedEvent && (
        <div className="event-details-sidebar">
          <div className="sidebar-header">
            <h3>Event Details</h3>
            <button 
              className="close-btn"
              onClick={() => setShowEventDetails(false)}
            >
              ×
            </button>
          </div>
          <div className="sidebar-content">
            <div className="event-detail">
              <label>Title:</label>
              <div className="detail-value">{selectedEvent.title}</div>
            </div>
            <div className="event-detail">
              <label>Description:</label>
              <div className="detail-value">{selectedEvent.description}</div>
            </div>
            <div className="event-detail">
              <label>Time:</label>
              <div className="detail-value">
                {selectedEvent.allDay 
                  ? 'All Day' 
                  : `${formatTime(selectedEvent.startTime)} - ${formatTime(selectedEvent.endTime)}`
                }
              </div>
            </div>
            <div className="event-detail">
              <label>Location:</label>
              <div className="detail-value">{selectedEvent.location || 'No location'}</div>
            </div>
            <div className="event-detail">
              <label>Category:</label>
              <div className="detail-value">
                <span 
                  className="category-badge"
                  style={{ backgroundColor: getCategoryColor(selectedEvent.category) }}
                >
                  {getCategoryIcon(selectedEvent.category)} {selectedEvent.category}
                </span>
              </div>
            </div>
            <div className="event-detail">
              <label>Attendees:</label>
              <div className="detail-value">
                {selectedEvent.attendees.length > 0 
                  ? selectedEvent.attendees.join(', ')
                  : 'No attendees'
                }
              </div>
            </div>
            <div className="sidebar-actions">
              <button 
                className="edit-btn"
                onClick={() => editEvent(selectedEvent)}
              >
                Edit Event
              </button>
              <button 
                className="delete-btn"
                onClick={() => deleteEvent(selectedEvent.id)}
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="event-modal-overlay">
          <div className="event-modal">
            <div className="modal-header">
              <h3>{selectedEvent ? 'Edit Event' : 'Create New Event'}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowEventModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Event Title</label>
                <input type="text" aria-label="Text input" placeholder="Enter event title" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea aria-label="Text area" placeholder="Enter event description" rows={3}></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" aria-label="Event start date" />
                </div>
                <div className="form-group">
                  <label>Start Time</label>
                  <input type="time" aria-label="Event start time" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" aria-label="Event end date" />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input type="time" aria-label="Event end time" />
                </div>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" aria-label="Text input" placeholder="Enter location" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select aria-label="Select option">
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="meeting">Meeting</option>
                  <option value="reminder">Reminder</option>
                  <option value="holiday">Holiday</option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" />
                  All Day Event
                </label>
              </div>
              <div className="modal-actions">
                <button className="save-btn">Save Event</button>
                <button 
                  className="cancel-btn"
                  onClick={() => setShowEventModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
