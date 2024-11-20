<script lang="ts">
  import * as d3 from "d3";
  import "$lib/fonts.css";
  import Chart from "./components/Chart.svelte";
  import DotSwarm from "./components/DotSwarm.svelte";
  import BeeswarmAxis from "./components/BeeswarmTimeAxis.svelte";
  import YAxis from "./components/YAxis.svelte";

  import { dateSelection, selectedGid } from "$lib/stores/persistentStores";

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
  export let title: string;
  let minValue = 10;
  let maxValue = 36;
  let dateAccessor = (d: any) => d.date;
  let temperatureAccessor = (d: any) => d.avg_temp;
  let nameAccessor = (d: any) => d.name;
  let gidAccessor = (d: any) => d.gid;

  // 2. Create dimensions
  let width = 200;
  let height = 300;
  const margins = {
    marginTop: 50,
    marginRight: 30,
    marginBottom: 40,
    marginLeft: 60,
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

  $: TemperatureScale = d3
    .scaleLinear()
    .domain([minValue, maxValue])
    .range([dms.boundedHeight, 0])
    .nice();

  $: colorScale = d3
    .scaleSequential(d3.interpolateRdBu)
    .domain([maxValue, minValue]);

</script>

<div class="beeswarm-chart" style="width:{width}; height:{height}">
  <Chart dimensions={dms} {title}>
    <DotSwarm
    {data}
    width={dms.boundedWidth}
    height={dms.boundedHeight}
    selectedDate={new Date()}
    xAccessor={dateAccessor}
    yAccessor={temperatureAccessor}
    {colorScale}
    dotRadius={3}
    simulationRadius={0.3}
    selectedGid={$selectedGid}
    {gidAccessor}
  />
    <BeeswarmAxis date={new Date()} />
    <YAxis
      yScale={TemperatureScale}
      numberOfTicks={6}
      formatTick={(d) => d.toString() + " °C"}
    />
  </Chart>
</div>

<style lang="scss">
  .beeswarm-chart {
    background-color: #282c31;
    border-radius: 12px;
    width: 200px;
    height: 300px;
  }
</style>
