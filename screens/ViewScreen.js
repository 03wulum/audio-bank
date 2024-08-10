/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {Audio} from 'expo-av';
import * as FileSystem from 'expo-file-system';

const ViewScreen = ({route}) => {
  const {filename} = route.params;
  let [sound, setSound] = useState(null);
  const [transcription, setTranscription] = useState(
    'Loading transcription...',
  );

  const playAudio = async () => {
     sound = await Audio.Sound.createAsync({
      uri: FileSystem.documentDirectory + filename,
    });
    setSound(sound);
    await sound.playAsync();
  };
  /**
   *  prevent unneccessary function redefinition by wrapping stopAudio in a useCallback hook
   *  function is only redefined when dependenc (sound) is updated
   * useCallback is a React Hook that lets you cache a function definition between re-renders.
   */
  const stopAudio = useCallback(async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  }, [sound]);

  useEffect(() => {
    const loadTranscription = async () => {
      const transcriptionUri = `${
        FileSystem.documentDirectory
      }${filename.replace('.wav', '.txt')}`;
      const transcriptionText = await FileSystem.readAsStringAsync(
        transcriptionUri,
      );
      setTranscription(transcriptionText || 'No transcription available.');
    };

    loadTranscription();

    return () => {
      if (sound) {
        stopAudio();
      }
    };
  }, [filename, sound, stopAudio]);

  return (
    <View style={styles.container}>
      <Button title="Play Audio" onPress={playAudio} />
      <Button title="Stop Audio" onPress={stopAudio} />
      <View style={styles.transcriptionContainer}>
        <Text style={styles.transcriptionText}>{transcription}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  transcriptionContainer: {
    marginTop: 20,
    padding: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
  },
  transcriptionText: {
    fontSize: 16,
  },
});

export default ViewScreen;
