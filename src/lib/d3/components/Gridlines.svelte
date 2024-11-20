<script lang="ts">
    import * as d3 from "d3";
    import { getContext } from "svelte";

    export let xScale;
    export let strokeWidth = 2;
    export let numberOfVerticalLines= 20;

    //Export as prop as alternative
    const { dimensions: dimensionsStore } = getContext("Chart");
    $: dimensions = $dimensionsStore;
    $: ticks = xScale.ticks(numberOfVerticalLines);
</script>

<g class="gridlines" transform={`translate(0,${dimensions.boundedHeight})`}>
    {#each ticks as tick, i}
        <!-- Vertical gridline -->
         <!-- remove zero line -->
        {#if xScale(tick) != 0 }
            <line
                class="vertical-gridline"
                x1={xScale(tick)}
                x2={xScale(tick)}
                y1={0}
                y2={-dimensions.boundedHeight}
            />
        {/if}
    {/each}
</g>

<style lang="scss">
    .vertical-gridline {
        stroke: #343D46;
        stroke-width: 1px;
        transition: all 0.3s ease-out;
    }
</style>
