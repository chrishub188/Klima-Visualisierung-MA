<script lang="ts">
  import * as d3 from "d3";
  import { getContext } from "svelte";
  import { dateSelection } from "$lib/stores/persistentStores";

  export let xScale: any;
  export let yScale: any;
  export let strokeWidth = 1.5;
  export let data: any;
  export let xAccessor: any;
  export let yAccessor: any;
  export let yOffestBox = 10;
  export let xOffestBox = 10;
  let colorScale = d3.scaleSequential(d3.interpolateRdBu).domain([36, 10]);
  const format = d3.format(".2");

  let { dimensions: dimensionsStore }: { dimensions: any } = getContext("Chart");
  $: dimensions = $dimensionsStore;

  let selectedDate = new Date("2023-08-23 22:00:00");
  let selectedIndex = 0;
  let selectedDataPoint = { date: new Date("2023-08-23 22:00:00"), avg_temp: 0 };
  let tooltipsVisible = false;
  let bisectRight = d3.bisector(xAccessor).right;

  const isInitialized = () => data && xScale && yScale && dimensions;

  // Update the selection based on coordinates
  function updateSelection(x: number, y: number) {
    if (!isInitialized()) return;

    selectedDate = xScale.invert(x);
    selectedIndex = bisectRight(data, selectedDate);

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

    if (data[selectedIndex]) {
      selectedDataPoint = data[selectedIndex];
      dateSelection.set(new Date(xAccessor(selectedDataPoint)));
    }
  }

  // Mouse events
  function handleMouseMove(event: MouseEvent) {
    const [x, y] = d3.pointer(event);
    updateSelection(x, y);
  }

  function handleMouseEnter() {
    tooltipsVisible = true;
  }

  function handleMouseLeave() {
    // tooltipsVisible = false;
  }

  // Touch events
  function handleTouchStart(event: TouchEvent) {
    event.preventDefault(); // Prevent scrolling while touching the chart
    tooltipsVisible = true;
    const touch = event.touches[0];
    const rect = (event.target as SVGElement).getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    updateSelection(x, y);
  }

  function handleTouchMove(event: TouchEvent) {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = (event.target as SVGElement).getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    updateSelection(x, y);
  }

  function handleTouchEnd(event: TouchEvent) {
    // Optionally hide tooltip after touch end
    // tooltipsVisible = false;
  }

  $: if ($dateSelection && isInitialized()) {
    selectedDate = $dateSelection;
    selectedIndex = bisectRight(data, selectedDate);

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

    if (data[selectedIndex]) {
      selectedDataPoint = data[selectedIndex];
    }

    tooltipsVisible = !!selectedDataPoint;
  }
</script>

{#if xScale && yScale && data && data.length > 0}
  {#if tooltipsVisible && isInitialized() && selectedDataPoint}
    <g class="tooltips" transform={`translate(0,${dimensions.boundedHeight})`}>
      <line
        class="selection_line"
        x1={xScale(xAccessor(selectedDataPoint))}
        x2={xScale(xAccessor(selectedDataPoint))}
        y1={0}
        y2={-dimensions.boundedHeight}
        stroke-width={strokeWidth}
        stroke-linecap={"round"}
      />
    </g>

    <circle
      cx={xScale(xAccessor(selectedDataPoint))}
      cy={yScale(yAccessor(selectedDataPoint))}
      r="5"
      stroke={"#191C20"}
      fill={"#D6604D"}
      stroke-width="3"
    />

    {#if selectedIndex >= data.length / 2}
      <rect
        class="tooltip-box"
        x={xScale(xAccessor(selectedDataPoint)) - xOffestBox - 65}
        y={yScale(yAccessor(selectedDataPoint)) - yOffestBox}
        width={65}
        height={35}
        fill="#444648"
        stroke="none"
        stroke-width="0"
        rx={"4"}
        role="presentation"
      />
      <text
        class="tooltip-box-text"
        x={xScale(xAccessor(selectedDataPoint)) - xOffestBox - 32.5}
        y={yScale(yAccessor(selectedDataPoint)) - yOffestBox + 17.5}
        font-size={"90%"}
        font-family={"Montserrat"}
        font-weight={"700"}
        fill={colorScale(yAccessor(selectedDataPoint))}
        text-anchor={"middle"}
        dominant-baseline={"middle"}
      >
        {format(yAccessor(selectedDataPoint)) + " °C"}
      </text>
    {:else}
      <rect
        class="tooltip-box"
        x={xScale(xAccessor(selectedDataPoint)) + xOffestBox}
        y={yScale(yAccessor(selectedDataPoint)) - yOffestBox}
        width={65}
        height={35}
        fill="#444648"
        stroke="none"
        stroke-width="0"
        rx={"4"}
        role="presentation"
      />
      <text
        class="tooltip-box-text"
        x={xScale(xAccessor(selectedDataPoint)) + xOffestBox + 32.5}
        y={yScale(yAccessor(selectedDataPoint)) - yOffestBox + 17.5}
        font-size={"90%"}
        font-family={"Montserrat"}
        font-weight={"700"}
        fill={colorScale(yAccessor(selectedDataPoint))}
        text-anchor={"middle"}
        dominant-baseline={"middle"}
      >
        {format(yAccessor(selectedDataPoint)) + " °C"}
      </text>
    {/if}
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
  on:mousemove={handleMouseMove}
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  on:touchstart={handleTouchStart}
  on:touchmove={handleTouchMove}
  on:touchend={handleTouchEnd}
  role="presentation"
/>

<style lang="scss">
  .selection_line {
    stroke: #e7e7e7;
  }
  .tooltip-box-text {
    stroke-width: 1;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
</style>