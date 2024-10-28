

import React, { useEffect, useState } from 'react';  // Added useState to imports
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions 
} from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../AppContext';

const tracks = [
  {
    id: '1',
    title: '01. Cest La Vie',
    artist: 'Kaleab Samuel & Paris Williams',
    imageUrl: 'https://i.postimg.cc/MGH5szG2/GB-Cover.jpg',
    audioUrl: 'https://dl.sndup.net/jt2qj/CLV%201.mp3'
  },
  {
    id: '2',
    title: '02. Girl Like U',
    artist: 'Kaleab Samuel & Paris Williams',
    imageUrl: 'https://i.postimg.cc/MGH5szG2/GB-Cover.jpg',
    audioUrl: 'https://dl.sndup.net/cjfx7/02%20Girl%20Like%20U%20Clean.mp3'
  },
];

export default function MainScreen({ switchView }) {
  const { playbackState, setPlaybackState } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    async function setupAudio() {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false
        });
      } catch (error) {
        console.error('Failed to set audio mode:', error);
      }
    }

    setupAudio();

    // Initialize current track if not set
    if (!playbackState.currentTrack) {
      setPlaybackState(prev => ({
        ...prev,
        currentTrack: tracks[0]
      }));
    }

    return () => {
      // Don't unload the sound when component unmounts
      // This allows the music to keep playing when switching screens
    };
  }, []);

  async function loadAndPlaySound() {
    try {
      setIsLoading(true);
      if (playbackState.sound) {
        await playbackState.sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: playbackState.currentTrack.audioUrl },
        { shouldPlay: true, positionMillis: playbackState.position },
        onPlaybackStatusUpdate
      );

      setPlaybackState(prev => ({
        ...prev,
        sound: newSound,
        isPlaying: true
      }));
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading sound:', error);
      setIsLoading(false);
    }
  }

  function onPlaybackStatusUpdate(status) {
    if (status.isLoaded) {
      setPlaybackState(prev => ({
        ...prev,
        position: status.positionMillis,
        duration: status.durationMillis,
        isPlaying: status.isPlaying
      }));
    }
  }

  async function playPause() {
    try {
      if (!playbackState.sound) {
        await loadAndPlaySound();
        return;
      }

      if (playbackState.isPlaying) {
        await playbackState.sound.pauseAsync();
      } else {
        await playbackState.sound.playAsync();
      }
    } catch (error) {
      console.error('Error playing/pausing:', error);
    }
  }

  async function seekTo(value) {
    if (playbackState.sound) {
      await playbackState.sound.setPositionAsync(value);
    }
  }

  // Rest of the JSX remains the same, just update the state references
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.playlistButton}
        onPress={switchView}
      >
        <Text style={styles.playlistButtonText}>View Playlist</Text>
      </TouchableOpacity>

      <View style={styles.trackInfo}>
        <Image
          source={{ uri: playbackState.currentTrack?.imageUrl }}
          style={styles.albumArt}
        />
        <Text style={styles.title}>{playbackState.currentTrack?.title}</Text>
        <Text style={styles.artist}>{playbackState.currentTrack?.artist}</Text>
        
        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>{formatTime(playbackState.position)}</Text>
          <Slider
            style={styles.progressBar}
            value={playbackState.position}
            minimumValue={0}
            maximumValue={playbackState.duration}
            onSlidingComplete={seekTo}
            minimumTrackTintColor="#1DB954"
            maximumTrackTintColor="rgba(0,0,0,0.1)"
            thumbTintColor="#1DB954"
          />
          <Text style={styles.timeText}>{formatTime(playbackState.duration)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => {/* Add previous track logic */}}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="play-skip-back-sharp" size={35} color="#000" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.playButton}
          onPress={playPause}
          disabled={isLoading}
        >
          <View style={styles.playButtonContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#FFF" />
            ) : (
              <Ionicons 
                name={playbackState.isPlaying ? "pause" : "play"} 
                size={40} 
                color="#FFF"
                style={[styles.playIcon, { marginLeft: playbackState.isPlaying ? 0 : 3 }]}
              />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => {/* Add next track logic */}}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="play-skip-forward-sharp" size={35} color="#000" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}