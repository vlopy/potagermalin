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
import Map from "./modules/Map";
import Selection from "./modules/Selection";
import Calendar from "./modules/Calendar";
import Harvest from "./modules/Harvest";
import BedOrganization from "./modules/BedOrganization";

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Plan du jardin" component={Map} />
        <Drawer.Screen name="Sélection des légumes" component={Selection} />
        <Drawer.Screen name="Répartition des légumes" component={BedOrganization} />
        <Drawer.Screen name="Entretien du jardin" component={Calendar} />
        <Drawer.Screen name="Ta récolte" component={Harvest} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
