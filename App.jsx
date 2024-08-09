import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from './screens/HomeScreen';
import TranscriptionsScreen from './screens/TranscriptionsScreen';

const Drawer = createDrawerNavigator();

const App = () => {
  const [transcriptions, setTranscriptions] = useState([]);

  const handleTranscriptionComplete = newTranscription => {
    setTranscriptions([...transcriptions, newTranscription]);
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
            <TranscriptionsScreen {...props} transcriptions={transcriptions} />
          )}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
