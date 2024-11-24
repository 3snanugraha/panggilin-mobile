import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, ActivityIndicator, Text, ScrollView, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import AuthManager from '@/services/Auth';

interface Profile {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
}

export default function ProfilePage() {
  const { id } = useLocalSearchParams(); // ID pengguna
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    fetchProfileData();
  }, [id]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const authManager = AuthManager;

      // Fetch profile data
      const profileData = await authManager.fetchRecord('Users', id as string);
      const formattedProfile: Profile = {
        id: profileData.id,
        name: profileData.Name,
        email: profileData.Email,
        avatar: `${process.env.EXPO_PUBLIC_DB_HOST}/api/files/${profileData.collectionId}/${profileData.id}/${profileData.Avatar}`,
      };
      setProfile(formattedProfile);

      // Fetch services associated with the user
      const servicesData = await authManager.fetchCollection('Services', {
        filter: `User_ID="${id}"`,
      });
      const formattedServices: Service[] = servicesData.map((service: any) => ({
        id: service.id,
        name: service.Name,
        description: service.Description,
      }));
      setServices(formattedServices);
    } catch (error) {
      console.error('Error fetching profile or services:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfileData();
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7E57C2" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7E57C2" />
        }
      >
        {profile && (
          <View style={styles.profileContainer}>
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.email}>{profile.email}</Text>
          </View>
        )}

        <View style={styles.servicesContainer}>
          <Text style={styles.sectionTitle}>Services:</Text>
          {services.length > 0 ? (
            services.map((service) => (
              <View key={service.id} style={styles.serviceItem}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noServicesText}>No services available.</Text>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5F5', // Dominan color background
  },
  contentContainer: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7E57C2',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7E57C2',
  },
  email: {
    fontSize: 16,
    color: '#333',
  },
  servicesContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7E57C2',
    marginBottom: 10,
  },
  serviceItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
  },
  noServicesText: {
    fontSize: 14,
    color: '#999',
  },
});
