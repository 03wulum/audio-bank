/* eslint-disable prettier/prettier */
import * as FileSystem from 'expo-file-system';
import {Audio} from 'expo-av';

export const saveAudioFile = async (uri, filename) => {
  const fileUri = `${FileSystem.documentDirectory}${filename}.wav`;
  await FileSystem.moveAsync({
    from: uri,
    to: fileUri,
  });
  return fileUri;
};

export const playRecording = async uri => {
  const {sound} = await Audio.Sound.createAsync({uri});
  await sound.playAsync();
};
