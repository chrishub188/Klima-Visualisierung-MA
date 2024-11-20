<script lang="ts">
  import { LineAreaRangeChart } from "$lib";
  import { FullMap } from "$lib";
  import { LogoBar } from "$lib";
  import { onMount } from "svelte";

  // Stores
  import { dateSelection, selectedGid } from "$lib/stores/persistentStores";
  import { data, aggregatedData } from "$lib/stores/dataStore";
  import TemperatureLegend from "$lib/d3/TemperatureLegend.svelte";

  const isStoreEmpty = (storeValue: any) => {
    const localStorage = window.localStorage;
    const storedGid = localStorage?.getItem("selected-gid");
    const storedDate = localStorage?.getItem("date-position");

    return !storedGid && !storedDate && !storeValue;
    
  };

  onMount(() => {
    // Set initial selected GID (Lindenhof West, GID 63)
    // $selectedGid = 30;
    // $dateSelection = new Date("2023-08-23 22:00:00");

  });
</script>

{#if $aggregatedData && $data}
  <div class="layout">
    <FullMap bottomBarActive={true}>
      <svelte:fragment slot="chart">
        <LineAreaRangeChart height={230} width={1100} data={$aggregatedData} />
      </svelte:fragment>
      <svelte:fragment slot="legend">
        <TemperatureLegend
          height={58}
          width={125}
          minValue={10}
          maxValue={36}
        />
      </svelte:fragment>
      <svelte:fragment slot="logoBar">
        <LogoBar />
      </svelte:fragment>
    </FullMap>
  </div>
{:else}
  <div class="loading">Loading data...</div>
{/if}

<style lang="scss">
  :global(html),
  :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .layout {
    position: relative;
    width: 100%;
    height: 100vh;
  }

  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
