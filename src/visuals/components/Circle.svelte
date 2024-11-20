<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";

    export let radius = 130;
    export let circleRadius = 50;
    export let strokeWidth = 2.5;

    export let dataset;
    export let dateAccessor = (d) => {
        return new Date(d.timestamp);
    };
    export let lqiAccessor = (d) => {
        return d.lqi;
    };
    //#fafa46
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

    let avgDays = [];

    let grouped = d3.group(dataset, (d) => dateAccessor(d).getDate());
    //console.log(grouped);
    grouped.forEach((day) => {
        let middleDateIndex = Math.round((day.length - 1) / 2);
        let initial = "";
        let lqiDay = day.reduce((previousValue, currentValue) => {
            return compareLqi(previousValue, lqiAccessor(currentValue));
        }, initial);
        avgDays.push({ date: dateAccessor(day[middleDateIndex]), lqi: lqiDay });
    });
    //console.log(avgDays);

    onMount(() => {
        //console.log(dataset);
    });

    const barColorScale = d3.scaleOrdinal().domain(barStatus).range(barColors);
    $: radiusOffsetScale = d3.scaleLinear().domain([0, 24]).range([0.5, 0]);

    function compareLqi(lqi1, lqi2) {
        const lqiStatus = [
            "",
            "sehr gut",
            "gut",
            "mäßig",
            "schlecht",
            "sehr schlecht",
        ];
        let indexLqi1 = lqiStatus.findIndex((d) => {
            return lqi1 === d;
        });
        let indexLqi2 = lqiStatus.findIndex((d) => {
            return lqi2 === d;
        });
        if (indexLqi1 >= indexLqi2) {
            return lqi1;
        } else {
            return lqi2;
        }
    }

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
</script>

<!-- fill={barColorScale(lqiAvgPerDay[i])} fill-opacity={"5%"} -->
<g class="circle">
    <!-- {#each angleScale.ticks(7) as day} -->
    <!-- {console.log(avgDays)} -->
    {#each avgDays as day, i}
        {#if i == 0}
            <circle
                class="dayCircle"
                r={circleRadius * 0.25}
                stroke={barColorScale(lqiAccessor(day))}
                stroke-opacity={"50%"}
                fill={"none"}
                stroke-width={strokeWidth}
                cx={getXCoordinatesForAngle(angleScale(day.date))}
                cy={getYCoordinatesForAngle(angleScale(day.date))}
            />
        {:else if i == avgDays.length - 1}
            <circle
                class="dayCircle"
                r={circleRadius * 0.49}
                stroke={barColorScale(lqiAccessor(day))}
                stroke-opacity={"50%"}
                fill={"none"}
                stroke-width={strokeWidth}
                cx={getXCoordinatesForAngle(angleScale(day.date))}
                cy={getYCoordinatesForAngle(angleScale(day.date))}
            />
        {:else}
            <circle
                class="dayCircle"
                r={circleRadius}
                stroke={barColorScale(lqiAccessor(day))}
                stroke-opacity={"50%"}
                fill={"none"}
                stroke-width={strokeWidth}
                cx={getXCoordinatesForAngle(angleScale(day.date))}
                cy={getYCoordinatesForAngle(angleScale(day.date))}
            />
        {/if}
    {/each}
</g>

<style>
</style>
