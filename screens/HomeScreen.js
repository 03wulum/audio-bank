/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import {Audio} from 'expo-av'; // Using expo-av for audio recording
import {saveAudioFile} from '../utils/audioUtils';

const HomeScreen = ({onTranscriptionComplete}) => {
  const [recording, setRecording] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognizerRef = useRef(null);

  const startRecording = async () => {
    try {
      const {granted} = await Audio.requestPermissionsAsync();
      if (granted) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
        );
        recording.setOnRecordingStatusUpdate(async status => {
          if (status.isRecording && recognizerRef.current) {
            const audioChunk = await recording.getURI();
            // Convert the audio chunk to the format required by Vosk and recognize
            const result = recognizerRef.current.AcceptWaveform(audioChunk);
            if (result) {
              const {text} = recognizerRef.current.Result();
              setTranscription(prev => prev + ' ' + text);
            }
          }
        });
        await recording.startAsync();
        setRecording(recording);
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
    const audioUri = uri;
    const filename = 'audio-log-001';
    const savedUri = await saveAudioFile(audioUri, filename);
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
      <TouchableOpacity
        style={styles.audioButton}
        onPress={isRecording ? stopRecording : startRecording}>
        <Text style={styles.audioButtonText}>
          {isRecording ? 'Pause' : 'Record'}
        </Text>
      </TouchableOpacity>
      {isRecording && (
        <>
          <TouchableOpacity style={styles.optionButton} onPress={stopRecording}>
            <Text>Finish Transcription</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setTranscription('')}>
            <Text>Delete</Text>
          </TouchableOpacity>
        </>
      )}
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
  optionButton: {
    margin: 10,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
});

export default HomeScreen;
