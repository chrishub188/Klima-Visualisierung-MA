<script lang="ts">
  export let src="";
  export let alt="";
  export let opacity=1;
  export let height=80;
</script>

<img src={src} alt="Logo" class="logo" style="opacity: {opacity}; height: {height+"%"}; "/>

<style lang="scss">
  .logo {
    mix-blend-mode: luminosity;
  }
</style>