/* eslint-disable prettier/prettier */
import * as FileSystem from 'expo-file-system';

export const saveAudioFile = async (uri, filename) => {
  const fileUri = `${FileSystem.documentDirectory}${filename}.wav`;
  await FileSystem.moveAsync({
    from: uri,
    to: fileUri,
  });
  return fileUri;
};
