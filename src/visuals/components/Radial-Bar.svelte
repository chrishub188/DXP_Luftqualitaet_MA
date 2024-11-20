<script>
  import { curveBumpX } from "d3";
  import * as d3 from "d3";
  import { onMount } from "svelte";
  import { selectedAirMeasure } from "../store/store.js";

  // 1. Access data
  // 2. Create dimensions
  // 3. Draw canvas
  // 4. Create scales
  // 5. Draw Data
  // 6. Draw Peripherals
  // 7. Set up interaction

  export let innerRadius = 120;
  export let outerRadius = 145;
  let avgRadius = innerRadius + (outerRadius - innerRadius) / 2;

  export let strokeLineCap = "round";
  export let strokeOpacity = "100%";
  // yellow  new #fafa46 old #ffffbf
  export let barColors = [
    "#e0e0e0",
    "#d7191c",
    "#fdae61",
    "#ffd600",
    //"#ffeb3b",
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

  export let dataset;
  export let dateAccessor = (d) => {
    return new Date(d.timestamp);
  };
  //NO2
  export let valueAccessorNO2 = (d) => {
    return d.NO2;
  };
  export let airAccessorNO2 = (d) => {
    return d.lqiNO2;
  };
  //PM10
  export let valueAccessorPM10 = (d) => {
    return d.PM10;
  };
  export let airAccessorPM10 = (d) => {
    return d.lqiPM10;
  };
  //PM2.5
  export let valueAccessorPM25 = (d) => {
    return d.PM25;
  };
  export let airAccessorPM25 = (d) => {
    //No LQI for PM2.5
    return "";
  };
  onMount(() => {
    //console.log("Bar Radius: " + innerRadius)
    //console.log("Selected Measure: " + $selectedAirMeasure);
    //$selectedAirMeasure = "PM10";
    //console.log("Selected Measure: " + $selectedAirMeasure);
  });

  const angleScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, dateAccessor))
    .range([0, Math.PI * 2]);

  const valueScaleNO2 = d3
    .scaleLinear()
    .domain(d3.extent(dataset, valueAccessorNO2))
    .range([innerRadius, outerRadius]);

  const valueScalePM10 = d3
    .scaleLinear()
    .domain(d3.extent(dataset, valueAccessorPM10))
    .range([innerRadius, outerRadius]);

  const valueScalePM25 = d3
    .scaleLinear()
    .domain(d3.extent(dataset, valueAccessorPM25))
    .range([innerRadius, outerRadius]);

  const barColorScale = d3.scaleOrdinal().domain(barStatus).range(barColors);

  const getX2CoordinatesForAngle = (angle, radiusTo, offset = 1) => {
    //X2 = Math.cos(angle - Math.PI / 2) * radiusTo * offset
    //angle = Math.acos(x/radiusTo/offset)+ Math.PI/2
    return Math.cos(angle - Math.PI / 2) * radiusTo * offset;
  };

  const getY2CoordinatesForAngle = (angle, radiusTo, offset = 1) => {
    //Y2 = Math.sin(angle - Math.PI / 2) * radiusTo * offset
    //angle = Math.asin()
    return Math.sin(angle - Math.PI / 2) * radiusTo * offset;
  };

  const getX1CoordinatesForAngle = (angle, radiusTo, offset = 1) => {
    // X1 = Math.cos(angle - Math.PI / 2) * innerRadius * offset
    //angle = Math.acos()
    return Math.cos(angle - Math.PI / 2) * innerRadius * offset;
  };

  const getY1CoordinatesForAngle = (angle, radiusTo, offset = 1) => {
    // Y1 = Math.cos(angle - Math.PI / 2) * innerRadius * offset
    //angle = Math.asin()
    return Math.sin(angle - Math.PI / 2) * innerRadius * offset;
  };

  $: arcgenerator = d3
    .arc()
    .innerRadius(0)
    .outerRadius(120 * 1)
    .startAngle(0 - 0.025)
    .endAngle(Math.PI / 4 + 0.025);
</script>

<g class="bars">
  <!-- <defs>
    <filter id="blur">
      <feGaussianBlur stdDeviation="1 1" />
    </filter>
  </defs> -->
  {#each dataset as entry, i}
    <!-- {entry.lqi} -->
    <!-- {i} -->
    <!-- {console.log("X1/Y1:")}
        {console.log(getX1CoordinatesForAngle(angleScale(dateAccessor(entry))))}
        {console.log(getY1CoordinatesForAngle(angleScale(dateAccessor(entry))))}
        {console.log("X2/Y2:")}
        {console.log(getX2CoordinatesForAngle(angleScale(dateAccessor(entry)),valueScaleNO2(valueAccessorNO2(entry))))}
        {console.log(getY2CoordinatesForAngle(angleScale(dateAccessor(entry)),valueScaleNO2(valueAccessorNO2(entry))))} -->
    <!-- filter="url(#blur)" -->
    <!-- <path class="marker-arc" d={arcgenerator()} ></path> -->
    {#if i < dataset.length - 1}
      {#if $selectedAirMeasure == "NO2"}
        <line
          class="bar"
          id={`bar-${i}`}
          x1={getX1CoordinatesForAngle(angleScale(dateAccessor(entry)))}
          y1={getY1CoordinatesForAngle(angleScale(dateAccessor(entry)))}
          x2={getX2CoordinatesForAngle(
            angleScale(dateAccessor(entry)),
            valueScaleNO2(valueAccessorNO2(entry))
          )}
          y2={getY2CoordinatesForAngle(
            angleScale(dateAccessor(entry)),
            valueScaleNO2(valueAccessorNO2(entry))
          )}
          stroke-opacity={"110%"}
          stroke-linecap={strokeLineCap}
          stroke={barColorScale(airAccessorNO2(entry))}
        />
      {:else if $selectedAirMeasure == "PM10"}
        <line
          class="bar"
          id={`bar-${i}`}
          x1={getX1CoordinatesForAngle(angleScale(dateAccessor(entry)))}
          y1={getY1CoordinatesForAngle(angleScale(dateAccessor(entry)))}
          x2={getX2CoordinatesForAngle(
            angleScale(dateAccessor(entry)),
            valueScalePM10(valueAccessorPM10(entry))
          )}
          y2={getY2CoordinatesForAngle(
            angleScale(dateAccessor(entry)),
            valueScalePM10(valueAccessorPM10(entry))
          )}
          stroke-opacity={strokeOpacity}
          stroke-linecap={strokeLineCap}
          stroke={barColorScale(airAccessorPM10(entry))}
        />
      {:else if $selectedAirMeasure == "PM25"}
        <line
          class="bar"
          id={`bar-${i}`}
          x1={getX1CoordinatesForAngle(angleScale(dateAccessor(entry)))}
          y1={getY1CoordinatesForAngle(angleScale(dateAccessor(entry)))}
          x2={getX2CoordinatesForAngle(
            angleScale(dateAccessor(entry)),
            valueScalePM25(valueAccessorPM25(entry))
          )}
          y2={getY2CoordinatesForAngle(
            angleScale(dateAccessor(entry)),
            valueScalePM25(valueAccessorPM25(entry))
          )}
          stroke-opacity={strokeOpacity}
          stroke-linecap={strokeLineCap}
          stroke={barColorScale(airAccessorPM25(entry))}
        />
      {/if}
    {/if}
  {/each}
  <circle
    class="avgCircle"
    r={innerRadius}
    fill={"none"}
    stroke={"black"}
    stroke-opacity={"20%"}
  />
</g>

<style lang="scss">
  .marker-arc {
    fill: aliceblue;
    opacity: 1%;
  }
  .bar {
    stroke-width: 3px;
  }
  .avgCircle {
    stroke-width: 1px;
  }
</style>
