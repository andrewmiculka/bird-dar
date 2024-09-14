<script setup>
    import { onMounted, watch, computed, reactive } from 'vue'
    import 'primeicons/primeicons.css'
    import * as Plotly from 'plotly.js-dist-min';
    import dayjs from 'dayjs/esm/index.js'

    const mapboxConfig = { mapboxAccessToken: import.meta.env.VITE_MAPBOX_TOKEN };
    const mapDataDefault = {    
            type: 'densitymapbox',
            radius: 6,
            coloraxis: 'coloraxis',
            text: [],
            lon: [],
            lat: [],
        };

    const props = defineProps(['observations']);
    const state = reactive({
        sliderValue: 0,
        isSliderPlaying: false,
        dateScopedObservations: [],
    });

    function playRadar(isPlaying) {
        state.isSliderPlaying = isPlaying;
    }

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
            coloraxis: {colorscale: "Viridis", showscale: false},
            mapbox: {
                style: "outdoors",
                center: { lat: 40, lon: -97 },
                zoom: 3.5
            },
            margin: { r: 0, t: 0, b: 0, l: 0 }
        };

        Plotly.react("map-container", [formattedObservations], layout, mapboxConfig);
    }

    function getDateScopedObservations() {
        return props.observations?.filter(({ obsDt }) => dayjs(obsDt).isSame(dayjs().subtract(state.sliderValue, 'day'), 'day')) ?? [];
    };

    watch(() => props.observations, () => {
            state.sliderValue = 0;
            state.dateScopedObservations = getDateScopedObservations();
        }
    );

    watch(() => state.sliderValue, () => {
        state.dateScopedObservations = getDateScopedObservations();
    });

    watch(() => state.dateScopedObservations, () => {
        plotObservations(state.dateScopedObservations);
    });

    onMounted(() => {
        plotObservations(props.observations);
    });
</script>

<template>
    <div ref="mapContainer" class="map-container" id="map-container"></div>

    <div class="map-overlay">
        <div>
            <h2>Date : {{dayjs().subtract(state.sliderValue, 'days').format('MM/DD/YYYY')}}</h2>
            <Button
                :icon="state.isSliderPlaying ? 'pi pi-pause' : 'pi pi-play'"
                @click="playRadar(!state.isSliderPlaying)"
            />
        </div>
        <Slider
            class="map-overlay__slider"
            :min="0"
            :max="29"
            :step="1"
            v-model="state.sliderValue"
        />
    </div>
</template>

<style>
    .map-overlay {
        position: absolute;
        top: 8px;
        left: 8px;
        width: 25%;
        padding: 16px;
        background-color: var(--surface-50);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        border-radius: 3px;
    }

    .map-overlay h2 {
        line-height: 24px;
        display: block;
    }

    .map-overlay__slider {
        margin: 16px 0 16px;
    }

    .map-container {
        flex: 1;
    }

</style>

