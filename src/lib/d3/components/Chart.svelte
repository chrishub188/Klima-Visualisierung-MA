<script lang="ts">
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";

  export let dimensions ;
  export let title = "";
  export let displayLogos = false;

  let currentDimensions = writable(dimensions)
  $: {
    currentDimensions.set(dimensions)
  }
  setContext("Chart", {
    dimensions: currentDimensions,
  });

</script>

<svg class="Chart" width={dimensions.width} height={dimensions.height} >
  <text class="chart-title" x={dimensions.marginLeft/4} y={dimensions.marginTop/2}>
    {title}
  </text>
  <g transform={`translate(${dimensions.marginLeft}, ${dimensions.marginTop})`}>
    <slot />
  </g>
</svg>

<style lang="scss">
  .chart-title {
    fill: #e7e7e7;
    text-align: center;
    font-family: Montserrat;
    font-size: 0.8em;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

</style>