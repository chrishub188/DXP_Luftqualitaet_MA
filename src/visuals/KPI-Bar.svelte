<script>
  import { Icon } from "@smui/button";
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import { focusPosition, selectedAirMeasure } from "./store/store.js";

  export let location = "Friedrichsring";
  export let dataset;
  export let borderColor = "";

  300;
  export let barColors = [
    //Gray 1
    "#F0F0F0",
    //Red
    "#e57373",
    //Orange 1
    "#ffdabf",
    //Yellow 1
    "#fff5bf",
    //ligth Green
    "#ebf5df",
    //Dark Green 1
    "#8DCBA0",
  ];

  export let borderColors = [
    //Gray 1
    "#e0e0e0",
    //Red
    "#d7191c",
    //Orange 1
    "#fdae61",
    //Yellow 1
    "#ffd600",
    //ligth Green 1
    "#a6d96a",
    //Dark Green 1
    "#1a9641",
  ];

  // 600
  // export let borderColors = [
  //     //Gray
  //     "#e0e0e0",
  //     //Red
  //     "#e57373",
  //     //Orange
  //     "#ff8a65",
  //     //Yellow
  //     "#fff176",
  //     //ligth Green
  //     "#aed581",
  //     //Dark Green
  //     "#81c784",
  // ];

  export let barStatus = [
    "",
    "sehr schlecht",
    "schlecht",
    "mäßig",
    "gut",
    "sehr gut",
  ];

  //LQI
  $: lqiGesamt = dataset[$focusPosition.index].lqi;
  $: lqiNO2 = dataset[$focusPosition.index].lqiNO2;
  $: lqiPM10 = dataset[$focusPosition.index].lqiPM10;
  $: lqiOzon = dataset[$focusPosition.index].lqiOzon;
  //Values
  $: nO2 = dataset[$focusPosition.index].NO2;
  $: pm10 = dataset[$focusPosition.index].PM10;
  //Ozon data ist not included in dataset!!
  $: ozon = "-";
  $: pm25 = Math.round(dataset[$focusPosition.index].PM25 * 1) / 1;
  $: date = dataset[$focusPosition.index].timestamp;

  const barColorScale = d3.scaleOrdinal().domain(barStatus).range(barColors);
  const borderColorScale = d3
    .scaleOrdinal()
    .domain(barStatus)
    .range(borderColors);

  let germanFormater = d3.timeFormatDefaultLocale({
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["$", ""],
    dateTime: "%a %b %e %X %Y",
    date: "%m/%d/%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: [
      "Sonntag",
      "Montag",
      "Dienstag",
      "Mittwoch",
      "Donnerstag",
      "Freitag",
      "Samstag",
    ],
    shortDays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    months: [
      "Januar",
      "Februar",
      "Mär",
      "April",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember",
    ],
    shortMonths: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mai",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Okt",
      "Nov",
      "Dez",
    ],
  });
  //d3.timer.format = germanFormater.timeFormat;

  // Example datestring: 7. Mai 2022 15 Uhr
  const dateString = d3.timeFormat("%d.");
  const monthstring = d3.timeFormat("%B %Y");
  const timeString = d3.timeFormat("%-H");
  const valueFormater = d3.format("");

  //$: console.log(dataset[$focusPosition]);

  let width;
  const padding = width / 100;

  onMount(() => {
    // console.log("KPI width: " + width);
    //console.log(dataset)
  });
</script>

<div class="chart-container" bind:clientWidth={width}>
  <div
    class="chart-content"
    style={`height:${width*0.2}px; width:${
      width - padding
    }px; background-color: ${barColorScale(
      lqiGesamt
    )}; border: solid 1px;};  border-color: ${borderColorScale(lqiGesamt)};`}
  >
    <div class="title-items">
      <div class="title-location">
        <Icon class="material-icons">place</Icon>
        <div class="location">{location}</div>
      </div>
      <div class="title-date">
        <Icon class="material-icons">today</Icon>
        <div class="date">{dateString(date)}</div>
        <div class="month">{monthstring(date)}</div>
      </div>
      <div class="title-time">
        <Icon class="material-icons">schedule</Icon>
        <div class="time">{timeString(date)}</div>
        <div class="timetext">Uhr</div>
      </div>
      <!-- <div class="title-date">
            </div> -->
    </div>
    <div class="indicator-box">
      <!-- Switch class based on data -->
      <div
        id="indicator-box-left"
        class={$selectedAirMeasure === "NO2"? "selected-indicator" : "indicator"}
        style={`background-color: ${barColorScale(
          lqiNO2
        )}; border-color: ${borderColorScale(lqiNO2)}; `}
        on:click={() => {
          //console.log("NO2 clicked");
          $selectedAirMeasure="NO2";
        }}
      >
        <div class="measure">NO<span class="lower">2</span></div>
        <div class="value">{valueFormater(nO2)}</div>
        <div class="unit">µg/m³</div>
      </div>
      <div
      class={$selectedAirMeasure === "PM10"? "selected-indicator" : "indicator"}
        style={`background-color: ${barColorScale(
          lqiPM10
        )}; border-color: ${borderColorScale(lqiPM10)}`}
        on:click={() => {
          //console.log("PM10 clicked");
          $selectedAirMeasure="PM10";
        }}
      >
        <div class="measure">PM<span class="lower">10</span></div>
        <div class="value">{valueFormater(pm10)}</div>
        <div class="unit">µg/m³</div>
      </div>
      <div
        id="indicator-box-rigth"
        class={$selectedAirMeasure === "PM25"? "selected-indicator" : "indicator"}
        style={`background-color: ${barColorScale(
          lqiOzon
        )}; border-color: ${borderColorScale(lqiOzon)}`}
        on:click={() => {
          //console.log("PM2.5 clicked");
          $selectedAirMeasure="PM25";
        }}
      >
        <div class="measure">PM<span class="lower">2.5</span></div>
        <div class="value">{valueFormater(pm25)}</div>
        <div class="unit">µg/m³</div>
      </div>
    </div>
  </div>
</div>

<!-- <div>{$focusPosition.index}</div> -->
<style lang="scss">
  .chart-content {
    //test remove!!
    //padding: 0.5%;
    //border: 2px solid;
    border-radius: 5px;
    padding: 2%;
  }
  .chart-container {
    padding-top: 2%;
    padding-bottom: 3%;
  }
  .title-items {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    font-size: 0.8rem;
    padding-left: 1%;
    padding-right: 1%;
  }
  .title-location {
    display: flex;
    align-items: center;
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    font-size: 0.5rem;
  }
  .title-date {
    display: flex;
    align-items: center;
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    font-size: 0.5rem;
    width: 7rem;
  }
  .title-time {
    display: flex;
    align-items: center;
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    font-size: 0.5rem;
  }
  :global(.material-icons) {
    font-size: 0.5rem !important;
  }
  .location {
    margin-left: 0.18rem;
  }
  .date {
    margin-left: 0.18rem;
    width: 0.8rem;
  }
  .month {
    width: 4.8rem;
    margin-left: 0.1rem;
  }
  .time {
    margin-left: 0.1rem;
    width: 0.5rem;
    text-align: center;
  }
  .timetext {
    width: 0.8rem;
    margin-left: 0.15rem;
    //text-align: center;
  }
  .indicator-box {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    column-gap: 3.5%;
    height: 80%;
    padding-top: 1.5%;
  }
  .indicator {
    display: flex;
    //border: 2px solid;
    padding: 1%;
    column-gap: 2%;
    align-items: center;
    width: 100%;
    padding: 2%;
    justify-content: center;
    border-radius: 5px;
    border: solid 1px;
  }
  .selected-indicator{
    @extend .indicator;
    border: solid 2px;
  }
  #indicator-box-rigth {
    margin-right: 0.2rem;
  }
  #indicator-box-left {
    margin-left: 0.2rem;
  }
  .measure {
    font-family: "Montserrat", sans-serif;
    font-weight: 700;
    font-size: 0.7rem;
    padding-right: 4%;
  }
  .lower {
    font-size: 40%;
    vertical-align: sub;
    line-height: 1em;
  }

  .value {
    font-family: "Montserrat", sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    padding-left: 0.2rem;
    padding-right: 0.1rem;
    width: 1.4rem;
    text-align: center;
  }
  .unit {
    font-family: "Montserrat", sans-serif;
    font-weight: 700;
    font-size: 0.5rem;
  }
</style>
