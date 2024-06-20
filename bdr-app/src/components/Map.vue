<script setup>
    import { onMounted, watch } from 'vue'
    //import { useTask } from 'vue-concurrency';
    import * as Plotly from 'plotly.js-dist-min';
    //import mapboxgl from 'mapbox-gl';
    //import * as d3 from 'd3';
    //mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    const mapboxConfig = { mapboxAccessToken: import.meta.env.VITE_MAPBOX_TOKEN };
    const mapDataDefault = {    
            type: 'densitymapbox',
            radius: 10,
            coloraxis: 'coloraxis',
            text: [],
            lon: [],
            lat: [],
        };

    const props = defineProps(['observations']);

    function plotObservations(observations) {
        const formattedObservations = observations.reduce((accum, { locName, lng, lat }) => {
            return {
                ...accum,
                text: [...accum.text, locName],
                lon: [...accum.lon, lng],
                lat: [...accum.lat, lat],
            };
        }, mapDataDefault);

        const layout = {
            dragmode: "zoom",
            coloraxis: {colorscale: "Viridis"},
            mapbox: {
                style: "outdoors",
                center: { lat: 31.267153, lon: -97.743057 },
                zoom: 5
            },
            margin: { r: 0, t: 0, b: 0, l: 0 }
        };

        Plotly.react("map-container", [formattedObservations], layout, mapboxConfig);
    }

    watch(
        () => props.observations,
        () => {
            plotObservations(props.observations);
        }
    );

    onMounted(() => {
        plotObservations(props.observations);
    });


                /*
                layers: [
                    {
                        sourcetype: "raster",
                        source: ["https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}"],
                        below: "traces"
                    }
                ],
                */

            /*
            const map = new mapboxgl.Map({
                container: this.$refs.mapContainer,
                style: "mapbox://styles/mapbox/streets-v12", // Replace with your preferred map style
                center: [-97.743057, 30.267153],
                zoom: 5,
            });

            map.addControl(
                new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true,
                    },
                    trackUserLocation: true,
                })
            );

            this.map = map;
            
        },*/
/*
        unmounted() {
            this.map.remove();
            this.map = null;
        }
        
    };*/
</script>

<template>
    <div ref="mapContainer" class="map-container" id="map-container"></div>
</template>

<style>
    .map-container {
        flex: 1;
    }
</style>
