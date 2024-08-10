/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const TranscriptionsScreen = ({ transcriptions }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {transcriptions.map((transcription, index) => (
        <View key={index} style={styles.transcriptionItem}>
          <Text style={styles.transcriptionText}>{transcription}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  transcriptionItem: {
    width: '45%',
    margin: 5,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  transcriptionText: {
    fontSize: 16,
    color: '#000',
  },
});

export default TranscriptionsScreen;
