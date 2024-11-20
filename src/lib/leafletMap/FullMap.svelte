<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import { selectedGid } from "$lib/stores/persistentStores";
  import { fullImagePathByDate } from "$lib/stores/imageStore";

  let mapContainer: HTMLDivElement;
  let chartOverlay: HTMLDivElement;
  let pathToGeoJSON = "/data/statistische_bezirke_2020.geojson";
  let defaultGid = 30;
  let map: L.Map;
  let imageOverlay: L.ImageOverlay;
  let geojsonLayer: L.GeoJSON;
  let selectedDistrict: L.Layer | null = null;

  export let bottomBarActive = false;

  const paddingBottomOffset = bottomBarActive ? 380 : 320;
  const paddingTop = 10;
  const paddingLeftRight = 0;

  // Update the map size when the window is resized
  function updateMapSize() {
    const windowHeight = window.innerHeight;
    if (mapContainer) {
      mapContainer.style.height = `${windowHeight}px`;
    }
    if (map) {
      map.invalidateSize();
      const bounds = imageOverlay?.getBounds() || map.getBounds();
      fitBoundsWithTopAlign(bounds);
    }
  }

  // Update the image overlay when path is changing
  $: if (imageOverlay && $fullImagePathByDate) {
    const currentUrl = imageOverlay.options.url;
    const newUrl = $fullImagePathByDate;

    if (currentUrl !== newUrl) {
      imageOverlay.setUrl(newUrl).on("error", function (e) {
        e.target.remove();
      });
    }
  }

  // Update district style when the GID changes
  $: if (geojsonLayer) {
    let newSelectedDistrict: L.Layer | null = null;
    geojsonLayer.eachLayer((layer) => {
      if (layer instanceof L.Path) {
        if ($selectedGid === null || $selectedGid === undefined) {
          // No district selected
          layer.setStyle({
            fillOpacity: 1,
            fillColor: "none",
            color: "#D9D9D9",
            weight: 1,
            opacity: 0.5,
          });
        } else if (layer.feature?.properties.gid === $selectedGid) {
          // Selected district style
          newSelectedDistrict = layer;
          layer.setStyle({
            fillOpacity: 1,
            fillColor: "none",
            color: "#D9D9D9",
            weight: 2,
            opacity: 0.75,
          });
        } else {
          // Unselected district style 
          layer.setStyle({
            fillOpacity: 0.5,
            fillColor: "black",
            color: "#D9D9D9",
            weight: 1,
            opacity: 0.5,
          });
        }
      }
    });
    selectedDistrict = newSelectedDistrict;
  }

  const fitBoundsWithTopAlign = (bounds: L.LatLngBounds) => {
    const mapHeight = window.innerHeight;
    const paddingBottom = mapHeight * (paddingBottomOffset / mapHeight);

    map.fitBounds(bounds, {
      paddingTopLeft: [paddingLeftRight, paddingTop],
      paddingBottomRight: [paddingLeftRight, paddingBottom],
      maxZoom: 18,
    });
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const clickedLayer = geojsonLayer?.getLayers().find((layer) => {
      if (layer instanceof L.Path) {
        return layer.getBounds().contains(e.latlng);
      }
      return false;
    });

    if (clickedLayer) {
      // Clicked on a district
      if (clickedLayer instanceof L.Path) {
        const gid = clickedLayer.feature?.properties.gid;
        $selectedGid = gid;
      }
    } else {
      // Clicked outside districts
      $selectedGid = null;
      geojsonLayer.eachLayer((layer) => {
        if (layer instanceof L.Path) {
          layer.setStyle({
            fillOpacity: 1,
            fillColor: "none",
            color: "#D9D9D9",
            weight: 1,
            opacity: 0.5,
          });
        }
      });
    }
  };

  onMount(async () => {
    window.addEventListener('resize', updateMapSize);
    updateMapSize();

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

    map.on("click", handleMapClick);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }
    ).addTo(map);

    map.attributionControl.addAttribution(
      '&copy; 2024 Stadt Mannheim <a href="https://www.mannheim.de/de/stadt-gestalten/verwaltung/aemter-fachbereiche-eigenbetriebe/kommunale-statistikstelle">Kommunale Statistikstelle</a>'
    );

    let latLngBounds = L.latLngBounds([49.4104, 8.4143], [49.5905, 8.5899]);

    const initialImagePath =
      $fullImagePathByDate || "/images/testimage_light.png";
    imageOverlay = L.imageOverlay(initialImagePath, latLngBounds, {
      opacity: 1,
      interactive: true,
    }).addTo(map);

    try {
      const response = await fetch(pathToGeoJSON);
      if (!response.ok) {
        throw new Error("Failed to fetch GeoJSON file");
      }
      const districts = await response.json();

      function style(feature) {
        return {
          color: "#D9D9D9",
          weight: 1,
          fillOpacity: 0.15,
          opacity: 1,
          fillColor: "black",
        };
      }

      function onEachFeature(feature, layer) {
        layer.on("click", function (e) {
          L.DomEvent.stopPropagation(e);
          const gid = feature.properties.gid;
          $selectedGid = gid;
        });
      }

      geojsonLayer = L.geoJSON(districts, {
        style: style,
        onEachFeature: onEachFeature,
      }).addTo(map);

      // Set default selected district if no GID is currently selected
      if ($selectedGid === undefined) {
        $selectedGid = defaultGid;
      }

      fitBoundsWithTopAlign(latLngBounds);
    } catch (error) {
      console.error("Error loading GeoJSON:", error);
    }
  });

  onDestroy(() => {
    window.removeEventListener('resize', updateMapSize);
    if (map) {
      map.off("click", handleMapClick);
      map.remove();
    }
  });
</script>

<div class="map-container" bind:this={mapContainer}></div>
<div class="chart-overlay" bind:this={chartOverlay}>
  <div class="legend-container">
    <slot name="legend"></slot>
  </div>
  <div class="chart-container">
    <slot name="chart"></slot>
  </div>
  {#if bottomBarActive}
    <div class="logoBar">
      <slot name="logoBar"></slot>
    </div>
  {/if}
</div>

<style lang="scss">
  .map-container {
    width: 100%;
    height: 100vh;
    position: relative;
    background-color: black;
  }

  .chart-overlay {
    position: absolute;
    bottom: 1.5em;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    max-width: 90%;
    width: 1100px;
    display: flex;
    flex-direction: column;
    gap: 0.6em;
  }

  .legend-container {
    width: 100%;
    pointer-events: none;
    z-index: 1;
  }

  .chart-container {
    width: 100%;
  }

  .logoBar {
    width: 100%;
  }
</style>