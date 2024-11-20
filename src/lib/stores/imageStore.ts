import { readable, derived, writable } from "svelte/store";
import { json, autoType } from "d3";
import L from "leaflet";
import { selectedGid, dateSelection } from "$lib/stores/persistentStores";

const pathToBounds = "/data/bounding_box_district.json";


interface DistrictBounds {
  name: string;
  gid: number;
  bbox: [[number, number], [number, number]];
  centroid: [number, number];
}


export const allBounds = readable<DistrictBounds[]>([], (set) => {
  const loadData = async () => {
    try {
      const loadedData = await json(pathToBounds);
      const parsedData = (loadedData as DistrictBounds[]).map((d: any) => ({
        name: d["name"],
        gid: +d["gid"],
        bbox: d["bbox"],
        centroid: d["centroid"],
      }));
      set(parsedData);
    } catch (error) {
      console.error("Error loading bounding box csv data:", error);
    }
  };

  loadData();
});

export const boundsForDistrict = derived(
  [allBounds, selectedGid],
  ([$allBounds, $selectedGid]) => {
    return $allBounds.find((d) => d.gid === $selectedGid);
  }
);

export const fullImagePathByDate = derived(dateSelection, ($dateSelection) => {
  const urlPrefix = "/images/maps/full/";
  //const filePrefix = "Tagesgang_TefmoNN_P1P2_rndm_E190-200_P0_Testdaten_";
  //const filePrefix = "Testdaten_";
  const date = createDateString($dateSelection);
  const fileSuffix = ".png";

  //return `${urlPrefix}${filePrefix}${date}${fileSuffix}`;
  return `${urlPrefix}${date}${fileSuffix}`;
});

//Test withoud bounds because only gid is needed 
export const districtImagePathByDate = derived(
  [dateSelection,selectedGid],
  ([$dateSelection,$selectedGid]) => {
    const urlPrefix = "/images/maps/district/";
    const date = createDateString($dateSelection);
    const fileSuffix = ".png";

    return `${urlPrefix}${date}_${$selectedGid}${fileSuffix}`;
  }
);

//2023_08_20_22uhr
function createDateString(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  return `${year}_${month}_${day}_${hour}uhr`;
}

