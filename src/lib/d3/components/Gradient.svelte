<script lang="ts">
  export let id = "barGradient";
  export let gradientTransform = "rotate(90)";
  export let colors = [
    "#B2182B",
    "#D6604D",
    " #F4A582",
    "#FDDBC7",
    "#D1E5F0",
    "#92C5DE",
    "#4393C3",
    "#2166AC",
  ];
  export let stops = [0, 12, 24, 36, 64, 76, 88, 99.9];
  let gradientType = "linearGradient";

  $: try {
    validateArraySizes();
  } catch (error) {
    console.error("Array size mismatch:", error);
    throw error;
  }

  function validateArraySizes() {
    if (colors.length !== stops.length) {
      throw new Error("The colors and stops arrays must have the same length.");
    }
  }
</script>

<defs>
  <svelte:element this={gradientType} {id} {gradientTransform}>
    {#each colors as color, i}
      <stop offset={stops[i] + "%"} stop-color={color} />
    {/each}
  </svelte:element>
</defs>
