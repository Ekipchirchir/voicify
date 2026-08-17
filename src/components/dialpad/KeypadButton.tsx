import { Colors } from '@/constants/colors';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface KeypadButtonProps {
    number: string;
    letters?: string;
    onPress: (digit: string) => void;
}

export default function KeypadButton({ number, letters, onPress} : KeypadButtonProps) {
  return (
    <TouchableOpacity 
      style={styles.button}
      activeOpacity={0.6}
      onPress={() => onPress(number)}
    >
        <Text style={styles.numberText}>{number}</Text>
        {letters ? <Text style={styles.lettersText}>{letters}</Text> : <View style={styles.spacer} />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    button: {
        width: 75,
        height: 75,
        borderRadius: 38,
        backgroundColor: Colors.surface,
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
    },
    numberText: {
        color: Colors.textPrimary,
        fontSize: 28,
        fontWeight: "600"
    },
    lettersText: {
        color: Colors.textSecondary,
        fontSize: 10,
        fontWeight: "500",
        letterSpacing: 1.5,
        marginTop: 1,
    },
    spacer: {
        height: 12
    }
});