import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import AuthManager from '@/services/Auth';

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
}

export default function JasaScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const authManager = AuthManager;

      // Fetch list of services
      const servicesData = await authManager.fetchCollection('Services', {});
      const formattedServices: Service[] = servicesData.map((service: any) => ({
        id: service.id,
        name: service.Name,
        description: service.Description,
        price: service.Price,
        image: `${process.env.EXPO_PUBLIC_DB_HOST}/api/files/${service.collectionId}/${service.id}/${service.Image}`,
      }));
      setServices(formattedServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchServices();
  };

  const renderLoadingState = () => (
    <ThemedView style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#7E57C2" />
      <Text style={styles.loadingText}>Loading services...</Text>
    </ThemedView>
  );

  if (loading) {
    return renderLoadingState();
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7E57C2" />
        }
      >
        <Text style={styles.headerTitle}>Available Services</Text>

        {services.length > 0 ? (
          services.map((service) => (
            <TouchableOpacity key={service.id} style={styles.serviceCard}>
              <Image source={{ uri: service.image }} style={styles.serviceImage} />
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription} numberOfLines={2}>
                  {service.description}
                </Text>
                <Text style={styles.servicePrice}>{`Rp ${service.price}`}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noServicesText}>No services available at the moment.</Text>
        )}
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
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7E57C2',
    marginBottom: 20,
    textAlign: 'center',
  },
  serviceCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  serviceImage: {
    width: 100,
    height: 100,
  },
  serviceInfo: {
    flex: 1,
    padding: 10,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7E57C2',
  },
  noServicesText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});
