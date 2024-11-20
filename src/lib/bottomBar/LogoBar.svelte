<script lang="ts">
    import Logo from "./Logo.svelte";
    import Text from "./Text.svelte";
    const prefix = "/images/logos/";
</script>

<!-- <div class="logoBar">
    <Text text="Umsetzung Desing und Konzept:" />
    <Logo src={prefix+"HDIL-Logo.png"} alt="HDIL-logo" />
    <Logo src={prefix+"HS-Logo.png"} alt="HS-logo"/>
    <Text text="Daten:" />
    <Logo src={prefix+"SCM-Logo.png"} alt="SCM-logo" opacity={0.6}/>
    <Logo src={prefix+"MA-Logo.png"} alt="MA-logo"/>
    <Text text="Partner:" />
    <Logo src={prefix+"MVV-Logo.png"} alt="MVV-logo"/>
    <Text text="Gefördert durch:"/>
    <Logo src={prefix+"KFW-Logo.png"} alt="KFW-logo"/>
    <Logo src={prefix+"BWSB-Logo.png"} alt="BWSB-logo"/>
</div> -->


<div class="logoBar">
  <Text text="Projektbeteiligte"/>
  <Logo src={prefix+"HDIL-Logo.png"} alt="HDIL-logo" opacity={1} height={100}/>
  <Logo src={prefix+"HS-Logo.png"} alt="HS-logo" height={80}/>
  <Logo src={prefix+"SCM-Logo.png"} alt="SCM-logo" opacity={0.6}/>
  <Logo src={prefix+"MA-Logo.png"} alt="MA-logo" opacity={0.5} height={70}/>
  <Logo src={prefix+"MVV-Logo.png"} alt="MVV-logo"/>
  <span style="width: 0.8em"/>
  <Text text="Gefördert durch:"/>
  <Logo src={prefix+"KFW-Logo.png"} alt="KFW-logo" opacity={1} height={100} />
  <Logo src={prefix+"BWSB-Logo.png"} alt="BWSB-logo" opacity={1} height={100}/>
</div>
  
  <style lang="scss">
    .logoBar {
      display: flex;
      min-width: 500px;
      height: 1.5em;
      padding:0.4em 0.8em;
      margin: 0.1em;
      align-items: center;
      gap: 0.5em;
      border-radius: 0.5em;
      background: #282c31;
      justify-content: flex-start;
      align-content: center;
      flex-direction: row;
    }
  </style>
  