// OnlineStatusScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export default function OnlineStatusScreen() {
  return (
    <View style={styles.container}>
      <Text>Online Status Screen</Text>
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' } });
