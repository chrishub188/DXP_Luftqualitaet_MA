<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import { Icon } from "@smui/button";
    import { focusPosition } from "./store/store.js";

    export let dataset;
    export let width;
    export let barColors = [
        "#e0e0e0",
        "#d7191c",
        "#fdae61",
        "#ffeb3b",
        "#a6d96a",
        "#1a9641",
    ];
    export let barStatus = [
        "",
        "sehr schlecht",
        "schlecht",
        "mäßig",
        "gut",
        "sehr gut",
    ];

    export let windAccessor = (d) => {
        return d.averageWindDirection;
    };
    export let tempAccessor = (d) => {
        return d.temperature;
    };

    onMount(() => {
        // console.log("Legend-Width : " + width);
        // console.log(dataset);
    });

    $: windDirection = Math.round(
        dataset[$focusPosition.index].averageWindDirection
    );
    $: windlabel = dataset[$focusPosition.index].WindLabel;
    $: temperature = Math.round(dataset[$focusPosition.index].temperature);
    $: precipitation = Math.round(dataset[$focusPosition.index].precipitation*100);

    const valueFormater = d3.format("4");

    const gradient = "";

    //$: console.log("Angle: " + windDirection + "  Direction: " + getAngle(windDirection));

    function getAngle(angle) {
        let dir = Math.round(angle);
        if (angle > 270) {
            return "Nord";
        } else if (angle <= 270 && angle > 180) {
            return "West";
        } else if (angle <= 180 && angle > 90) {
            return "Süd";
        } else if (angle <= 90) {
            return "0st";
        } else {
            return "-";
        }
    }
    
</script>

<div class="radial-chart-legend-wind-temp">

    <!-- Wind -->
    <div class="wind-temp" />
    <!-- transform={`rotate(${windDirection})`} -->
    <svg viewBox="0 0 24 24" fill="#000000" class="icon" >
        <g transform={`rotate(${windDirection})`} transform-origin="center">
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path
                d="M12 7.27l4.28 10.43-3.47-1.53-.81-.36-.81.36-3.47 1.53L12 7.27M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"
            />
        </g>
    </svg>
    <!-- style="background-color: rgb(51, 51, 51,35%);" -->
    <div class="value-name" >Windrichtung</div>
    <div class="value-wind">
        <!-- {valueFormater(windDirection)} -->
        {windlabel}
    </div>
    <div class="unit" />
    <div class="spacer" />

    <!-- Temperature -->
    <Icon class="material-icons" style="font-size: 0.6rem !important;"
        >thermostat</Icon
    >
    <div class="value-name">Temperatur</div>
    <div class="value-temp">
        {valueFormater(temperature)}
    </div>
    <div class="unit">°C</div>
</div>
<!-- Precipitation -->
<!-- style="background-color: rgb(144, 202, 249,70%);" -->
<div class="radial-chart-legend-precipitation">
    <Icon class="material-icons" style="font-size: 0.6rem !important;">water_drop</Icon>
    <div class="value-name">Niederschlag</div>
    <div class="value-rain">{precipitation}</div>
    <div class="unit">mm</div>
</div>

<div class="air-legend">
    <!-- <div class="legend-title" >Luftqualität</div> -->
    {#each barStatus as status, i}
        {#if status === ""}
            <!-- <div class="category-item"> -->
            <div class="dot" style={`background-color: ${barColors[i]}`} />
            <div class="category-text">keine Daten</div>
            <!-- </div> -->
        {:else}
            <!-- <div class="category-item"> -->
            <div class="dot" style={`background-color: ${barColors[i]}`} />
            <div class="category-text">{barStatus[i]}</div>
            <!-- </div> -->
        {/if}
    {/each}
</div>

<style lang="scss">
    .radial-chart-legend-wind-temp {
        display: flex;
        font-size: 0.8rem;
        justify-content: center;
        align-items: center;
        padding-bottom: 2%;
    }
    .icon {
        width: 3%;
        height: 3%;
        padding-right: 0.2%;
    }
    .value-wind {
        font-family: "Montserrat";
        font-weight: 300;
        font-size: 0.7rem;
        font-weight: bold;
        width: 1.1rem;
        text-align: center;
    }
    .value-temp {
        font-family: "Montserrat";
        font-weight: 300;
        font-size: 0.7rem;
        font-weight: bold;
        width: 0.9rem;
        text-align: center;
    }
    .value-rain{
        font-family: "Montserrat";
        font-weight: 300;
        font-size: 0.7rem;
        font-weight: bold;
        width: 0.9rem;
        text-align: center;
        padding-right: 0.2rem;

    }
    .unit {
        font-family: "Montserrat";
        font-weight: 300;
        font-size: 0.6rem;
        padding-left: 0.2rem;
    }
    .value-name {
        font-family: "Montserrat", sans-serif;
        font-weight: 300;
        font-size: 0.5rem;
        margin-right: 0.9%;
        padding: 2px;
        border-radius: 4px;
        background-clip: padding-box;
    }
    .spacer {
        width: 5%;
    }
    .air-legend {
        align-content: center;
        align-items: center;
        flex-direction: row;
        justify-content: center;
        padding: 2%;
        display: flex;
        //border: solid black 1px;
        border-radius: 5px;
        //background-color: #f9fcff;
        //margin-top: 1%;
    }
    .radial-chart-legend-precipitation{
        display: flex;
        font-size: 0.8rem;
        justify-content: center;
        align-items: center;
        padding-bottom: 2%;
    }
    .legend-title{
        font-family: "Montserrat";
        font-weight: 400;
        font-weight: bold;
        font-size: 0.4rem;
        padding-right: 4%;
    }
    .category-item {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
    }
    .category-text {
        font-family: "Montserrat", sans-serif;
        font-weight: 300;
        font-size: 0.5rem;
        padding-left: 1%;
        padding-right: 1.5%;
        white-space: nowrap;
    }
    .dot {
        width: 0.65rem;
        height: 0.65rem;
        border-radius: 50%;
        display: inline-block;
    }
</style>
