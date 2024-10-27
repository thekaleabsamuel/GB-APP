// App.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MainScreen from './screens/MainScreen';
import PlaylistScreen from './screens/PlaylistScreen';

export default function App() {
  const [currentView, setCurrentView] = useState('main');

  return (
    <View style={styles.container}>
      {currentView === 'main' ? (
        <MainScreen switchView={() => setCurrentView('playlist')} />
      ) : (
        <PlaylistScreen switchView={() => setCurrentView('main')} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});