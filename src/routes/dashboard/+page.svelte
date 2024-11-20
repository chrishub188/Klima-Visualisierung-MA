<script lang="ts">
  import { onMount } from "svelte";
  import * as d3 from "d3";

  // Components
  import { DistrictMap } from "$lib";
  import { Dashboard } from "$lib";

  // Stores
  import { dateSelection, selectedGid } from "$lib/stores/persistentStores";

  // Format time for the headline
  const formatTime = d3.timeFormat("%H:%M Uhr");
  let width: number;
  let height: number;


  onMount(() => {
    // Set initial selected GID (Lindenhof West, GID 63)
    // $selectedGid = 30;
    // $dateSelection = new Date("2023-08-23 22:00:00");
  });
</script>

<div >
  <DistrictMap>
    <svelte:fragment slot="dashboard">
      <Dashboard />
    </svelte:fragment>
  </DistrictMap>
</div>

<style lang="scss">
</style>
