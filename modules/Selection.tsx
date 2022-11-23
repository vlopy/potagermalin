import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import VegetableList from "./ressources/vegetables.json";
import AsyncStorage from '@react-native-async-storage/async-storage';
import YearSelector from "./YearSelector";
import { getSelectedVegetablesKey, T_Vegetable } from "./TypesAndConst";

const styles = StyleSheet.create({
  "vegetable": {
    marginTop: 10,
    fontSize: 16,
    alignItems: "center",
  }
});

/**** Functions ****/
const monthFromNumber = (monthNB: number): string => {
  const month = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet",
    "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  return month[monthNB - 1];
}

const daysFormatter = (days: number) => {
  if (days < 21) {
    return days + " jours";
  } else if (days < 60) {
    let week = Math.trunc(days / 7);
    let remain = days - week * 7;
    if (remain > 0) {
      return week + " semaines et " + remain + " jours";
    } else {
      return week + " semaines";
    }
  } else {
    let month = Math.trunc(days / 30);
    let remain = days - month * 30;
    if (remain > 0) {
      return month + " mois et " + remain + " jours";
    } else {
      return month + " mois";
    }
  }
}

/**** Components ****/
const Harvest = (props: { vegeArg: T_Vegetable }) => {
  const vege = props.vegeArg;

  if (vege.harvest.after_d.length == 1) {
    return (
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#C8E7C0" }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>3</Text>
        </View>
        <View style={{ flex: 8, alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", color: "#71AB5F" }}>Recolter</Text>
          <Text>Après {daysFormatter(vege.harvest.after_d[0])}</Text>
        </View>
      </View >
    );
  } else {
    return (
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#C8E7C0" }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>3</Text>
        </View>
        <View style={{ flex: 8, alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", color: "#71AB5F" }}>Recolter</Text>
          <Text>Après de {daysFormatter(vege.harvest.after_d[0])} à {daysFormatter(vege.harvest.after_d[1])}</Text>
        </View>
      </View >
    );
  }
}

const Planting = (props: { vegeArg: T_Vegetable }) => {
  const vege = props.vegeArg;

  if (vege.planting !== undefined) {
    return (
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#FDD3EC" }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>2</Text>
        </View>
        <View style={{ flex: 8, alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", color: "#F872DF" }}>Planter</Text>
          <Text>Les plants avec {vege.planting.when_txt}</Text>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontWeight: "bold" }}>Entre les plants</Text>
              <Text>{vege.planting.plants_cm} cm</Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontWeight: "bold" }}>Entre les rangées</Text>
              <Text>{vege.planting.rows_cm} cm</Text>
            </View>
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <Text>Something wrong happens, SORRY !!!</Text>
    );
  }
}

const SowInCups = (props: { vegeArg: T_Vegetable }) => {
  const vege = props.vegeArg;

  if (vege.sowInCups !== undefined) {
    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#CCDCFF" }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>1</Text>
          </View>
          <View style={{ flex: 8, alignItems: "center" }}>
            <Text style={{ fontWeight: "bold", color: "#738AFF" }}>Semer en godets</Text>
            <Text>De {monthFromNumber(vege.sowInCups.when_m[0])} à {monthFromNumber(vege.sowInCups.when_m[1])}</Text>
            <Text>{daysFormatter(vege.sowInCups.before_d)} avant la plantation</Text>
            <Text style={{ fontWeight: "bold" }}>Profondeur de la graine</Text>
            {vege.sowInCups.depth_cm.length > 1 && <Text>de {vege.sowInCups.depth_cm[0]} à {vege.sowInCups.depth_cm[1]} cm</Text>}
            {vege.sowInCups.depth_cm.length == 1 && <Text>{vege.sowInCups.depth_cm[0]} cm</Text>}
          </View>
        </View>
        {vege.planting !== undefined && <Planting vegeArg={vege} />}
      </View>
    );
  } else {
    return (
      <Text>Something wrong happens, SORRY !!!</Text>
    );
  }
}
const Thinning = (props: { vegeArg: T_Vegetable }) => {
  const vege = props.vegeArg;

  if (vege.thinning !== undefined) {
    return (
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#FFD6D6" }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>2</Text>
        </View>
        <View style={{ flex: 8, alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", color: "#FFB17C" }}>Éclaircir</Text>
          <Text>Des plants avec {vege.thinning.when_txt}</Text>
          {vege.thinning.plants2_cm == undefined &&
            <Text>{vege.thinning.plants1_cm} cm entre les plants</Text>
          }
          {vege.thinning.plants2_cm !== undefined &&
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ fontWeight: "bold" }}>Une première fois</Text>
                <Text>{vege.thinning.plants1_cm} cm entre les plants</Text>
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ fontWeight: "bold" }}>Une seconde fois</Text>
                <Text>{vege.thinning.plants2_cm} cm entre les plants</Text>
              </View>
            </View>
          }
        </View>
      </View >
    );
  } else {
    return (
      <View>
        <Text>Pas besoin d'éclaircir (normalement, je ne m'affiche pas)</Text>
      </View>
    );
  }
}

const RowSpacing = (props: { vegeArg: T_Vegetable }) => {
  const vege = props.vegeArg;

  if (vege.sowDirectly !== undefined) {
    if (vege.sowDirectly.plants_cm !== undefined) {
      return (
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontWeight: "bold" }}>Entre les plants</Text>
            <Text>{vege.sowDirectly.plants_cm} cm</Text>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontWeight: "bold" }}>Entre les rangées</Text>
            <Text>{vege.sowDirectly.rows_cm} cm</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontWeight: "bold" }}>Entre les rangées</Text>
          <Text>{vege.sowDirectly.rows_cm} cm</Text>
        </View>
      );
    }
  } else {
    return (
      <Text>Something wrong happens, SORRY !!!</Text>
    );
  }
}

const SowDirectly = (props: { vegeArg: T_Vegetable }) => {
  const vege = props.vegeArg;

  if (vege.sowDirectly !== undefined) {
    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#DFEBFF" }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>1</Text>
          </View>
          <View style={{ flex: 8, alignItems: "center" }}>
            <Text style={{ fontWeight: "bold", color: "#738AFF" }}>Semer en place</Text>
            <Text>De {monthFromNumber(vege.sowDirectly.when_m[0])} à {monthFromNumber(vege.sowDirectly.when_m[1])}</Text>
            <Text style={{ fontWeight: "bold" }}>Profondeur de la graine</Text>
            {vege.sowDirectly.depth_cm.length > 1 && <Text>de {vege.sowDirectly.depth_cm[0]} à {vege.sowDirectly.depth_cm[1]} cm</Text>}
            {vege.sowDirectly.depth_cm.length == 1 && <Text>{vege.sowDirectly.depth_cm[0]} cm</Text>}
            <RowSpacing vegeArg={vege} />
          </View>
        </View>
        {vege.thinning !== undefined && <Thinning vegeArg={vege} />}
      </View>
    );
  } else {
    return (
      <Text>Something wrong happens, SORRY !!!</Text>
    );
  }
}

const VegetableDescription = (vege: T_Vegetable) => {
  return (
    <View>
      {vege.sowDirectly !== undefined && <SowDirectly vegeArg={vege} />}
      {vege.sowInCups !== undefined && <SowInCups vegeArg={vege} />}
      <Harvest vegeArg={vege} />
    </View>
  )
}

const ColorButton = (props: { vegeArg: T_Vegetable, year: number }) => {
  const [isSelected, setIsSelected] = useState(false);
  const vege = props.vegeArg;
  let vegetableList: string[] = [];

  const updateVegetableList = async (year: number) => {
    //AsyncStorage.clear();
    const selectedJSON = await AsyncStorage.getItem(getSelectedVegetablesKey(year));
    if (selectedJSON !== null) {
      vegetableList = JSON.parse(selectedJSON)["selected"];
      console.log(vege.name + "(" + props.year + "): " + vegetableList);
    }
  }

  useEffect(() => {
    const initButton = async (year: number) => {
      await updateVegetableList(year);
      if (vegetableList.includes(vege.name)) {
        setIsSelected(true);
      } else {
        setIsSelected(false);
      }
    }

    initButton(props.year);
  });


  const selectVegetable = async () => {
    await updateVegetableList(props.year);
    if (isSelected) {
      setIsSelected(false);
      const idx = vegetableList.indexOf(vege.name);
      vegetableList.splice(idx, 1);
    } else {
      setIsSelected(true);
      vegetableList.push(vege.name);
    }
    console.log(vege.name + ": setItem");
    AsyncStorage.setItem(getSelectedVegetablesKey(props.year), JSON.stringify({ "selected": vegetableList }));
  }

  if (isSelected) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#4B7E59", margin: 2 }}>
        <Pressable onPress={() => selectVegetable()}>
          <Text style={{ color: "white" }}>Retirer</Text>
        </Pressable>
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#D1D9D5", margin: 2 }}>
        <Pressable onPress={() => selectVegetable()}>
          <Text style={{ color: "#686868" }}>Sélectionner</Text>
        </Pressable>
      </View>
    );
  }
}

const VegetableView = (props: { vegeArg: T_Vegetable, year: number }) => {
  const [isExpanded, setExpanded] = useState(false);
  const vege = props.vegeArg;
  let bgColor;
  switch (vege.family.toLowerCase()) {
    case "apiacées":
      bgColor = "#FFD8C8";
      break;
    case "astéracées":
      bgColor = "#C8FFD6";
      break;
    case "brassicacées":
      bgColor = "#FBBCBF";
      break;
    case "chénopodiacées":
      bgColor = "#FFC8FE";
      break;
    case "cucurbitacées":
      bgColor = "#ADD8B3";
      break;
    case "fabacées":
      bgColor = "#ADD8D7";
      break;
    case "liliacées":
      bgColor = "#FFFCCE";
      break;
    case "poacées":
      bgColor = "#ADADD8";
      break;
    case "solanacées":
      bgColor = "#AB94A2";
      break;
    default:
      bgColor = "#EEEEEE";
  };

  return (
    <View>
      <Pressable style={[styles.vegetable, { backgroundColor: bgColor }]} onPress={() => { setExpanded(!isExpanded) }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 3, justifyContent: "center", alignItems: "center" }}>
            <Text>{vege.name}</Text>
            <Text>{vege.family}</Text>
          </View>
          <ColorButton vegeArg={vege} year={props.year} />
        </View>
      </Pressable >
      {isExpanded &&
        <View>
          {VegetableDescription(vege)}
        </View>
      }
    </View >
  );
}

const Selection = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const renderItem = ({ item }: { item: T_Vegetable }) => (
    <VegetableView vegeArg={item} year={selectedYear} />
  );

  return (
    <View style={{ flex: 1 }}>
      <Text>Les légumes de ton jardin</Text>
      <YearSelector keyArg={getSelectedVegetablesKey(selectedYear)} setYear={setSelectedYear} />
      <FlatList<T_Vegetable>
        data={VegetableList}
        renderItem={renderItem}
        keyExtractor={item => item.name}
        style={{ marginBottom: 30 }}
      />
    </View>
  );
}

export default Selection;