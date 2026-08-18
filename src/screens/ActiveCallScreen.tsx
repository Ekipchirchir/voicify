import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

export default function ActiveCallScreen({ route, navigation }: any) {
  const { phoneNumber } = route.params;
  const [callStatus, setCallStatus] = useState<'calling' | 'connected' | 'ended'>('calling');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // 1. Initialize audio connection here (WebRTC / Voice SDK)
    
    // Simulate call answered after 3 seconds for UI testing
    const timer = setTimeout(() => {
      setCallStatus('connected');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Call duration counter
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const handleEndCall = () => {
    setCallStatus('ended');
    // 2. Disconnect audio stream here
    navigation.goBack();
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.nameText}>{phoneNumber}</Text>
        <Text style={styles.statusText}>
          {callStatus === 'calling' ? 'Calling...' : formatTime(duration)}
        </Text>
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.controlBtn, isMuted && styles.activeBtn]}
            onPress={() => setIsMuted(!isMuted)}
          >
            <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={28} color="#FFF" />
            <Text style={styles.btnLabel}>Mute</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlBtn, isSpeakerOn && styles.activeBtn]}
            onPress={() => setIsSpeakerOn(!isSpeakerOn)}
          >
            <Ionicons name={isSpeakerOn ? 'volume-high' : 'volume-medium'} size={28} color="#FFF" />
            <Text style={styles.btnLabel}>Speaker</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.endCallBtn} onPress={handleEndCall}>
          <Ionicons name="call" size={32} color="#FFF" style={{ transform: [{ rotate: '135deg' }] }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827', justifyContent: 'space-between', paddingVertical: 40 },
  infoContainer: { alignItems: 'center', marginTop: 60 },
  nameText: { color: '#FFFFFF', fontSize: 28, fontWeight: '600' },
  statusText: { color: '#9CA3AF', fontSize: 18, marginTop: 10 },
  controlsContainer: { alignItems: 'center', marginBottom: 40 },
  row: { flexDirection: 'row', justifyContent: 'space-around', width: '80%', marginBottom: 50 },
  controlBtn: { alignItems: 'center', justifyContent: 'center', width: 70, height: 70, borderRadius: 35, backgroundColor: '#1F2937' },
  activeBtn: { backgroundColor: '#374151' },
  btnLabel: { color: '#D1D5DB', fontSize: 12, marginTop: 6 },
  endCallBtn: { width: 75, height: 75, borderRadius: 38, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center' },
});