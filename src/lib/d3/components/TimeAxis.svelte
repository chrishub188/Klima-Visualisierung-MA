<script lang="ts">
  import * as d3 from "d3";
  import { getContext } from "svelte";
  export let xScale;
  export let strokeWidth = 2;
  export let numberOfTicks = 8;
  let formatTick = (d) => getDay(d);

  //Export as prop as alternative
  const { dimensions: dimensionsStore } = getContext("Chart");
  $: dimensions = $dimensionsStore;
  $: ticks = xScale.ticks(numberOfTicks);

  function getDay(date) {
    const weekdaysInGerman = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    
    const dayNumber = date.getDay(); // Get the day of the week (0-6)
    
    return weekdaysInGerman[dayNumber]; // Return the abbreviated German day 
}
</script>

<g class="x_axis" transform={`translate(0,${dimensions.boundedHeight})`}>
  <!-- Axis-Line -->
  <line class="x_axis_line" x1={0} x2={dimensions.boundedWidth} y1={0} y2={0} />
  {#each ticks as tick}
    <!-- Textlabel for each tick -->
    <text
      class="x_axis_tick_label"
      x={xScale(tick)}
      y={25}
      color="#E6E0E9"
      fill="#E6E0E9"
      text-anchor={"middle"}
      dominant-baseline={"middle"}
      >{formatTick(new Date(tick))}
    </text>
    <!--Marker-Line for each tick -->
    <line
      class="x_axis_tick_line"
      x1={xScale(tick)}
      x2={xScale(tick)}
      y1={0}
      y2={10}
    />
  {/each}
</g>

<style lang="scss">
  .x_axis_line {
    stroke: #e7e7e7;
    stroke-width: 2px;
    transition: all 0.3s ease-out;
  }
  .x_axis_tick_label {
    color: #e7e7e7;
    text-align: center;
    font-family: Montserrat;
    font-size: 0.8em;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
  .x_axis_tick_line {
    stroke: #e7e7e7;
    stroke-width: 2px;
    transition: all 0.3s ease-out;
  }
</style>
