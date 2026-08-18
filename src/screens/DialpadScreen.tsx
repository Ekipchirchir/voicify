import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '@/constants/colors';
import KeypadButton from '@/components/dialpad/KeypadButton';
import { useDialTone } from '@/hooks/useDialTone';

type RootStackParamList = {
  ActiveCallScreen: {
    phoneNumber: string;
    direction: 'outgoing' | 'incoming';
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ActiveCallScreen'>;

const KEYPAD_DATA = [
  [{ num: '1', letters: '' }, { num: '2', letters: 'ABC' }, { num: '3', letters: 'DEF' }],
  [{ num: '4', letters: 'GHI' }, { num: '5', letters: 'JKL' }, { num: '6', letters: 'MNO' }],
  [{ num: '7', letters: 'PQRS' }, { num: '8', letters: 'TUV' }, { num: '9', letters: 'WXYZ' }],
  [{ num: '*', letters: '' }, { num: '0', letters: '+' }, { num: '#', letters: '' }],
];

export default function DialpadScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const { playKeyPressTone } = useDialTone();

  const handleKeyPress = (digit: string) => {
    playKeyPressTone();
    setPhoneNumber((prev) => prev + digit);
  };

  const handleBackspace = () => {
    playKeyPressTone();
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const handleInitiateCall = () => {
    if (!phoneNumber.trim()) return;

    navigation.navigate('ActiveCallScreen', {
      phoneNumber,
      direction: 'outgoing',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {phoneNumber}
        </Text>
      </View>

      <View style={styles.keypadContainer}>
        {KEYPAD_DATA.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((item) => (
              <KeypadButton
                key={item.num}
                number={item.num}
                letters={item.letters}
                onPress={handleKeyPress}
              />
            ))}
          </View>
        ))}

        <View style={styles.actionRow}>
          <View style={styles.actionPlaceholder} />

          <TouchableOpacity
            style={styles.callButton}
            activeOpacity={0.8}
            onPress={handleInitiateCall}
          >
            <Ionicons name="call" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          {phoneNumber.length > 0 ? (
            <TouchableOpacity
              style={styles.backspaceButton}
              onPress={handleBackspace}
              onLongPress={() => {
                playKeyPressTone();
                setPhoneNumber('');
              }}
            >
              <Ionicons name="backspace-outline" size={28} color={Colors.textSecondary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.actionPlaceholder} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  displayContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  displayText: { color: Colors.textPrimary, fontSize: 36, fontWeight: '600', letterSpacing: 1 },
  keypadContainer: { paddingBottom: 20, alignItems: 'center' },
  row: { flexDirection: 'row' },
  actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '75%', marginTop: 15 },
  actionPlaceholder: { width: 50 },
  callButton: { width: 65, height: 65, borderRadius: 33, backgroundColor: Colors.callGreen, justifyContent: 'center', alignItems: 'center' },
  backspaceButton: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
});