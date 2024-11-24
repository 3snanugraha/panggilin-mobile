import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Menyesuaikan gambar dan deskripsi dengan layanan yang tersedia di platform "Panggilin"
const slides = [
  {
    id: '1',
    image: require('@/assets/images/handyman.png'), // Ganti dengan gambar tukang
    description: 'Cari tukang untuk berbagai pekerjaan rumah atau renovasi.',
  },
  {
    id: '2',
    image: require('@/assets/images/cleaning.png'), // Ganti dengan gambar kebersihan
    description: 'Pesan layanan kebersihan untuk rumah atau kantor Anda.',
  },
  {
    id: '3',
    image: require('@/assets/images/trash.png'), // Ganti dengan gambar pungut sampah
    description: 'Layanan pungut sampah untuk lingkungan yang lebih bersih.',
  },
  {
    id: '4',
    image: require('@/assets/images/delivery.png'), // Ganti dengan gambar untuk layanan lain
    description: 'Tersedia berbagai layanan lainnya sesuai kebutuhan Anda.',
  },
];

export default function StartScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleGetStarted = () => {
    router.push('/(tabs)'); // Menuju halaman utama aplikasi setelah tombol ditekan
  };

  const renderItem = ({ item }: { item: typeof slides[0] }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#5d379e', '#7E57C2']} // Dominan color #7E57C2
        style={styles.gradientBackground}
      />
      <Text style={styles.title}>PanggilIn</Text>
      <FlatList
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        style={styles.slider}
      />
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Ionicons name="people-outline" size={24} color="#7E57C2" />
        <Text style={styles.buttonText}>Cari Layanan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  slider: {
    flexGrow: 0,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 300,
    width: 290,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#7E57C2', // Active dot with the same color as the primary theme
    width: 12,
    height: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#7E57C2', // Updated text color to match primary theme color
    marginLeft: 10,
    fontWeight: 'bold',
  },
});
