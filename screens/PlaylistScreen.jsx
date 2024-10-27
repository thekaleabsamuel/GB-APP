// src/screens/PlaylistScreen.jsx
import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  Image 
} from 'react-native';

const tracks = [
  {
    id: '1',
    title: "01. Cest La Vie" ,
    artist: "Globetrotters",
    imageUrl: 'https://i.postimg.cc/MGH5szG2/GB-Cover.jpg',
  },
  {
    id: '2',
    title:"02. Girl Like U" ,
    artist: "Globetrotters",
    imageUrl: 'https://i.postimg.cc/MGH5szG2/GB-Cover.jpg',
  },
  {
    id: '3',
    title:"02. Rapunzel *Snippet*" ,
    artist: "Globetrotters",
    imageUrl: 'https://i.postimg.cc/MGH5szG2/GB-Cover.jpg',
  },
  {
    id: '4',
    title:"04. Ayo! (Feat TyFaizon)" ,
    artist: "Globetrotters",
    imageUrl: 'https://i.postimg.cc/MGH5szG2/GB-Cover.jpg',
  },
  {
    id: '5',
    title:"05. Caterpillar" ,
    artist: "Globetrotters",
    imageUrl: 'https://i.postimg.cc/MGH5szG2/GB-Cover.jpg',
  },
  {
    id: '6',
    title:"06. Uh Huh" ,
    artist: "Globetrotters",
    imageUrl: 'https://i.postimg.cc/MGH5szG2/GB-Cover.jpg',
  },
  {
    id: '7',
    title:"07.Bitter Sweet Heart Void" ,
    artist: "Globetrotters",
    imageUrl: 'https://i.postimg.cc/MGH5szG2/GB-Cover.jpg',
  },
  {
    id: '8',
    title:"08. Centered (Feat TheBabeGabe)" ,
    artist: "Globetrotters",
    imageUrl: 'https://i.postimg.cc/MGH5szG2/GB-Cover.jpg',
  },
  {
    id: '9',
    title:"09. Thank U" ,
    artist: "Globetrotters",
    imageUrl: 'https://i.postimg.cc/MGH5szG2/GB-Cover.jpg',
  },
  // Add more tracks
];

export default function PlaylistScreen({ switchView }) {
  const renderTrack = ({ item }) => (
    <TouchableOpacity 
      style={styles.trackItem}
      onPress={switchView}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.trackImage}
      />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{item.title}</Text>
        <Text style={styles.trackArtist}>{item.artist}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={switchView}
      >
        <Text style={styles.backButtonText}>Back to Player</Text>
      </TouchableOpacity>
      
      <FlatList
        data={tracks}
        renderItem={renderTrack}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50, // Added to account for status bar
  },
  backButton: {
    padding: 15,
    backgroundColor: '#eee',
    margin: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  trackImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  trackInfo: {
    marginLeft: 15,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trackArtist: {
    fontSize: 14,
    color: '#666',
  },
});