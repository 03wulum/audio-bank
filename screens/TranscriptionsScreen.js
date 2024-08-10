/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

const TranscriptionsScreen = ({route, navigation}) => {
  const [recordings, setRecordings] = useState([]);
  const [selectedRecordings, setSelectedRecordings] = useState([]);
  const [isMultiSelect, setIsMultiSelect] = useState(false);

  useEffect(() => {
    if (route.params?.newRecording) {
      setRecordings(prevRecordings => [
        ...prevRecordings,
        route.params.newRecording,
      ]);
    }
  }, [route.params?.newRecording]);

  const toggleSelectRecording = index => {
    if (isMultiSelect) {
      if (selectedRecordings.includes(index)) {
        setSelectedRecordings(selectedRecordings.filter(i => i !== index));
      } else {
        setSelectedRecordings([...selectedRecordings, index]);
      }
    } else {
      // Navigate to ViewScreen with the selected recording
      navigation.navigate('ViewScreen', {recording: recordings[index]});
    }
  };

  const handleLongPress = index => {
    setIsMultiSelect(true);
    setSelectedRecordings([index]);
  };

  const deleteSelectedRecordings = () => {
    Alert.alert(
      'Delete Recordings',
      'Are you sure you want to delete the selected recordings?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          onPress: () => {
            setRecordings(
              recordings.filter(
                (_, index) => !selectedRecordings.includes(index),
              ),
            );
            setSelectedRecordings([]);
            setIsMultiSelect(false);
          },
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {recordings.map((rec, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => toggleSelectRecording(index)}
            onLongPress={() => handleLongPress(index)}
            style={[
              styles.recordingItem,
              selectedRecordings.includes(index) && styles.selectedItem,
            ]}>
            <Text style={styles.recordingTitle}>{rec.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {isMultiSelect && (
        <View style={styles.deleteButtonContainer}>
          <TouchableOpacity
            onPress={deleteSelectedRecordings}
            style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete Selected</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  recordingItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  recordingTitle: {
    fontSize: 16,
  },
  selectedItem: {
    backgroundColor: '#c0c0c0',
  },
  deleteButtonContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  deleteButton: {
    padding: 15,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default TranscriptionsScreen;
