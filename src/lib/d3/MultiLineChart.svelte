<script lang="ts">
  import * as d3 from "d3";
  import "$lib/fonts.css";
  import Chart from "./components/Chart.svelte";
  import Line from "./components/Line.svelte";
  import BarAxis from "./components/BarAxis.svelte";
  import TimeAxis from "./components/TimeAxis.svelte";
  import Gridlines from "./components/Gridlines.svelte";
  import MultiLineTooltips from "./components/MultiLineTooltips.svelte";
  import {districtData} from "$lib/stores/dataStore";
  import {selectedGid} from "$lib/stores/persistentStores";

  // Steps to create a chart
  // 1. Access data x
  // 2. Create dimensions x
  // 3. Draw canvas x
  // 4. Create scales x
  // 5. Draw Data x
  // 6. Draw Peripherals x
  // 7. Set up interaction x

  // 1. Access data
  export let data: any;
  let temperatureAccessor = (d) => +d.avg_temp;
  let petAccessor = (d) => d.avg_pet;
  let timeAccessor = (d) => new Date(d.date);

  // 2. Create dimensions
  let width = 100;
  let height = 300;
  const margins = {
    marginTop: 50,
    marginRight: 30,
    marginBottom: 40,
    marginLeft: 65,
  };
  $: dms = {
    width,
    height,
    ...margins,
    boundedHeight: Math.max(
      height - margins.marginTop - margins.marginBottom,
      0
    ),
    boundedWidth: Math.max(width - margins.marginLeft - margins.marginRight, 0),
  };

  export let gradientId = "lineAreaChartGradient";
  export let gradientColorsArea = ["#323A46", "#25282C"];
  //#2166AC 99.99%
  //ramp(d3.interpolateRgbBasis(["#B2182B" , "#D6604D" ," #F4A582" , "#FDDBC7" , "#D1E5F0" , "#92C5DE", "#4393C3" , "#2166AC"]))
  export let gradientColorsTemperature = [
    "#B2182B",
    "#D6604D",
    " #F4A582",
    "#FDDBC7",
    "#D1E5F0",
    "#92C5DE",
    "#4393C3",
    "#2166AC",
  ];

  //Paramert Chart
  export let barWidth = 10;
  const numberOfTickX = 7;
  const numberOfTickY = 8;
  const numberOfVerticalLines = 7*8;

  export let minTemperature = 10;
  export let maxTemperature = 36;

  let title = "Temperatur";
  let gidAccessor = (d) => d.properties.gid;
  let nameAccesor = (d) => d.properties.name;

  $:if($districtData && $selectedGid && $selectedGid !== null){
    //console.log(gidAccessor($districtData.features[0]));
    const district = $districtData.features.find((d) => gidAccessor(d) === $selectedGid);
    title = "Temperatur: " + nameAccesor(district);
  } else {
    title = "Temperatur:";
  }

  // 4. Create scales
  $: temperatureScale = d3
    .scaleLinear()
    //use predefined min and max values to align with the map
    .domain([minTemperature, maxTemperature])
    //.domain(d3.extent(data, temperatureAccessor) as [number, number])
    .range([dms.boundedHeight, 0])
    .nice();
  $: timeScale = d3
    .scaleTime()
    .domain(d3.extent(data, timeAccessor) as [Date, Date])
    .range([0, dms.boundedWidth]);

  $: scaledAccessorDate = (d) => timeScale(timeAccessor(d));
  $: scaledAccessorTemperature = (d) =>
    temperatureScale(temperatureAccessor(d));

  //No PET!!
  $: scaledAccessorPet = (d) => temperatureScale(petAccessor(d));


  function selectname(gid: number) {
    return data.filter((d) => d.gid === gid);
  }

  async function loadGeoJSON() {
    try {
      const response = await fetch('/path/to/your/data.geojson');
      if (!response.ok) {
        throw new Error('Failed to load GeoJSON');
      }
      geojsonData = await response.json();
      renderMap();
    } catch (err) {
      error = err.message;
    }
  }
</script>

<div
  class="multiline-Container"
  bind:clientWidth={width}
  bind:clientHeight={height}
>
  <Chart dimensions={dms} title={title} displayLogos={true}>
    <Gridlines xScale={timeScale} {numberOfVerticalLines} />
    <BarAxis {barWidth} numberOfTicks={numberOfTickY} yScale={temperatureScale} />
    <TimeAxis xScale={timeScale} numberOfTicks={numberOfTickX} />
    <Line
      {data}
      xAccessor={scaledAccessorDate}
      yAccessor={scaledAccessorTemperature}
      selected={true}
    />
    <!-- No PET enable if needed -->
    <!-- value={filteredItem?.avg_pet || 0} -->
    <!-- <Line
      {data}
      xAccessor={scaledAccessorDate}
      yAccessor={scaledAccessorPet}
      selected={false}
    /> -->
    <MultiLineTooltips
      {data}
      xScale={timeScale}
      yScale={temperatureScale}
      xAccessor={timeAccessor}
      yAccessor={temperatureAccessor}
      y2Accessor={petAccessor}
      yOffsetBox={5}
      xOffsetBox={5}
    />
  </Chart>
</div>

<style lang="scss">
  .multiline-Container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #282c31;
    border-radius: 12px;
  }
</style>
