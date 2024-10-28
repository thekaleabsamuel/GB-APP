import React, { createContext, useContext, useState } from 'react';
import { Audio } from 'expo-av';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [playbackState, setPlaybackState] = useState({
    currentTrack: null,
    sound: null,
    isPlaying: false,
    position: 0,
    duration: 0
  });

  // Clean up function for audio
  const cleanupAudio = async () => {
    if (playbackState.sound) {
      await playbackState.sound.unloadAsync();
    }
  };

  // When component unmounts, cleanup audio
  React.useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  const value = {
    playbackState,
    setPlaybackState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

