/* eslint-disable prettier/prettier */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Audio } from 'expo-av'; // Using expo-av for audio recording
import { saveAudioFile } from '../utils/audioUtils';

const HomeScreen = ({ onTranscriptionComplete, navigation }) => {
  const [recording, setRecording] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [title, setTitle] = useState('');

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (granted) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const newRecording = new Audio.Recording();
        await newRecording.prepareToRecordAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        await newRecording.startAsync();
        setRecording(newRecording);
        setIsRecording(true);
      } else {
        alert('Permission to access microphone is required!');
      }
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stopped and stored at', uri);
      handleSave(uri);
      setRecording(null);
      onTranscriptionComplete(transcription);
    }
  };

  const handleSave = async (uri) => {
    const defaultTitle = new Date().toISOString(); // Use ISO string for date-time-based default title
    const audioTitle = title || defaultTitle;
    const filename = `${audioTitle}.wav`;
    const savedUri = await saveAudioFile(uri, filename);

    // Pass the saved recording to the TranscriptionsScreen
    navigation.navigate('Transcriptions', {
      newRecording: { uri: savedUri, title: audioTitle },
    });

    setTitle(''); // Reset title input
    console.log('Audio file saved at:', savedUri);
  };

  return (
    <View style={styles.container}>
      <View style={styles.transcriptionContainer}>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="Transcription appears here..."
          value={transcription}
          onChangeText={setTranscription}
          editable={!isRecording}
        />
      </View>
      <View style={styles.titleContainer}>
        <TextInput
          style={styles.titleInput}
          placeholder="Enter title..."
          value={title}
          onChangeText={setTitle}
        />
        <TouchableOpacity onPress={() => setTitle('')}>
          <Text>❌</Text>
        </TouchableOpacity>
        {recording && (
          <TouchableOpacity onPress={() => handleSave(recording.getURI())}>
            <Text>✅</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.audioButton}
        onPress={isRecording ? stopRecording : startRecording}>
        <Text style={styles.audioButtonText}>
          {isRecording ? 'Pause' : 'Record'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  transcriptionContainer: {
    flex: 1,
    width: '90%',
    margin: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  textInput: {
    height: '100%',
    textAlignVertical: 'top',
  },
  audioButton: {
    margin: 20,
    padding: 20,
    backgroundColor: '#000',
    borderRadius: 50,
  },
  audioButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  titleInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
});

export default HomeScreen;

