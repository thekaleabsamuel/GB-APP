import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions,
  ActivityIndicator 
} from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

const tracks = [
  {
    id: '1',
    title: '01. Cest La Vie',
    artist: 'Kaleab Samuel & Paris Williams',
    imageUrl: 'https://i.postimg.cc/MGH5szG2/GB-Cover.jpg',
    audioUrl: 'https://dl.sndup.net/jt2qj/CLV%201.mp3'
  },
];

export default function MainScreen({ switchView }) {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // Format time function
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

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  async function loadAndPlaySound() {
    try {
      setIsLoading(true);
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: currentTrack.audioUrl },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      setIsPlaying(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading sound:', error);
      setIsLoading(false);
    }
  }

  function onPlaybackStatusUpdate(status) {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      setIsPlaying(status.isPlaying);
    }
  }

  async function playPause() {
    try {
      if (!sound) {
        await loadAndPlaySound();
        return;
      }

      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.error('Error playing/pausing:', error);
    }
  }

  async function seekTo(value) {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  }

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
          source={{ uri: currentTrack.imageUrl }}
          style={styles.albumArt}
        />
        <Text style={styles.title}>{currentTrack.title}</Text>
        <Text style={styles.artist}>{currentTrack.artist}</Text>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Slider
            style={styles.progressBar}
            value={position}
            minimumValue={0}
            maximumValue={duration}
            onSlidingComplete={seekTo}
            minimumTrackTintColor="#f4511e"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#f4511e"
          />
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton}>
          <Text style={styles.controlText}>⏮️</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.playButton}
          onPress={playPause}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <Text style={styles.playButtonText}>
              {isPlaying ? '⏸️' : '▶️'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <Text style={styles.controlText}>⏭️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
  },
  playlistButton: {
    alignSelf: 'flex-end',
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 20,
  },
  playlistButtonText: {
    fontSize: 16,
  },
  trackInfo: {
    alignItems: 'center',
    width: '100%', // Added to ensure proper slider width
  },
  albumArt: {
    width: Dimensions.get('window').width - 80,
    height: Dimensions.get('window').width - 80,
    borderRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  artist: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  progressBar: {
    flex: 1,
    marginHorizontal: 10,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    width: 40,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingBottom: 40,
  },
  controlButton: {
    padding: 20,
  },
  controlText: {
    fontSize: 24,
  },
  playButton: {
    padding: 20,
    marginHorizontal: 30,
  },
  playButtonText: {
    fontSize: 40,
  },
});