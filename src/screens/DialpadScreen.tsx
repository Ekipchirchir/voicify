import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from '@/constants/colors';

export default function DialpadScreen() {
  return (
    <View style = {styles.container}>
        <Text style={styles.text}>Dialpad Screen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        color: Colors.textPrimary,
        fontSize: 12,
        fontWeight: "600"
    }
})
