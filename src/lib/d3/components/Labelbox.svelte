<script lang="ts">
  import * as d3 from "d3";

  export let width: any;
  export let height: any;
  export let xPosition: any;
  export let yPosition: any;
  export let colorScale: any;
  export let selectedDataPoint: any;
  export let labelSelectedAccessor: any;
  export let labelNonSelectedAccessor: any;
  export let unit = "";
  export let description = "";
  const format = d3.format(".2");
</script>

<foreignObject x={xPosition} y={yPosition} {width} {height}>
  <div class="labelbox">
    <div class="selected-number">
      {description}
      {format(labelNonSelectedAccessor(selectedDataPoint))}
      {unit}
    </div>
    <div
      class="non-selected-number"
      style="color:{colorScale(labelSelectedAccessor(selectedDataPoint))}"
    >
      {format(labelSelectedAccessor(selectedDataPoint))}
      {unit}
    </div>
  </div>
</foreignObject>

<style lang="scss">
  .labelbox {
    display: flex;
    padding: 0.25em 0.6em;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 0.25em;
    background: #343d46;
  }
  .selected-number {
    color: #cac4d0;
    font-family: Montserrat;
    font-size: 0.5em;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
  .non-selected-number {
    color: #f4a582;
    font-family: Montserrat;
    font-size: 1em;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
</style>
