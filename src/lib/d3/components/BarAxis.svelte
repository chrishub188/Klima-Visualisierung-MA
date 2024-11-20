<script lang="ts">
  import { getContext } from "svelte";
  import Gradient from "./Gradient.svelte";
  
  export let barWidth = 10;
  export let strokeWidth = 2;
  export let yScale;
  export let numberOfTicks = 7;
  export let formatTick = (d) => d.toString() + " °C";
  export let labelXPositionOffset = 0.6;
  export let gradientColors = [
    "#B2182B",
    "#D6604D",
    " #F4A582",
    "#FDDBC7",
    "#D1E5F0",
    "#92C5DE",
    "#4393C3",
    "#2166AC",
  ];
  export let gradientStops = [0, 12, 24, 36, 64, 76, 88, 99.9];

  const { dimensions: dimensionsStore, MouseEvent: mouseEventStore} = getContext("Chart");
  $: mouseEvent = $mouseEventStore;
  $: dimensions = $dimensionsStore;
  $: ticks = yScale.ticks(numberOfTicks);
  $: labelXPosition = -dimensions.marginLeft * labelXPositionOffset;

  //$:console.log(mouseEvent);
</script>

<g class="y_bar_axis">

  <Gradient id="barGradient" gradientTransform="rotate(90)" colors={gradientColors} stops={gradientStops}/>
  <rect
    class="bar"
    x={-barWidth}
    y={0}
    width={barWidth}
    height={dimensions.boundedHeight + strokeWidth / 2}
  />
  <line
    class="Axis_line"
    x1={0}
    x2={0}
    y1={0}
    y2={dimensions.boundedHeight + strokeWidth / 2}
    stroke-width={strokeWidth}
  />
  {#each ticks as tick}
    <!-- Textlabel for each tick -->
    <text
      class="y_bar_axis_tick_label"
      x={labelXPosition}
      y={yScale(tick)}
      color="#E6E0E9"
      fill="#E6E0E9"
      dominant-baseline={"middle"}
    >
      {formatTick(tick)}
    </text>
  {/each}
</g>

<style lang="scss">
  .bar {
    fill: url(#barGradient);
    //fill: linear-gradient(180deg, #B2182B 0%, #D6604D 12%, #F4A582 24%, #FDDBC7 36%, #D1E5F0 64%, #92C5DE 76%, #4393C3 88%, #2166AC 99.99%);
  }
  .Axis_line {
    stroke: #e7e7e7;
    stroke-width: 2px;
  }
  .y_bar_axis_tick_label {
    color: #e7e7e7;
    font-family: Montserrat;
    font-size: 0.5em;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
</style>
