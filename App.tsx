/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import React from 'react';
import { createDrawerNavigator } from "@react-navigation/drawer";
import Map from "./screens/Map";
import Selection from "./screens/Selection";
import Calendar from "./screens/Calendar";
import Information from "./screens/Information";
import Harvest from "./screens/Harvest";

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Plan du jardin" component={Map} />
        <Drawer.Screen name="Selection des légumes" component={Selection} />
        <Drawer.Screen name="Entretien du jardin" component={Calendar} />
        <Drawer.Screen name="Information sur les légumes" component={Information} />
        <Drawer.Screen name="Ta récolte" component={Harvest} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
