<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";
    import { focusPosition } from "../store/store.js";

    export let innerRadius = 70;
    export let outerRadius = 100;

    export let strokeColor = "#212121";
    export let strokeWidth = 2;
    export let fill = "none";

    export let dataset;
    export let dateAccessor = (d) => {
        return new Date(d.timestamp);
    };
    export let tempAccessor = (d) => {
        return d.temperature;
    };

    onMount(() => {});

    const valueScale = d3
        .scaleLinear()
        .domain(d3.extent(dataset, tempAccessor))
        .range([innerRadius, outerRadius]);

    //console.log(d3.extent(dataset, tempAccessor));
    //Radius
    $: radiusScale = d3
        .scaleLinear()
        .domain(d3.extent(dataset, tempAccessor))
        //.domain([-30, 42])
        .range([innerRadius, outerRadius]);
    //Umfang
    $: angleScale = d3
        .scaleTime()
        .domain(d3.extent(dataset, dateAccessor))
        .range([0, Math.PI * 2]);

    $: angleScaleDot = d3
        .scaleTime()
        .domain(d3.extent(dataset, dateAccessor))
        .range([0, Math.PI * 2]);
        

    //Line
    $: lineGenerator = d3
        .lineRadial()
        .angle((d) => {
            return angleScale(dateAccessor(d));
        })
        .radius((d) => {
            return radiusScale(tempAccessor(d));
        })
        .curve(d3.curveBasisClosed);

    $: ySelectionValue = getY2CoordinatesForAngle(
        angleScale(dateAccessor(dataset[$focusPosition.index]))
    );
    $: xSelectionValue = getX2CoordinatesForAngle(
        angleScale(dateAccessor(dataset[$focusPosition.index]))
    );
    $: selection = dataset[$focusPosition.index];
    //$: console.log("Index-Line " + $focusPosition.index);

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
</script>

<!-- -30° to +42° celsius color: turbo -->
<g class="line">
    <path
        class="temperature-line"
        d={lineGenerator(dataset)}
        stroke={strokeColor}
        {fill}
        stroke-width={strokeWidth}
    />
    <circle
        class="marker-circle"
        cx={getX2CoordinatesForAngle(
            angleScaleDot(dateAccessor(selection)),
            valueScale(tempAccessor(selection))
        )}
        cy={getY2CoordinatesForAngle(
            angleScaleDot(dateAccessor(selection)),
            valueScale(tempAccessor(selection))
        )}
        fill={strokeColor}
        r="3"
    />
</g>

<style lang="scss">
    .temperature-line {
        stroke-opacity: 70%;
    }
    .marker-circle {
    }
</style>
