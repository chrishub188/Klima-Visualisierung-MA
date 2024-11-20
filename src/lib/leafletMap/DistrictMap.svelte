<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import { selectedGid } from "$lib/stores/persistentStores";
  import {
    boundsForDistrict,
    districtImagePathByDate,
  } from "$lib/stores/imageStore";
  import { orientation } from "$lib/stores/orientationStore";

  let mapContainer: HTMLDivElement;
  let map: L.Map;
  let imageOverlay: L.ImageOverlay | null = null;
  let latLngBounds: L.LatLngBounds;
  let resizeObserver: ResizeObserver;
  let messageDiv: HTMLDivElement;
  let messageText = "Wähle einen Bezirk in Mannheim aus";

  $: paddingBottomOffset = $orientation === "portrait" ? 800 : 350;
  $: paddingTop = $orientation === "portrait" ? 250 : 10;
  $: paddingLeftRight = $orientation === "portrait" ? 0 : 0;

  const bboxAccessor = (d) => {
    return L.latLngBounds(d.bbox);
  };

  const fitBoundsWithTopAlign = (bounds: L.LatLngBounds) => {
    if (!map || !mapContainer) return;

    const mapHeight = mapContainer.clientHeight;
    const paddingBottom = mapHeight * (paddingBottomOffset / mapHeight);
    map.fitBounds(bounds, {
      paddingTopLeft: [paddingLeftRight, paddingTop],
      paddingBottomRight: [paddingLeftRight, paddingBottom],
      maxZoom: 20,
    });
  };

  //Resize when switching beween portrait and landscape
  const handleResize = () => {
    if (map && imageOverlay && $boundsForDistrict) {
      const bounds = bboxAccessor($boundsForDistrict);
      imageOverlay.setBounds(bounds);
      fitBoundsWithTopAlign(bounds);
      map.invalidateSize();
    } else if (map && latLngBounds) {
      fitBoundsWithTopAlign(latLngBounds);
      map.invalidateSize();
    }
  };

  // Handle overlay visibility based on selectedGid
  $: if (map) {
    if ($selectedGid === null || $selectedGid === undefined) {
      if (imageOverlay) {
        imageOverlay.remove();
        imageOverlay = null;
      }
    } else {
      // Create overlay if it doesn't exist and we have the required data
      if (!imageOverlay && $districtImagePathByDate && $boundsForDistrict) {
        const bounds = bboxAccessor($boundsForDistrict);
        imageOverlay = L.imageOverlay($districtImagePathByDate, bounds, {
          opacity: 1,
          interactive: true,
        }).addTo(map);
        fitBoundsWithTopAlign(bounds);
      }
    }
  }

  // Handle updates to the image path and bounds
  $: if (
    imageOverlay &&
    $districtImagePathByDate &&
    $boundsForDistrict &&
    $selectedGid != null
  ) {
    imageOverlay.setUrl($districtImagePathByDate).on("error", function (e) {
      if (e.target) {
        e.target.remove();
      }
    });
    const bounds = bboxAccessor($boundsForDistrict);
    imageOverlay.setBounds(bounds);
    fitBoundsWithTopAlign(bounds);
  }

  onMount(() => {
    map = L.map(mapContainer, {
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
      dragging: false,
      zoomSnap: 0.25,
      zoomDelta: 0.25,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    map.attributionControl.addAttribution(
      '&copy; 2024 Stadt Mannheim <a href="https://www.mannheim.de/de/stadt-gestalten/verwaltung/aemter-fachbereiche-eigenbetriebe/kommunale-statistikstelle">Kommunale Statistikstelle</a>'
    );

    latLngBounds = L.latLngBounds([
      [49.46678900361961, 8.479875010343635],
      [49.47193870552258, 8.484272087277922],
    ]);

    // Initial bounds fit
    fitBoundsWithTopAlign(latLngBounds);

    // Set up ResizeObserver for better performance
    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mapContainer);
  });

  onDestroy(() => {
    if (imageOverlay) {
      imageOverlay.remove();
    }
    if (map) {
      map.remove();
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });
</script>

<div class="map-container" bind:this={mapContainer}></div>

{#if $selectedGid === null || $selectedGid === undefined}
  <div class="message-overlay" bind:this={messageDiv}>
    {messageText}
  </div>
{/if}

<div class="dashboard-overlay" class:portrait={$orientation !== "landscape"}>
  <slot name="dashboard"></slot>
</div>

<style lang="scss">
  html,
  body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }

  .map-container {
    width: 100%;
    height: 100vh;
    margin: 0;
    padding: 0;
    position: absolute;
    top: 0;
    left: 0;
    background-color: black;
  }

  .dashboard-overlay {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 1.2em;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1001;
    max-width: 90%;
    display: flex;
    flex-direction: column;
    gap: 0.8em;

    &.portrait {
      transform: translate(-50%, -120%);
    }
  }

  .message-overlay {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.0);
    padding: 1em 2em;
    font-size: 2em;
    pointer-events: none;
    z-index: 1000;
    white-space: nowrap;
    color: #fff;
    text-align: center;
    font-family: Montserrat;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    // Position relative to dashboard in portrait/landscape
    bottom: calc(50% + 4em);

    :global(.portrait) & {
      bottom: calc(100% + 2em);
    }
  }

  :global(.leaflet-tile-container) {
    will-change: transform;
    transform: translateZ(0);
  }
</style>
