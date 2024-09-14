<script setup>
    import axios from 'axios';
    import { reactive, onMounted } from 'vue'
    import { useTask } from 'vue-concurrency';
    import Mapbox from './Map.vue';

    const US_REGION_CODE = 'US';

    const state = reactive({
        states: [],
        selectedState: null,
        speciesOptions: [],
        selectedSpecies: null,
        observations: [],
    });

    const getRecentObservationsFromRegionTask = useTask(function*(_, region=US_REGION_CODE) {
        try {
            const response = yield axios.get(`http://localhost:5000/observations/${region}`);
            state.speciesOptions = response.data.sort((a, b) => a.comName.localeCompare(b.comName));
        } catch (error) {
            console.log(error);
        }
    });

    const getSpeciesObservationsInRegion = useTask(function*(_, species, region=US_REGION_CODE) {
        try {
            const response = yield axios.get(`http://localhost:5000/species/${species}/region/${region}`);
            state.observations = response.data;
        } catch (error) {
            console.log(error);
        }
    });

    function handleSpeciesSelect(value) {
        state.selectedSpecies = value;
        state.observations = [];
        getSpeciesObservationsInRegion.perform(state.selectedSpecies.speciesCode);
    }

    onMounted(() => {
        getRecentObservationsFromRegionTask.perform();
    })
</script>

<template>
    <section class="BDR-main">
        <div id="layout">
            <Mapbox :observations="state.observations" />
        </div>
        <div class="BDR-main__options">
            <FloatLabel>
                <Dropdown
                    id="species-select"
                    class="w-full"
                    display="chip"
                    filter
                    :loading="getRecentObservationsFromRegionTask.isRunning"
                    :maxSelectedLabels="3"
                    v-bind:model-value="state.selectedSpecies"
                    @update:modelValue="handleSpeciesSelect($event)"
                    :options="state.speciesOptions"
                    optionLabel="comName"
                />
                <label for="species-select">Species</label>
            </FloatLabel>
        </div>
    </section>
</template>

<style>
    .BDR-main {
        display: grid;
        grid-template-columns: 3fr 1fr;
        column-gap: 32px;
        flex: 1;
        max-width: 1400px;
        margin: 32px auto;
    }

    .BDR-main__options {
        display: flex;
        flex-direction: column;
        padding-top: 24px;
        row-gap: 24px;
    }

    #layout {
        display: flex;
        position: relative;
    }
</style>