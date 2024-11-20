<script lang="ts">
    import { getContext } from "svelte";
    
    export let barWidth = 20;
    export let strokeWidth = 2;
    export let yScale;
    export let numberOfTicks = 7;
    export let formatTick = (d) => d.toString() + " °C";
    export let labelXPositionOffset = 0.5;

    const { dimensions: dimensionsStore, MouseEvent: mouseEventStore} = getContext("Chart");
    $: dimensions = $dimensionsStore;
    $: ticks = yScale.ticks(numberOfTicks);
    $: labelXPosition = -dimensions.marginLeft * labelXPositionOffset;
  </script>
  
  <g class="y_bar_axis">
  
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
  