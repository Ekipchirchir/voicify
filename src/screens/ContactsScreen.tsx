import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import * as Contacts from 'expo-contacts/legacy';
import { Colors } from '@/constants/colors';

export default function ContactsScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [contactsList, setContactsList] = useState<Contacts.Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const requestContactsPermission = async () => {
    setLoading(true);
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);

      if (granted) {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
        });
        setContactsList(data);
      }
    } catch (error) {
      console.error('Error requesting contacts permission:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestContactsPermission();
  }, []);

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contactsList;

    const query = searchQuery.toLowerCase().trim();
    return contactsList.filter((contact) => {
      const nameMatches = contact.name?.toLowerCase().includes(query);
      const phoneMatches = contact.phoneNumbers?.some((phone) =>
        phone.number?.replace(/\D/g, '').includes(query.replace(/\D/g, ''))
      );
      return nameMatches || phoneMatches;
    });
  }, [contactsList, searchQuery]);

  if (hasPermission === null || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.subtext}>Requesting Contacts Permission...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Contacts Permission Required</Text>
        <Text style={styles.subtext}>
          Voicify needs access to your contacts to display your phonebook.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestContactsPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search contacts..."
        placeholderTextColor={Colors.textSecondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
        clearButtonMode="while-editing"
      />

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id || item.name || Math.random().toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.subtext}>No contacts found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <Text style={styles.contactName}>{item.name ?? 'Unnamed Contact'}</Text>
            {item.phoneNumbers && item.phoneNumbers.length > 0 && (
              <Text style={styles.phoneNumber}>{item.phoneNumbers[0].number}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  centered: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  searchInput: {
    backgroundColor: Colors.surface || '#1E1E1E',
    color: Colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtext: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  contactItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  contactName: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  phoneNumber: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
});