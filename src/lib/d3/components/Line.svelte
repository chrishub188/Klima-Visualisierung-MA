<script lang="ts">
  import * as d3 from "d3";

  export let type = "line";
  export let data: any;
  export let xAccessor;
  export let yAccessor;
  export let y0Accessor = 0;
  export let interpolation = d3.curveMonotoneX;
  export let style = "";
  export let selected = false;

  $: lineGenerator = d3[type]().x(xAccessor).y(yAccessor).curve(interpolation);

  $: {
    if (type == "area") {
      lineGenerator.y0(y0Accessor).y1(yAccessor);
    }
  }

  $: line = lineGenerator(data);

</script>

{#if type == "area"}
  <!-- gradientColors = ["rgb(226, 222, 243)", "#f8f9fa"]; 
gradientTransform="rotate(0)" -->
  <defs>
    <linearGradient
      id="areaGradient"
      gradientTransform="rotate(0)"
      x1="0%"
      y1="0%"
      x2="0%"
      y2="100%"
    >
      <stop stop-color="#323A46" stop-opacity="0" />
      <stop offset="1" stop-color="#25282C" />
    </linearGradient>
  </defs>
{/if}
{#if selected}
  <path class={`Line Line-type-${type}-selected`} d={line} {style} />
{:else}
  <path class={`Line Line-type-${type}-not-selected`} d={line} {style} />
{/if}

<style lang="scss">
  .Line {
    transition: all 0.3s ease-out;
    fill: url(#areaGradient);
  }

  .Line-type-line-selected {
    fill: none;
    stroke: #e7e7e7;
    stroke-width: 1.5px;
    stroke-linecap: round;
  }
  .Line-type-area-selected {
    fill: url(#areaGradient);
    stroke-width: 0;
  }
  .Line-type-line-not-selected {
    fill: none;
    stroke: #e6e0e9;
    stroke-width: 1.5px;
    stroke-linecap: round;
  }
  .Line-type-line-not-selected {
    fill: none;
    stroke: #cac4d0;
    stroke-width: 0.5px;
    stroke-linecap: round;
  }
</style>
