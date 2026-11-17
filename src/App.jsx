import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import DigitalPassModal from './components/DigitalPassModal';
import HomePage from './pages/HomePage';
import TechEventsPage from './pages/TechEventsPage';
import NonTechEventsPage from './pages/NonTechEventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import RegistrationPage from './pages/RegistrationPage';
import AboutPage from './pages/AboutPage';
import { fetchSupabaseEvents, fallbackEvents } from './services/events';

export default function App() {
  const [activeScreen, setActiveScreen] = useState('home');
  const [previousScreen, setPreviousScreen] = useState('home');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(fallbackEvents[0]);
  const [passData, setPassData] = useState(null);

  // Load events dynamically from Supabase public.events table (is_open = true)
  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSupabaseEvents();
      setEvents(data);
      if (data.length > 0) {
        setSelectedEvent(data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch events from Supabase:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Use offline fallback data if user wants to preview UI during database setup
  const handleUseFallback = () => {
    setEvents(fallbackEvents);
    setSelectedEvent(fallbackEvents[0]);
    setError(null);
  };

  // Screen switching helper
  const handleNavigate = (screen) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPreviousScreen(activeScreen);
    setActiveScreen(screen);
  };

  // Select event to view details
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setPreviousScreen(activeScreen);
    setActiveScreen('event-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Direct register trigger from card or details
  const handleRegisterEvent = (event) => {
    setSelectedEvent(event);
    setPreviousScreen(activeScreen);
    setActiveScreen('registration');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back button navigation
  const handleBack = () => {
    if (activeScreen === 'registration') {
      setActiveScreen('event-details');
    } else if (activeScreen === 'event-details') {
      if (previousScreen === 'registration' || previousScreen === 'event-details') {
        setActiveScreen(selectedEvent?.category === 'non-tech' ? 'non-tech' : 'tech');
      } else {
        setActiveScreen(previousScreen || 'home');
      }
    } else {
      setActiveScreen('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Successful registration completion
  const handleCompleteRegistration = (generatedPass) => {
    setPassData(generatedPass);
  };

  const handleClosePass = () => {
    setPassData(null);
  };

  const handleGoHomeFromPass = () => {
    setPassData(null);
    setActiveScreen('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isMainTab = ['home', 'tech', 'non-tech', 'about'].includes(activeScreen);

  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface antialiased">
      {/* Top Fixed Header */}
      <Header
        activeScreen={activeScreen}
        setActiveScreen={handleNavigate}
        selectedEvent={selectedEvent}
        onBack={handleBack}
      />

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col pt-20 w-full">
        {activeScreen === 'home' && (
          <HomePage
            setActiveScreen={handleNavigate}
            onSelectEvent={handleSelectEvent}
            onRegister={handleRegisterEvent}
            events={events}
            loading={loading}
            error={error}
            onRetry={loadEvents}
            onUseFallback={handleUseFallback}
          />
        )}

        {activeScreen === 'tech' && (
          <TechEventsPage
            setActiveScreen={handleNavigate}
            onSelectEvent={handleSelectEvent}
            onRegister={handleRegisterEvent}
            events={events}
            loading={loading}
            error={error}
            onRetry={loadEvents}
            onUseFallback={handleUseFallback}
          />
        )}

        {activeScreen === 'non-tech' && (
          <NonTechEventsPage
            setActiveScreen={handleNavigate}
            onSelectEvent={handleSelectEvent}
            onRegister={handleRegisterEvent}
            events={events}
            loading={loading}
            error={error}
            onRetry={loadEvents}
            onUseFallback={handleUseFallback}
          />
        )}

        {activeScreen === 'event-details' && (
          <EventDetailsPage
            event={selectedEvent}
            onBack={handleBack}
            onRegister={handleRegisterEvent}
          />
        )}

        {activeScreen === 'registration' && (
          <RegistrationPage
            event={selectedEvent}
            onBack={handleBack}
            onCompleteRegistration={handleCompleteRegistration}
          />
        )}

        {activeScreen === 'about' && (
          <AboutPage setActiveScreen={handleNavigate} />
        )}
      </main>

      {/* Mobile Floating Bottom Nav Bar (Shown on Main Navigation Tabs) */}
      {isMainTab && (
        <BottomNav
          activeScreen={activeScreen}
          setActiveScreen={handleNavigate}
        />
      )}

      {/* Digital Access Pass Modal */}
      {passData && (
        <DigitalPassModal
          passData={passData}
          onClose={handleClosePass}
          onGoHome={handleGoHomeFromPass}
        />
      )}
    </div>
  );
}
