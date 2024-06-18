<script setup>
    import axios from 'axios';
    import { reactive, onMounted } from 'vue'
    import { useTask } from 'vue-concurrency';
    import Mapbox from './Map.vue';

    const state = reactive({
        states: [],
        selectedState: null,
        speciesOptions: [],
        selectedSpecies: null,
    });

    const getStatesTask = useTask(function*() {
        try {
            const response = yield axios.get('http://localhost:5000/states');
            state.states = response.data;
        } catch (error) {
            console.log(error);
        }
    });

    const getRecentObservationsFromRegionTask = useTask(function*(_, region) {
        try {
            const response = yield axios.get(`http://localhost:5000/observations/${region}`);
            state.speciesOptions = response.data;
        } catch (error) {
            console.log(error);
        }
    });

    const getSpeciesObservationsInRegion = useTask(function*(_, species, region) {
        try {
            const response = yield axios.get(`http://localhost:5000/species/${species}/region/${region}`);
            const observations = response.data;
            console.log(observations);
        } catch (error) {
            console.log(error);
        }
    });

    function handleStateSelect(value) {
        state.selectedState = value;
        getRecentObservationsFromRegionTask.perform(state.selectedState.code); //selectedState can be null
    }

    function handleSpeciesSelect(value) {
        state.selectedSpecies = value;
        getSpeciesObservationsInRegion.perform(state.selectedSpecies.speciesCode, state.selectedState.code);
    }

    onMounted(() => {
        getStatesTask.perform();
    })
</script>

<template>
    <div>
        <FloatLabel>
            <Dropdown
                inputId="region-dropdown"
                v-bind:model-value="state.selectedState"
                @update:modelValue="handleStateSelect($event)"
                :options="state.states"
                optionLabel="name"
                class="w-full"
            />
            <label for="region-dropdown">Region</label>
        </FloatLabel>

        <FloatLabel>
            <MultiSelect
                id="species-multiselect"
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
            <label for="species-multiselect">Species</label>
        </FloatLabel>
    </div>
    <div id="layout">
        <Mapbox />
    </div>
</template>

<style>
    #layout {
        flex: 1;
        display: flex;
        position: relative;
    }
</style>