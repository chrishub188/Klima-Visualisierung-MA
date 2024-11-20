<script lang="ts">
  import * as d3 from "d3";


  /**
   * @type {Iterable<[number, number]>}
   */
  export let data = [];
  export let xAccessor;
  export let yAccessor;
  export let y0Accessor;
  export let interpolation = d3.curveMonotoneX;
  export let style = "";

  $: bandGenerator = d3
    .area()
    .x(xAccessor)
    .y0(y0Accessor)
    .y1(yAccessor)
    .curve(interpolation);

  $: band = bandGenerator(data);

</script>

<path class={"band"} d={band} {style} fill={"rgba(202, 196, 208, 0.20)"}  fill-opacity={"0.2"}/>

<style lang="scss">
  .band {
    transition: all 0.3s ease-out;
  }

  .line {
    fill: none;
    stroke: #e7e7e7;
    stroke-width: 2px;
    stroke-linecap: round;
  }
  .band {
    fill: #e7e7e7;
  }
</style>
