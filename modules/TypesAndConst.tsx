/**** Types ****/
export type T_Bed = {
    //Number to identify the bed
    id: number;
    // The horizontal lenght in cm
    hLength: number;
    // The vertical length in cm
    vLenght: number;
    // The x coordinate
    x: number;
    // The y coordinate
    y: number;
};

/* Family Names
enum vegeFamily {
  Asteraceae, Brassicaceae, Chenopodiaceae, Cucurbitaceae, Fabaceae,
  Liliaceae, Poaceae, Solanaceae, Umbelliferae
}
 */
export type T_Vegetable = {
    name: string,
    family: string,
    sowDirectly?: {
        when_m: number[],
        depth_cm: number[],
        rows_cm: number,
        plants_cm?: number
    },
    thinning?: {
        when_txt: string,
        plants1_cm: number,
        plants2_cm?: number
    },
    sowInCups?: {
        when_m: number[],
        before_d: number,
        depth_cm: number[],
        nb_seeds: number[]
    },
    planting?: {
        when_txt: string,
        plants_cm: number,
        rows_cm: number
    }
    harvest: {
        after_d: number[]
    }
}

/**** Global Constants ****/
// The storage key that leads to the list of the beds
const BED_LIST = "beds";
// The storage key that leads to the list of the selected vegetables
const SELECTED_VEGETABLES = "YEAR-selectedVegetables";
// The storage key that leads to the list of vegetables associated to the beds
const BED_COMPOSITION = "YEAR-bedCompositions";

export const getBedListKey = (): string => {
    return BED_LIST;
}

export const getSelectedVegetablesKey = (year: number) => {
    return SELECTED_VEGETABLES.replace("YEAR", String(year));
}

export const getBedCompositionKey = (year: number) => {
    return BED_COMPOSITION.replace("YEAR", String(year));
}
