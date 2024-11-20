<script lang="ts">
  import * as d3 from "d3";
  import "$lib/fonts.css";
  import Chart from "./components/Chart.svelte";
  import Line from "./components/Line.svelte";
  import BarAxis from "./components/BarAxis.svelte";
  import TimeAxis from "./components/TimeAxis.svelte";
  import Gridlines from "./components/Gridlines.svelte";
  import Tooltips from "./components/Tooltips.svelte";
  import RangeArea from "./components/RangeArea.svelte";

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
  let timeAccessor = (d: { date: string | number | Date; }) => new Date(d.date);
  let temperatureAccessor = (d) => d.avg_temp;
  let minTemperatureAccessor = (d) => d.min_temp;
  let maxTemperatureAccessor = (d) => d.max_temp;

  // 2. Create dimensions
  export let width = 100;
  export let height = 300;
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
  let numberOfTickX = 7;
  let numberOfTickY = 8;
  export let numberOfVerticalLines = 7*8;

  export let minTemperature = 10;
  export let maxTemperature = 36;
  let title = "Temperatur Mannheim";

  // 4. Create scales
  $: timeScale = d3
    .scaleTime()
    .domain(d3.extent(data, timeAccessor) as [Date, Date])
    .range([0, dms.boundedWidth]);

  $: temperatureScale = d3
    .scaleLinear()
    //.domain(d3.extent(data, temperatureAccessor))
    .domain([minTemperature, maxTemperature])
    .range([dms.boundedHeight, 0])
    .nice();

  //Check if needed or simply use temperatureScale
  $: maxTemperatureScale = d3
    .scaleLinear()
    //.domain(d3.extent(data, temperatureAccessor))
    .domain([minTemperature, maxTemperature])
    .range([dms.boundedHeight, 0])
    .nice();

  //Check if needed or simply use temperatureScale
  $: minTemperatureScale = d3
    .scaleLinear()
    //.domain(d3.extent(data, temperatureAccessor))
    .domain([minTemperature, maxTemperature])
    .range([dms.boundedHeight, 0])
    .nice();

  $: scaledAccessorTime = (d) => timeScale(timeAccessor(d));

  $: scaledAccessorTemperature = (d) =>
    temperatureScale(temperatureAccessor(d));

  $: scaledAccesorMaxTemperature = (d) =>
    maxTemperatureScale(maxTemperatureAccessor(d));

  $: scaledAccessorMinTemperature = (d) =>
    minTemperatureScale(minTemperatureAccessor(d));

  //Move y0 to the bottom of the chart
  $: y0AccessorScaled = temperatureScale(temperatureScale.domain()[0]);

  // Format date range as "20.08.2023 - 27.08.2023"
  function dateFormatter(startDate: Date, endDate: Date) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return `${startDate.toLocaleDateString('de-DE', options)} - ${endDate.toLocaleDateString('de-DE', options)}`;
  }

  let titleWithDate = "";
  $: if (data.length > 0) {
    titleWithDate = title + " " + "("+ dateFormatter(d3.min(data, timeAccessor), d3.max(data, timeAccessor)) + ")";
  }


</script>

<div
  class="lineAreaChart-Container"
  bind:clientWidth={width}
  bind:clientHeight={height}
>
  <Chart dimensions={dms} title={titleWithDate} displayLogos={true}>
    <Gridlines xScale={timeScale} {numberOfVerticalLines} />
    <BarAxis
      {barWidth}
      numberOfTicks={numberOfTickY}
      yScale={temperatureScale}
    />
    <TimeAxis xScale={timeScale} numberOfTicks={numberOfTickX} />
    <RangeArea
      {data}
      xAccessor={scaledAccessorTime}
      yAccessor={scaledAccesorMaxTemperature}
      y0Accessor={scaledAccessorMinTemperature}
    />
    <Line
      {data}
      xAccessor={scaledAccessorTime}
      yAccessor={scaledAccessorTemperature}
      selected={true}
    />
    <Tooltips
      {data}
      xScale={timeScale}
      yScale={temperatureScale}
      xAccessor={timeAccessor}
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
    background-color: #282c31;
    border-radius: 12px;
  }
</style>
