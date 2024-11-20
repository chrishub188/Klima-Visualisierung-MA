import { readable, derived } from "svelte/store";
import {json,  csv, autoType, groups, mean } from "d3";
import { selectedGid, dateSelection } from "$lib/stores/persistentStores";

const pathTofullWeek =
  "/data/avg_temp_bezirke_full_week.csv";
const pathToGeoJson = "/data/statistische_bezirke_2020.geojson";
const pathToSensorsPerDistric = "/data/sensors_stat_bezirke.csv";

interface DataRow {
  gid: number;
  name: string;
  date: Date;
  avg_temp: number;
  min_temp: number;
  max_temp: number;
  avg_pet: number;
  min_pet: number;
  max_pet: number;
}

interface SensorRow {
  gid: number;
  id_name: string;
  name: string;
  number_of_devices: number;
}

export const data = readable<DataRow[]>([], async (set) => {
  try {
    const loadedData = await csv(pathTofullWeek, autoType);

    const parsedData = loadedData.map((d: any) => ({
      ...d,
      date: new Date(d.date), // Convert string to Date object
    }));
    set(parsedData);
  } catch (error) {
    console.error("Error loading CSV data:", error);
  }
});

export const aggregatedData = derived(data, ($data) => {
  return aggregate($data);
});

function aggregate(data: DataRow[]) {
  return groups(data, (d: DataRow) => d.date).map(([date, values]) => {
    const avgTemp = mean(values, (d: DataRow) => d.avg_temp);
    const minTemp = mean(values, (d: DataRow) => d.min_temp);
    const maxTemp = mean(values, (d: DataRow) => d.max_temp);
    const avgPet = mean(values, (d: DataRow) => d.avg_pet);
    const minPet = mean(values, (d: DataRow) => d.min_pet);
    const maxPet = mean(values, (d: DataRow) => d.max_pet);

    return {
      date,
      avg_temp: avgTemp ?? 0,
      min_temp: minTemp ?? 0,
      max_temp: maxTemp ?? 0,
      avg_pet: avgPet ?? 0,
      min_pet: minPet ?? 0,
      max_pet: maxPet ?? 0,
    };
  });
}

export const dataFilteredByDistrict = derived(
  [data, selectedGid],
  ([$data, $selectedGid]) => {
    const filtered = $data.filter((d) => d.gid === $selectedGid);
    //return aggregate(filtered);
    return filtered;
  }
);

const dateAccesor = (d: DataRow) => new Date(d.date);

export const dataFilteredByDate = derived(
  [data, dateSelection],
  ([$data, $dateSelection]) => {
    const filtered = $data.filter(
      (d) => dateAccesor(d).getTime() === $dateSelection.getTime()
    );
    //return aggregate(filtered);
    return filtered;
  }
);

//GeoJSON store
export const districtData = readable<any>(null, async (set) => {
  try {
      const loadedGeoJson = await json(pathToGeoJson);
      set(loadedGeoJson);
  } catch (error) {
      console.error("Error loading GeoJSON data:", error);
      set(null);
  }
});



export const allSensorsPerDistrict = readable<SensorRow[]>([], (set) => {
  const loadData = async () => {
    try {
      const loadedData = await csv(pathToSensorsPerDistric, autoType);
      const parsedData = loadedData.map((d: any) => ({
        ...d,
      }));
      set(parsedData);
    } catch (error) {
      console.error("Error loading sensors data:", error);
    }
  };
  loadData()
});

export const numberOfselectedSensors = derived(
  [selectedGid, allSensorsPerDistrict],
  ([$selectedGid, $allSensorsPerDistrict]) => {
    if ($selectedGid) {
      const filtered = $allSensorsPerDistrict
        ? $allSensorsPerDistrict.filter((d: SensorRow) => d.gid === $selectedGid)
        : [];
      return filtered.length > 0 ? filtered[0].number_of_devices : 0;
    } else {
      return $allSensorsPerDistrict
        ? $allSensorsPerDistrict.reduce((sum, d: SensorRow) => sum + d.number_of_devices, 0)
        : 0;
    }
  }
);


