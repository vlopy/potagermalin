import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import VegetableList from "./ressources/vegetables.json"

const styles = StyleSheet.create({
  "vegetable": {
    marginTop: 10,
    backgroundColor: "green",
    fontSize: 16,
    alignItems: "center",

  },
});

type Vegetable = {
  name: string
  family: string
  sow: {
    directly_m: number[],
    incups_m: number[],
    depth_cm: number[],
    rows_cm: number
    plants_cm?: number,
    info?: string
  },
  thinning?: {
    plants1_cm: number,
    plants2_cm?: number,
    info?: string
  },
  harvest: {
    after_j: number[],
    info?: string
  }
}

const VegetableView = (vege: Vegetable) => {
  const [isExpanded, setExpanded] = useState(false);
  const monthFromNumber = (monthNB: number): string => {
    const month = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet",
      "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    return month[monthNB - 1];
  }

  const sowWhen = (vege: Vegetable) => {
    if (vege.sow.directly_m.length > 1) {
      if (vege.sow.incups_m.length > 1) {
        return (
          <View>
            <Text>Semer en place</Text>
            <Text>De {monthFromNumber(vege.sow.directly_m[0])} à {monthFromNumber(vege.sow.directly_m[1])} </Text>
            <Text>Semer en godets</Text>
            <Text>De {monthFromNumber(vege.sow.incups_m[0])} à {monthFromNumber(vege.sow.incups_m[1])} </Text>
          </View>
        );
      } else {
        return (
          <View>
            <Text>Semer en place</Text>
            <Text>De {monthFromNumber(vege.sow.directly_m[0])} à {monthFromNumber(vege.sow.directly_m[1])} </Text>
          </View>
        );
      }
    } else {
      if (vege.sow.incups_m.length > 1) {
        return (
          <View>
            <Text>Semer en godets</Text>
            <Text>De {monthFromNumber(vege.sow.incups_m[0])} à {monthFromNumber(vege.sow.incups_m[1])} </Text>
          </View>
        );
      }
      else {
        return (
          <Text>CONFIGURATION ERROR, IT'S NOT SUPPOSED TO HAPPEN ;)</Text>
        )
      }
    }
  }

  return (
    <View>
      <Pressable style={styles.vegetable} onPress={() => { setExpanded(!isExpanded) }}>
        <Text>{vege.name}</Text>
        <Text>{vege.family}</Text>
      </Pressable>
      {isExpanded &&
        <View>
          {sowWhen(vege)}
        </View>
      }
    </View>
  );
}


const Selection = () => {
  const renderItem = ({ item }: { item: Vegetable }) => (
    <VegetableView name={item.name} family={item.family} thinning={item.thinning}
      sow={item.sow} harvest={item.harvest} />
  );

  return (
    <View>
      <Text>Sélectionne les légumes à planter dans ton jardin</Text>
      <FlatList<Vegetable>
        data={VegetableList}
        renderItem={renderItem}
        keyExtractor={item => item.name}
      />
    </View>
  )
}

export default Selection;