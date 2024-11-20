<script lang="ts">
  import * as d3 from "d3";

  export let height = 60;
  export let width = 135;
  const ticks = 8;
  export let unit = "°C";
  export let minValue = 10;
  export let maxValue = 36;

  $: colorScale = d3
    .scaleSequential(d3.interpolateRdBu)
    .domain([maxValue, minValue]);
  $: valueTicks = generateFromToPairs(minValue, maxValue);

  $: [leftHalf, rightHalf] = splitArrayInHalf(valueTicks);

  const formatNumber = (num: number) => num.toFixed(0).padStart(2, '0');

  function generateFromToPairs(min: number, max: number) {
    const step = (max - min) /ticks;

    return Array.from({ length: ticks }, (_, i) => {
      const from = min + i * step;
      const to = min + (i + 1) * step;
      const midpoint = (from + to) / 2; // midpoint between from and to
      return {
        from: Number(from.toFixed(2)),
        to: Number(to.toFixed(2)),
        color: colorScale(midpoint),
      };
    });
  }

  function splitArrayInHalf(array: Array<any>) {
    const middleIndex = Math.ceil(array.length / 2);
    return [array.slice(0, middleIndex), array.slice(middleIndex)];
  }
</script>

<div class="color-legend" style="width:{width}px; height: {height}px;">
  <!-- left column-->
  <div class="column">
    {#each leftHalf as item, i}
      <div class="row">
        <div class="dot" style="background-color: {item.color};"></div>
        <div class="label">{formatNumber(item.from)} – {formatNumber(item.to)} {unit}</div>
      </div>
    {/each}
  </div>
  <!-- right column-->
  <div class="column">
    {#each rightHalf as item, i}
      <div class="row">
        <div class="dot" style="background-color: {item.color};"></div>
        <div class="label">{formatNumber(item.from)} – {formatNumber(item.to)} {unit}</div>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .color-legend {
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    padding: 0.75em 1em;
    align-items: center;
    gap: 1em;
    border-radius: 0.5em;
    background: #282c31;
    min-width: 135px;
    // height: 58px;
  }
  .column {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4em;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 0.25em;
  }
  .dot {
    height: 0.6em;
    width: 0.6em;
    background-color: #ffffff;
    border-radius: 50%;
    display: inline-block;
  }
  .label {
    font-family: Montserrat;
    font-size: 0.5em;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    color: #e6e0e9;
  }
</style>
