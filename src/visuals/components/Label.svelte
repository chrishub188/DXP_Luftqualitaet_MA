<script>
  import * as d3 from "d3";
  export let radius = 160;
  import { onMount } from "svelte";

  export let dataset;
  export let labelOffset = 1.001;
  export let dateAccessor = (d) => {
    //Check Date format for Scale
    return new Date(d.timestamp);
  };
  const germanDays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const getDay = (date) => {
    return germanDays[date.getDay()];
  };

  onMount(() => {});

  const dateStringParser = (d) => {
    if (d.getDate() < 10 && d.getMonth() < 10) {
      return `${getDay(d)} 0${d.getDate()}.0${1 + d.getMonth()}`;
    } else if(d.getDate() >= 10 && d.getMonth() < 10){
        return `${getDay(d)} ${d.getDate()}.0${1 + d.getMonth()}`;
    } else if(d.getDate() < 10 && d.getMonth() >= 10){
        return `${getDay(d)} 0${d.getDate()}.${1 + d.getMonth()}`;
    } else {
        return `${getDay(d)} ${d.getDate()}.${1 + d.getMonth()}`;
    }
  };

  const angleScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, dateAccessor))
    .range([0, Math.PI * 2]);

  const getXCoordinatesForAngle = (angle, offset = 1) => {
    return Math.cos(angle - Math.PI / 2) * radius * offset;
  };

  const getYCoordinatesForAngle = (angle, offset = 1) => {
    return Math.sin(angle - Math.PI / 2) * radius * offset;
  };

  //Get the middle of the days
  let avgDays = [];
  let grouped = d3.group(dataset, (d) => dateAccessor(d).getDate());
  //console.log(grouped);
  grouped.forEach((day) => {
    let middleDateIndex = Math.round((day.length - 1) / 2);
    let middleDate = dateAccessor(day[middleDateIndex]);
    avgDays.push(middleDate);
  });
</script>

<!-- 
<g>
    <text x={"0"} y={"-155"} text-anchor="middle">Jetzt</text>
</g> -->

<g class="labels">
  {#each avgDays as day, i}
    {#if i == 0 || i == avgDays.length - 1 || i == 3}
      <g>
        <text
          class="radial-label"
          x={getXCoordinatesForAngle(angleScale(day), 0.95)}
          y={getYCoordinatesForAngle(angleScale(day), 0.95)}
          text-anchor="middle">{dateStringParser(day)}</text
        >
        <!-- <circle
                    cx={getXCoordinatesForAngle(angleScale(day))}
                    cy={getYCoordinatesForAngle(angleScale(day))}
                    r={"2"}
                /> -->
        <!-- <line
                x2={getXCoordinatesForAngle(angleScale(day))}
                y2={getYCoordinatesForAngle(angleScale(day))}
                stroke="black"
            /> -->
      </g>
    {:else}
      <text
        class="radial-label"
        x={getXCoordinatesForAngle(angleScale(day), 1.001)}
        y={getYCoordinatesForAngle(angleScale(day), 1.001)}
        text-anchor="middle">{dateStringParser(day)}</text
      >
      <!-- <circle
                cx={getXCoordinatesForAngle(angleScale(day))}
                cy={getYCoordinatesForAngle(angleScale(day))}
                r={"2"}
            /> -->
    {/if}
  {/each}
</g>

<style lang="scss">
  .radial-label {
    font-size: 0.5em;
    font-family: "Montserrat", sans-serif;
    font-weight: bold;
  }
</style>
