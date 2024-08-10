import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from './screens/HomeScreen';
import TranscriptionsScreen from './screens/TranscriptionsScreen';
import ViewScreen from './screens/ViewScreen'; // Import the ViewScreen

const Drawer = createDrawerNavigator();

const App = () => {
  const [transcriptions, setTranscriptions] = useState([]);
  const [selectedRecording, setSelectedRecording] = useState(null);

  const handleTranscriptionComplete = newTranscription => {
    setTranscriptions([...transcriptions, newTranscription]);
  };

  const handleSelectRecording = recording => {
    setSelectedRecording(recording);
  };

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home">
          {props => (
            <HomeScreen
              {...props}
              onTranscriptionComplete={handleTranscriptionComplete}
            />
          )}
        </Drawer.Screen>
        <Drawer.Screen name="Transcriptions">
          {props => (
            <TranscriptionsScreen
              {...props}
              transcriptions={transcriptions}
              onSelectRecording={handleSelectRecording}
            />
          )}
        </Drawer.Screen>
        <Drawer.Screen name="ViewScreen">
          {props => (
            <ViewScreen
              {...props}
              recording={selectedRecording || transcriptions[0]} // Show selected recording or first in the list
            />
          )}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
