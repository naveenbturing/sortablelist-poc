import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
} from 'react-native';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SortableList from './SortableList/SortableList';

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  gestureView: {
    flex: 1,
  },
  mainText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
  },
  header: {
    justifyContent: 'center',
    backgroundColor: 'skyblue',
    height: 64,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <GestureHandlerRootView style={styles.gestureView}>
        <View style={styles.mainContent}>
          <SortableList
            headerComponent={
              <View style={styles.header}>
                <Text style={styles.headerText}>Hello</Text>
              </View>
            }
          />
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default App;
