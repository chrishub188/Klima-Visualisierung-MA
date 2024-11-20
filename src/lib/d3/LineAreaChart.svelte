<script lang="ts">
  import * as d3 from "d3";
  import "$lib/fonts.css";
  import Chart from "./components/Chart.svelte";
  import Line from "./components/Line.svelte";
  import BarAxis from "./components/BarAxis.svelte";
  import TimeAxis from "./components/TimeAxis.svelte";
  import Gridlines from "./components/Gridlines.svelte";
  import Tooltips from "./components/Tooltips.svelte";

  // Steps to create a chart
  // 1. Access data x
  // 2. Create dimensions x
  // 3. Draw canvas x
  // 4. Create scales x
  // 5. Draw Data x
  // 6. Draw Peripherals
  // 7. Set up interaction

  // 1. Access data
  export let data: any;
  let hourAccessor = (d) => d.hour;
  let temperatureAccessor = (d) => d.avg_temp;
  let nameAccessor = (d) => d.name;
  let gidAccessor = (d) => d.gid;

  // 2. Create dimensions
  let width = 100;
  let height = 300;
  const margins = {
    marginTop: 70,
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
      0,
    ),
    boundedWidth: Math.max(width - margins.marginLeft - margins.marginRight, 0),
  };

  export let gradientId = "lineAreaChartGradient";
  export let gradientColorsArea = ["#323A46", "#25282C"];
  //#2166AC 99.99%
  //ramp(d3.interpolateRgbBasis(["#B2182B" , "#D6604D" ," #F4A582" , "#FDDBC7" , "#D1E5F0" , "#92C5DE", "#4393C3" , "#2166AC"]))
  export let gradientColorsTemperature = ["#B2182B" , "#D6604D" ," #F4A582" , "#FDDBC7" , "#D1E5F0" , "#92C5DE", "#4393C3" , "#2166AC"];

  //Paramert Chart 
  export let barWidth = 10;
  export let numberOfTicks = 8;
  export let numberOfVerticalLines = 40;

  export let minTemperature = 8;
  export let maxTemperature = 48;
  export let minHour = 0;
  export let maxHour = 14;

  // 4. Create scales
  $: temperatureScale = d3
    .scaleLinear()
    .domain([minTemperature, maxTemperature])
    //.domain(d3.extent(fullDataset, temperatureAccessor))
    .range([dms.boundedHeight, 0])
    .nice();
  $: timeScale = d3
    .scaleLinear()
    .domain([minHour, maxHour])
    //.domain(d3.extent(fullDataset, hourAccessor))
    .range([0, dms.boundedWidth]);

  $: scaledAccessorHour = (d) => timeScale(hourAccessor(d));
  $: scaledAccessorTemperature = (d) =>
    temperatureScale(temperatureAccessor(d));
  $: y0AccessorScaled = temperatureScale(temperatureScale.domain()[0]);

</script>

<div
  class="lineAreaChart-Container"
  bind:clientWidth={width}
  bind:clientHeight={height}

>
  <Chart dimensions={dms} title={"Temperature"} displayLogos={true}>
    <BarAxis {barWidth} {numberOfTicks} yScale={temperatureScale} />
    <TimeAxis xScale={timeScale} {numberOfTicks} />
    <Gridlines xScale={timeScale} {numberOfVerticalLines} />
    <Line
      {data}
      type="area"
      xAccessor={scaledAccessorHour}
      yAccessor={scaledAccessorTemperature}
      y0Accessor={y0AccessorScaled}
      selected={true}
    />
    <Line
      {data}
      xAccessor={scaledAccessorHour}
      yAccessor={scaledAccessorTemperature}
      selected={true}
    />
    <Tooltips
      {data}
      xScale={timeScale}
      yScale={temperatureScale}
      xAccessor={hourAccessor}
      yAccessor={temperatureAccessor}
    />
  </Chart>
</div>

<style lang="scss">
  .lineAreaChart-Container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #000000;
    border-radius: 12px;
  }
</style>
