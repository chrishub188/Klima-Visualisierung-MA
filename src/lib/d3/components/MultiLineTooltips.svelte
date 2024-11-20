<script lang="ts">
  import * as d3 from "d3";
  import { getContext } from "svelte";
  import { dateSelection } from "$lib/stores/persistentStores";
  import Labelbox from "./Labelbox.svelte";

  export let xScale: any;
  export let yScale: any;
  export let strokeWidth = 1.5;
  export let data: any;
  export let xAccessor: any;
  export let yAccessor: any;
  export let y2Accessor: any;
  export let yOffsetBox = 5;
  export let xOffsetBox = 5;
  let boxWidth = 63;
  let boxHeight = 36;
  let colorScale = d3.scaleSequential(d3.interpolateRdBu).domain([36, 10]);
  let temperatureAccessor = (d) => d.avg_temp;
  let petAccessor = (d) => 0;

  //Export as prop as alternative
  let { dimensions: dimensionsStore }: { dimensions: any } =
    getContext("Chart");
  $: dimensions = $dimensionsStore;

  let selectedDate = new Date("2023-08-23 22:00:00");
  let selectedIndex = 0;
  let bisect = d3.bisector(xAccessor).right;
  let selectedDataPoint = { date: new Date("2023-08-23 22:00:00"), avg_pet: 0, avg_temp: 0 };
  let tooltipsVisible = false;
  let isWithinDataRange = true;

  const isInitialized = () => data && xScale && yScale && dimensions;

  $: if ($dateSelection && isInitialized()) {
    selectedDate = $dateSelection;

    selectedIndex = bisect(data, selectedDate);

    if (selectedIndex >= data.length) {
      selectedIndex = data.length - 1;
    }

    if (selectedIndex > 0) {
      const leftDataPoint = data[selectedIndex - 1];
      const rightDataPoint = data[selectedIndex];
      if (
        Math.abs(xAccessor(leftDataPoint) - selectedDate) <
        Math.abs(xAccessor(rightDataPoint) - selectedDate)
      ) {
        selectedIndex--;
      }
    }

    // Only update selectedDataPoint if it exists (to avoid undefined access)
    if (data[selectedIndex]) {
      selectedDataPoint = data[selectedIndex];
    }

    // Ensure tooltips are visible only if there's a valid data point
    tooltipsVisible = !!selectedDataPoint;
  }

  function handleMouseMove(event: MouseEvent) {
    const mousePosition = d3.pointer(event);
    selectedDate = xScale.invert(mousePosition[0]);
    selectedIndex = bisect(data, selectedDate);

    // Check if we should select the previous point instead
    if (selectedIndex > 0) {
      const leftDataPoint = data[selectedIndex - 1];
      const rightDataPoint = data[selectedIndex];
      if (
        Math.abs(xAccessor(leftDataPoint) - selectedDate) <
        Math.abs(xAccessor(rightDataPoint) - selectedDate)
      ) {
        selectedIndex--;
      }
    }
    selectedDataPoint = data[selectedIndex];
    dateSelection.set(new Date(xAccessor(selectedDataPoint)));
  }

  function handleMouseEnter(event: MouseEvent) {
    tooltipsVisible = isWithinDataRange;
    //console.log("Enter");
    //currentMouseEvent = new MouseEvent("");
  }

  function handleMouseLeave(event: MouseEvent) {
    //currentMouseEvent = event;
    //tooltipsVisible = false;
    //console.log("Leave");
    //currentMouseEvent = new MouseEvent("");
  }


</script>

{#if xScale && yScale && data && data.length > 0}
  {#if tooltipsVisible && isInitialized() && selectedDataPoint}
    <circle
      cx={xScale(xAccessor(selectedDataPoint))}
      cy={yScale(yAccessor(selectedDataPoint))}
      r="5"
      stroke={"#191C20"}
      fill={"#D6604D"}
      stroke-width="3"
    />
    {#if selectedIndex >= data.length / 2}
      <Labelbox
        width={boxWidth}
        height={boxHeight}
        xPosition={xScale(xAccessor(selectedDataPoint)) - boxWidth - xOffsetBox}
        yPosition={yScale(yAccessor(selectedDataPoint)) -
          boxHeight -
          yOffsetBox}
        {colorScale}
        {selectedDataPoint}
        labelSelectedAccessor={temperatureAccessor}
        labelNonSelectedAccessor={petAccessor}
        unit={"°C"}
        description={"PET"}
      />
    {:else}
      <Labelbox
        width={boxWidth}
        height={boxHeight}
        xPosition={xScale(xAccessor(selectedDataPoint)) + xOffsetBox}
        yPosition={yScale(yAccessor(selectedDataPoint)) -
          boxHeight -
          yOffsetBox}
        {colorScale}
        {selectedDataPoint}
        labelSelectedAccessor={temperatureAccessor}
        labelNonSelectedAccessor={petAccessor}
        unit={"°C"}
        description={"PET"}
      />
    {/if}
  {/if}
  <rect
    x={0}
    y={0}
    width={dimensions.boundedWidth}
    height={dimensions.boundedHeight}
    fill="transparent"
    stroke="none"
    stroke-width="0"
    role="presentation"
    on:mousemove={handleMouseMove}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
  />
{/if}

<style lang="scss">
  .selection_line {
    stroke: #e7e7e7;
  }
  .tooltip-box {
  }
  .tooltip-box-tex {
    //stroke: #e7e7e7;
    stroke-width: 1;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
</style>
