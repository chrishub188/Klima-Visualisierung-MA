<script lang="ts">
  import { onMount } from "svelte";
  import * as d3 from "d3";

  // Components
  import { BeeswarmChart } from "$lib";
  import { KpiTile } from "$lib";
  import { MultiLineChart } from "$lib";

  // Stores
  import { dateSelection, selectedGid } from "$lib/stores/persistentStores";
  import {
    data,
    aggregatedData,
    dataFilteredByDistrict,
    dataFilteredByDate,
    numberOfselectedSensors,
    allSensorsPerDistrict
  } from "$lib/stores/dataStore";

  const beeSwarmTitle = "Ranking Stadtbezirke";

  // Reactive filtered dataset based on selected date
  $: filteredDataset = $data
    ? $data.filter((d: any) => {
        const entryDate = new Date(d.date); // Convert string to Date object
        return entryDate.getTime() === $dateSelection.getTime();
      })
    : [];

  // Find specific item based on selected GID
  $: filteredItem = filteredDataset.length
    ? filteredDataset.find((d: any) => Number(d.gid) === $selectedGid)
    : null;

  // Format time for the headline
  const formatTime = d => d3.timeFormat("%H Uhr")(d).replace(/^0/, '');

  onMount(() => {
    // Set initial selected GID (Lindenhof West, GID 63)
    // $selectedGid = 30;
    // $dateSelection = new Date("2023-08-23 22:00:00");
  });
</script>

<!-- {#if $aggregatedData && $data && $dataFilteredByDate && $selectedGid} -->
{#if $aggregatedData && $data && $dataFilteredByDate}
  <div class="dashboard-grid-container">
    <div class="kpi-column">
      <div class="dashboard-item-kpi">
        <KpiTile
          value={filteredItem?.avg_temp || 0}
          unit={"°C"}
          headline={`Temperatur um ${filteredItem ? formatTime(filteredItem.date) : "N/A"}`}
          active={true}
        />
      </div>
      <div class="dashboard-item-kpi">
        <KpiTile
          value={0}
          unit={"°C"}
          headline={"Physiologisch Äquivalente Temperatur (PET)"}
          active={false}
        />
      </div>
      <div class="dashboard-item-kpi">
         <!-- No PET change if needed -->
        <!-- value={filteredItem?.avg_pet || 0} -->
        <KpiTile 
          value={$numberOfselectedSensors} 
          unit={""} 
          headline={"Anzahl der Klimasensoren"} 
          active={true}
        />
      </div>
    </div>
    <div class="dashboard-item-line">
      <MultiLineChart data={$dataFilteredByDistrict} />
    </div>
    <div class="dashboard-item-beeswarm">
      <BeeswarmChart data={$dataFilteredByDate} title={beeSwarmTitle}/>
    </div>
  </div>
{:else}
  <div>Loading data...</div>
{/if}

<style lang="scss">
  .dashboard-grid-container {
    display: grid;
    grid-template-columns: minmax(200px, 1fr) minmax(500px,4fr) minmax(200px, 1fr);
    gap: 12px;
    height: 100%;
    min-height: 300px;
    padding: 14px;
    box-sizing: border-box;
  }

  .kpi-column {
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 100%;
    row-gap: 8px;
  }

  .dashboard-item-kpi {
    flex: 1;
  }

  .dashboard-item-line {
    height: 100%;
    box-sizing: border-box;
  }

  .dashboard-item-beeswarm {
    height: 100%;
    box-sizing: border-box;
  }
</style>
