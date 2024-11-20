<script lang="ts">
  import { forceSimulation, forceX, forceY, forceCollide } from "d3-force";
  import { onMount, onDestroy } from "svelte";
  import * as d3 from "d3";

  // Props
  export let data = [];
  export let selectedDate = new Date();
  export let xAccessor;
  export let yAccessor = (d) => d.avg_temp;
  export let colorScale;
  export let dotRadius = 3;
  export let simulationRadius = 0.5;
  export let selectedGid;
  export let gidAccessor;
  export let width; // Passed in dynamically
  export let height; // Passed in dynamically

  // Nodes array to store the positions of dots
  let nodes: any[] = [];

  // Scales for positioning dots, updated dynamically with width and height
  $: xScale = d3.scaleLinear().domain([0, 1]).range([0, width]);
  $: yScale = d3.scaleLinear().domain([10, 36]).range([height, 0]);
  $: yAccessorScaled = (d: any) => yScale(yAccessor(d));

  // Initialize the force simulation
  let simulation: d3.Simulation<any, undefined>;

  function initializeSimulation() {
  simulation = forceSimulation(data)
    .force("x", forceX().x(xScale(0.5)).strength(0.05))
    .force("y", forceY().y(yAccessorScaled).strength(0.8))
    .force("collide", forceCollide().radius(dotRadius))
    .alpha(0.2) // Start with a lower alpha to smooth out movement
    .alphaDecay(0.04) // Controls how fast the simulation cools
    .alphaMin(0.001) // Minimum alpha before stopping the simulation
    .on("tick", () => {
      nodes = simulation.nodes(); // Update node positions
    })
    .on("end", () => {
      console.log("Simulation ended");
      simulation.stop(); // Stop the simulation explicitly
    });

  simulation.restart();
}


  // Watch for changes in data, width, height, or key props
  $: {
    if (data.length > 0 && width && height) {
      // Reuse previous node positions to avoid dots flying in
      const prevNodes = nodes;

      // Initialize new nodes with their old positions if available
      nodes = data.map((d, i) => {
        const prevNode = prevNodes[i];
        return prevNode
          ? { ...prevNode, ...d } // Keep the previous positions if available
          : { ...d, x: xScale(0.5), y: yAccessorScaled(d) }; // Start close to final position
      });

      simulation
        .nodes(nodes)
        .force("collide", forceCollide().radius(dotRadius))
        .alpha(0.2) // Re-init alpha for restarting the simulation
        .restart();
    }
  }

  $: {
  if (data.length > 0 && width && height) {
    // Logic to update nodes goes here
    simulation.nodes(nodes).alpha(0.2).restart();

    // Stop the simulation after data update is done
    setTimeout(() => {
      if (simulation.alpha() < 0.01) {
        simulation.stop();
      }
    }, 1000); // Delay gives time for simulation to settle
  }
}


  onMount(() => {
    initializeSimulation();
  });

  // Clean up simulation when component is destroyed
  onDestroy(() => {
    simulation?.stop();
  });
</script>

<!-- SVG element rendering circles -->
<g class="dot-swarm">
  {#each nodes as entry, i}
    {#if gidAccessor(entry) == selectedGid}
      <circle
        class="selected-dot"
        cx={entry.x}
        cy={entry.y}
        r={dotRadius}
        fill={colorScale(yAccessor(entry))}
      />
    {:else}
      <circle
        class="non-selected-dot"
        cx={entry.x}
        cy={entry.y}
        r={dotRadius}
        fill={colorScale(yAccessor(entry))}
      />
    {/if}
  {/each}
</g>

<style lang="scss">
  .non-selected-dot {
    opacity: 0.5;
  }
  .selected-dot {
    opacity: 1;
  }
</style>
