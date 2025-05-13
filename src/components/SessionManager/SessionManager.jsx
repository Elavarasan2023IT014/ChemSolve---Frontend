import React from 'react';

const SessionManager = () => {
  // This component doesn't render anything
  // It's used to manage the session across the application
  
  React.useEffect(() => {
    // Set up session tracking when component mounts
    sessionStorage.setItem('app_session', 'active');
    
    // Add beforeunload event listener to track when the user closes the tab/browser
    const handleUnload = () => {
      // We can't reliably distinguish between refresh and closing,
      // but sessionStorage will be cleared when the browser closes
    };
    
    window.addEventListener('beforeunload', handleUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);
  
  return null;
};

export default SessionManager;