import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});

const YearSelector = (props: { fileSuffixArg: string, setYear: (year: number) => void }) => {
    let [years, setYears] = useState<string[]>([]);
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const fileSuffix = props.fileSuffixArg;

    const renderLabel = () => {
        if (value || isFocus) {
            return (
                <Text style={[styles.label, isFocus && { color: 'blue' }]}>
                    Available Years
                </Text>
            );
        }
        return null;
    };

    useEffect(() => {
        const initYears = async () => {
            const currentYear = new Date().getFullYear();
            let existingYears = [];
            const storageKeys = (await AsyncStorage.getAllKeys()).filter(key => key.endsWith(fileSuffix));
            // Create files for the different years
            for (let y = currentYear - 1; y < currentYear + 2; y++) {
                existingYears.push(String(y));
                if (!storageKeys.includes(y + fileSuffix)) {
                    await AsyncStorage.setItem(y + fileSuffix, "{\"selected\": []}");
                }
            }
            setYears(existingYears);
        }

        initYears();
    }, []);

    return (
        <View style={styles.container}>
            {renderLabel()}
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={years.map(s => ({ label: s, value: s }))}
                search={false}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={String(new Date().getFullYear())}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    setValue(item.value);
                    setIsFocus(false);
                    props.setYear(item.value);
                }}
            />
        </View>
    );
};

export default YearSelector;