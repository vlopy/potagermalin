import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { GestureResponderEvent } from "react-native-modal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { T_Bed } from "./TypesAndConst";

const styles = StyleSheet.create({
  fullpage: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "center"
  },
  garden: {
    width: "80%",
    height: "80%",
    margin: "auto",
    backgroundColor: "lightgreen",
    borderRadius: 20,
  },
  verticalBed: {
    width: "10%",
    height: "4%"
  },
  bedForm: {
    height: 300,
    paddingBottom: 30,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#e4e8e4",
  },
  input: {
    width: 100,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  inputLabel: {
    width: 170,
  },
  formButton: {
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    marginBottom: 10,
    backgroundColor: 'blue',
  },
  cancel: {
    backgroundColor: "red"
  },
  textButton: {
    fontSize: 14,
    letterSpacing: 0.25,
    color: 'white',
  }
});

const Map = () => {
  // Modal panels
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  // Bed information to create the bed
  const [horizontal, setHorizontal] = useState(false);
  const [bedWidth, setBedWidth] = useState("");
  const [bedHeight, setBedHeight] = useState("");
  const [bedX, setBedX] = useState(0);
  const [bedY, setBedY] = useState(0);
  // Bed information to display
  const [InfoId, setInfoId] = useState("");
  const [InfoWidth, setInfoWidth] = useState("");
  const [InfoHeight, setInfoHeight] = useState("");
  // The existing beds
  const [beds, setBeds] = useState<T_Bed[]>([]);
  // Counter to create unique identifier for the beds
  const [bedCounter, setBedCounter] = useState(0);
  // Convert the real bed dimensions in cm to the rectangle dimensions in pixels
  const cmToPix = 4;
  // Coefficient to round the position of the human touch
  const roundCoef = 20;

  const showForm = (evt: GestureResponderEvent) => {
    const x = Math.floor(evt.nativeEvent.locationX / roundCoef) * roundCoef;
    const y = Math.floor(evt.nativeEvent.locationY / roundCoef) * roundCoef;
    setBedX(x);
    setBedY(y);
    setIsFormVisible(true);
  }

  const rectangleDimension = (dimension: number): number => {
    let newDimension = Math.floor(dimension / cmToPix);
    // Set a minimal value to create rectangle large enough to click on it
    if (newDimension < 30) {
      newDimension = 30;
    }
    return newDimension;
  }

  const addBed = async () => {
    const newBed = {
      id: bedCounter + 1, hLength: parseInt(bedWidth), vLenght: parseInt(bedHeight),
      x: bedX, y: bedY
    };
    setBedCounter(bedCounter + 1);

    try {
      const bedsJson = await AsyncStorage.getItem("beds");
      let existingBeds: T_Bed[];
      if (bedsJson == null) {
        existingBeds = [];
      } else {
        existingBeds = JSON.parse(bedsJson);
      }
      existingBeds.push(newBed);
      await AsyncStorage.setItem("beds", JSON.stringify(existingBeds));
      setBeds(existingBeds);
    } catch (e) {
      // Display error message
    }
    setIsFormVisible(false);
  };

  const getBedFromId = async (bedId: number): Promise<T_Bed | null> => {
    try {
      const bedArrayJson = await AsyncStorage.getItem("beds");
      if (bedArrayJson !== null) {
        for (let bed of JSON.parse(bedArrayJson)) {
          if (bed.id == bedId) {
            return bed;
          }
        }
      }
    } catch (e) {
      // TODO error message
    }
    return null;
  }

  const bedInfo = async (event: GestureResponderEvent, bedId: number) => {
    event.stopPropagation();
    const bed = await getBedFromId(bedId);
    if (bed !== null) {
      setInfoId(String(bed.id));
      setInfoHeight(String(bed.vLenght));
      setInfoWidth(String(bed.hLength));
      setIsInfoVisible(true);
    }
  }

  const removeBed = async (bedId: string) => {
    const id = parseInt(bedId);
    const bedsJson = await AsyncStorage.getItem("beds");
    if (bedsJson !== null) {
      let foundId = null;
      const bedArray: T_Bed[] = JSON.parse(bedsJson);
      for (let i = 0; i < bedArray.length; i++) {
        if (bedArray[i].id == id) {
          foundId = i;
        }
      }
      if (foundId !== null) {
        bedArray.splice(foundId, 1);
        await AsyncStorage.setItem("beds", JSON.stringify(bedArray));
        setBeds(bedArray);
      }
    }
    setIsInfoVisible(false);
  }

  useEffect(() => {
    const initBeds = async () => {
      // AsyncStorage.clear();
      const bedsJson = await AsyncStorage.getItem("beds");
      if (bedsJson !== null) {
        const bedArray = JSON.parse(bedsJson);
        setBedCounter(bedArray[bedArray.length - 1].id);
        setBeds(bedArray);
      }
    }

    initBeds();
  }, []);

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", margin: 10 }}>
        Bienvenue dans ton magnifique jardin
      </Text>
      <View style={styles.fullpage}>
        <View style={styles.garden} onTouchEnd={(event) => { showForm(event) }}>
          {
            beds.map((bed, _) => <View key={bed.id} onTouchEnd={(evt) => { bedInfo(evt, bed.id) }} style={{
              position: "absolute", top: bed.y, left: bed.x,
              width: rectangleDimension(bed.hLength), height: rectangleDimension(bed.vLenght),
              backgroundColor: "black", alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ color: "white" }}>{bed.id}</Text>
            </View>)
          }
        </View>
      </View>
      <Modal visible={isFormVisible} transparent={true} animationType={"slide"}>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <View style={styles.bedForm}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Ajout d'une planche</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.inputLabel}>Longueur horizontale (cm)</Text>
              <TextInput keyboardType="numeric" style={styles.input} onChangeText={setBedWidth} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.inputLabel}>Longueur verticale (cm)</Text>
              <TextInput keyboardType="numeric" style={styles.input} onChangeText={setBedHeight} />
            </View>
            <Pressable onPress={addBed} style={styles.formButton}>
              <Text style={styles.textButton}>Ajouter la nouvelle planche</Text>
            </Pressable>
            <Pressable onPress={() => setIsFormVisible(false)} style={[styles.formButton, { backgroundColor: "red" }]}>
              <Text style={styles.textButton}>Annuler</Text>
            </Pressable>
          </View>
        </View>
      </Modal >
      <Modal visible={isInfoVisible} transparent={true} animationType={"slide"}>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <View style={styles.bedForm}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Planche n°{InfoId}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.inputLabel}>Longueur horizontale (cm)</Text>
              <TextInput keyboardType="numeric" style={styles.input} value={InfoWidth} editable={false} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.inputLabel}>Longeur verticale(cm)</Text>
              <TextInput keyboardType="numeric" style={styles.input} value={InfoHeight} editable={false} />
            </View>
            <Pressable onPress={() => { removeBed(InfoId) }} style={[styles.formButton, { backgroundColor: "red" }]}>
              <Text style={styles.textButton}>Supprimer la planche</Text>
            </Pressable>
            <Pressable onPress={() => setIsInfoVisible(false)} style={styles.formButton}>
              <Text style={styles.textButton}>Fermer</Text>
            </Pressable>
          </View >
        </View >
      </Modal >
    </View >
  )
};

export default Map;