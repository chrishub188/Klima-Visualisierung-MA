<script lang="ts">
  import * as d3 from "d3";
  export let value = 20;
  export let headline = "Personal Experienced Temperature (PET)";
  export let unit = "°C";
  export let minValue = 10;
  export let maxValue = 36;
  export let active = true;
  const colorScale = d3
    .scaleSequential(d3.interpolateRdBu)
    .domain([maxValue, minValue]);
  export let defaultColor = "#E6E0E9";
  let valueFormatted = (d) => d3.format(".0f")(d)
  $: color = colorScale(value);
</script>

<div class="kpi-tile">
  <div class="headline" class:inactive={!active}>{headline}</div>
  {#if unit == ""}
    <div class="number" class:inactive={!active} style="color: {defaultColor};">
      {valueFormatted(value)}
    </div>
  {:else if value <= minValue}
    <div class="number" class:inactive={!active} style="color: {defaultColor};">
      {valueFormatted(value)}
      {unit}
    </div>
  {:else}
    <div class="number" class:inactive={!active} style="color: {color};">
      {valueFormatted(value)}
      {unit}
    </div>
  {/if}
</div>

<style lang="scss">
  .kpi-tile {
    display: flex;
    width: 100%;
    min-width: 180px;
    padding-top: 10px;
    padding-bottom: 12px;
    padding-left: 16px;
    padding-right: 16px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 8px;
    border-radius: 8px;
    background: #282c31;
    height: 100%;
    min-height: 90px;
    box-sizing: border-box;
  }

  .headline {
    color: #e6e0e9;
    font-family: Montserrat;
    font-size: 0.78rem;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    margin: 0;
    transition: opacity 0.2s ease-in-out;

    &.inactive {
      opacity: 0.25;
    }
  }

  .number {
    font-family: Montserrat;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin: 0;
    transition: opacity 0.2s ease-in-out;

    &.inactive {
      opacity: 0.5;
    }
  }
</style>
