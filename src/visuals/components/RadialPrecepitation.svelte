<script>
  import * as d3 from "d3";
  import { onMount } from "svelte";

  export let radius = 125;
  export let circleRadius = 10;
  export let strokeWidth = 2;
  export let fill = "#90caf9";
  export let fillOpacity = "50%";
  export let stroke = "#90caf9";

  export let dataset;

  export let dateAccessor = (d) => {
    return new Date(d.timestamp);
  };

  export let precepitationAccessor = (d) => {
    return d.precipitation;
  };

  const angleScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, dateAccessor))
    .range([0, Math.PI * 2]);

  const radiusScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, precepitationAccessor))
    .range([0, circleRadius]);

  const powRadiusScale = d3
    .scalePow()
    .exponent(0.5)
    .domain(d3.extent(dataset, precepitationAccessor))
    .range([0, circleRadius]);

  const getXCoordinatesForAngle = (angle, offset = 1) => {
    return Math.cos(angle - Math.PI / 2) * radius * offset;
  };

  const getYCoordinatesForAngle = (angle, offset = 1) => {
    return Math.sin(angle - Math.PI / 2) * radius * offset;
  };
</script>

<g class="precipitation">
  <!-- r={radiusScale(precepitationAccessor(data))} -->
  {#each dataset as data}
    <!--  -->
    {#if (precepitationAccessor(data)*100) > 0}
      <circle
        cx={getXCoordinatesForAngle(angleScale(dateAccessor(data)))}
        cy={getYCoordinatesForAngle(angleScale(dateAccessor(data)))}
        r={powRadiusScale(precepitationAccessor(data))}
        fill={fill}
        fill-opacity={fillOpacity}
        stroke={stroke}
        stroke-width={strokeWidth}
      />
    {/if}
  {/each}
</g>
