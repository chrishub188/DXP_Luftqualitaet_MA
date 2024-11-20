<script>
  import { onMount } from "svelte";
  import Arc from "./components/Radial-Arc.svelte";
  import Bar from "./components/Radial-Bar.svelte";
  import Line from "./components/Radial-Line.svelte";
  import RadialArrow from "./components/Radial-Arrow.svelte";
  import Label from "./components/Label.svelte";
  import Tooltip from "./components/Tooltip.svelte";
  import * as d3 from "d3";
  import RadialPrecepitation from "./components/RadialPrecepitation.svelte";

  export let dataset;
  export let width;

  //let width;
  $: radius = width / 2;

  //Example device iPhone XR
  $: radiusScale = d3.scaleLinear().domain([0, 195]).range([0, radius]);

  export let colors = [
    "#e0e0e0",
    "#d7191c",
    "#fdae61",
    "#ffd600",
    //"#ffeb3b",
    "#a6d96a",
    "#1a9641",
  ];

  export let status = [
    "",
    "sehr schlecht",
    "schlecht",
    "mäßig",
    "gut",
    "sehr gut",
  ];

  onMount(() => {
    // console.log("Radial-Chart-Width : " + width);
    // console.log("Radial-Chart-Radius : " + radius);
    // console.log(dataset);
    //$focusPosition.index = --dataset.length;
  });
</script>

<!--  bind:clientWidth={width} -->
<div class="chart-container">
  <!-- {radius} -->
  <!-- {radiusScale(radius)} -->
  <!-- square -->
  <!-- viewBox={`0 0 ${width} ${width}`} -->
  <svg id="chart-radial" class="chart-content" height={width} {width}>
    <g transform={`translate(${width / 2},${width / 2})`}>
      <!-- <circle r={140}  fill="none" stroke-width="2" stroke="black"/> -->
      <Arc
        {dataset}
        innerRadius={radiusScale(101)}
        outerRadius={radiusScale(140)}
        fillOpacity={"25%"}
        arcColors={colors}
        arcStatus={status}
      />
      <!-- range 80 - 160 -->
      <Bar
        {dataset}
        innerRadius={radiusScale(105)}
        outerRadius={radiusScale(130)}
        barColors={colors}
        barStatus={status}
        strokeOpacity={"100%"}
      />
      <RadialArrow {dataset} radius={radiusScale(60)} imageDimension={12} />
      <Line
        {dataset}
        innerRadius={radiusScale(70)}
        outerRadius={radiusScale(100)}
        strokeColor={"#212121"}
      />
      <!-- <Grid {dataset} /> -->
      <Label {dataset} radius={radiusScale(165)} />
      <!-- <Circle
                {dataset}
                radius={radiusScale(120)}
                circleRadius={radiusScale(57)}
                strokeWidth={3}
            /> -->
      <Tooltip {dataset} radius={width / 2} radiusLengthOffset={0.85} />
      <RadialPrecepitation 
        {dataset}
        radius={radiusScale(140)}
      />
    </g>
  </svg>
</div>

<style lang="scss">
  .chart-content {
    //test remove!!
    //background-color: #d9ff54;
    overflow-y: hidden;
  }
  .chart-container {
    padding-bottom: 0;
  }
</style>
