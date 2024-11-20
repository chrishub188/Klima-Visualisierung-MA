<script lang="ts">
  import * as d3 from "d3";
  import { getContext } from "svelte";
  import { dateSelection } from "$lib/stores/persistentStores";

  export let date = new Date();
  const strokeWidth = 2;

  //Export as prop as alternative
  const { dimensions: dimensionsStore } = getContext("Chart");
  $: dimensions = $dimensionsStore;
  $: label = formatDate($dateSelection);

  function formatDate(date) {
    const days = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    const dayName = days[date.getDay()];
    const hours = date.getHours(); // 24-hour format

    return `${dayName} ${hours} Uhr`;
  }
</script>

<g class="x_axis" transform={`translate(0,${dimensions.boundedHeight})`}>
  <!-- Axis-Line -->
  <line class="x_axis_line" x1={0} x2={dimensions.boundedWidth} y1={0} y2={0} />
  <!-- Textlabel for each tick -->
  <text
    class="x_axis_tick_label"
    x={dimensions.boundedWidth / 2}
    y={20}
    color="#E6E0E9"
    fill="#E6E0E9"
    text-anchor={"middle"}
    dominant-baseline={"middle"}
    >{label}
  </text>
</g>

<style lang="scss">
  .x_axis_line {
    stroke: #e7e7e7;
    stroke-width: 2px;
    transition: all 0.3s ease-out;
  }
  .x_axis_tick_label {
    color: #e6e0e9;
    text-align: center;
    font-family: Montserrat;
    font-size: 0.7em;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
</style>
