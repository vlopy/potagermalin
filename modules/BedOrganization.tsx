import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { getBedCompositionKey } from "./TypesAndConst";
import YearSelector from "./YearSelector";

const BedOrganization = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  type T_OneBedOrganization = {
    name: string,
    vegetableList: Array<string>
  }

  const vegetablesInBed = new Map<string, Array<T_OneBedOrganization>>(
    [
      [
        "2022", [
          { name: "free", vegetableList: ["petits pois", "bettrave"] },
          { name: "1", vegetableList: ["ail", "tomate"] },
          { name: "3", vegetableList: ["comcombre"] }
        ]
      ]
    ]);

  useEffect(() => {
    const initOrganization = async (year: number) => {
      // Set and get the map that represents the compositions of the beds
      console.log("RAW: " + JSON.stringify(Object.fromEntries(vegetablesInBed)));
      AsyncStorage.setItem("test1", JSON.stringify(Object.fromEntries(vegetablesInBed)));
      //AsyncStorage.clear();
      const selectedJSON = await AsyncStorage.getItem("test1");
      if (selectedJSON != null) {
        console.log("RESULT: " + new Map<string, Array<T_OneBedOrganization>>(Object.entries(JSON.parse(selectedJSON))));
      }
    }

    initOrganization(2022);
  });

  return (
    <View style={{ flex: 1 }}>
      <Text>Répartition des légumes dans tes planches</Text>
      <YearSelector fileSuffixArg={getBedCompositionKey(selectedYear)} setYear={setSelectedYear} />
    </View>
  )
}

export default BedOrganization;