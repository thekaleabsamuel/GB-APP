import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppProvider } from './AppContext';
import MainScreen from './screens/MainScreen';
import PlaylistScreen from './screens/PlaylistScreen';

export default function App() {
  const [currentView, setCurrentView] = useState('main');

  return (
    <AppProvider>
      <View style={styles.container}>
        {currentView === 'main' ? (
          <MainScreen onNavigate={() => setCurrentView('playlist')} />
        ) : (
          <PlaylistScreen onNavigate={() => setCurrentView('main')} />
        )}
      </View>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});