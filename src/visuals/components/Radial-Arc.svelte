<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";

    export let innerRadius = 60;
    export let outerRadius = 150;
    export let fill = "#d9ff54";
    export let fillOpacity = "50%";
 
    export let padAngle = 0.01;

    export let dataset = [];
    export let dateAccessor = (d) => {
        //Check Date format for Scale
        return new Date(d.timestamp);
    };
    export let airAccessor = (d) => {
        return d.airquality;
    };
    export let lqiAccessor = (d) => {
        return d.lqi;
    };

    //#fafa46
    export let arcColors = [
        "#e0e0e0",
        "#d50000",
        "#ff6d00",
        "#ffd600",
        "#aed581",
        "#1a9641",
    ];
    export let arcStatus = [
        "",
        "sehr schlecht",
        "schlecht",
        "mäßig",
        "gut",
        "sehr gut",
    ];

    onMount(() => {});

    const arc = d3.arc();

    const angelScaleTime = d3
        .scaleTime()
        .range([0, 2 * Math.PI])
        .domain(d3.extent(dataset, dateAccessor));

    const arcColorScale = d3.scaleOrdinal().domain(arcStatus).range(arcColors);

    $:dailyBounds = getDailyBounds(dataset);
    $:avgLqisPerDay = getAvgLqisPerDay(dataset);
    //$:console.log(getAvgLqisPerDay(dataset));
    

    function getDailyBounds(dataset) {
        //get start and end of the day
        let dailyBounds = [];
        let grouped = d3.group(dataset, (d) => dateAccessor(d).getDate());
        //console.log(grouped);
        grouped.forEach((day) => {
            let bounds = d3.extent(day, dateAccessor);
            //Remove the gap between 23 and 00
            if (bounds[1].getHours() == 23) {
                bounds[1].setMinutes(59);
            }
            dailyBounds.push(bounds);
        });

        return dailyBounds;
    }

    function getAvgLqisPerDay(dataset) {
        let avgDays = [];

        let grouped = d3.group(dataset, (d) => dateAccessor(d).getDate());
        //console.log(grouped);
        grouped.forEach((day) => {
            let middleDateIndex = Math.round((day.length - 1) / 2);
            let initial = "";
            let lqiDay = day.reduce((previousValue, currentValue) => {
                return compareLqi(previousValue, lqiAccessor(currentValue));
            }, initial);
            avgDays.push({
                date: dateAccessor(day[middleDateIndex]),
                lqi: lqiDay,
            });
        });
        return avgDays;
    }

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

    let lqiTest = [
            "",
            "sehr gut",
            "gut",
            "mäßig",
            "schlecht",
            "sehr schlecht",
            "wrong"
        ]


</script>

<g class="arc">
    {#each dailyBounds as bounds, i}
        <!-- {console.log(angelScaleTime(bounds[0]))}
        {console.log(angelScaleTime(bounds[1]))} -->
        <!--  fill={arcColorScale(lqiAccessor(avgLqisPerDay[i]))} -->
        <!-- fill={arcColorScale(lqiTest[i])} -->
        <path
        fill={arcColorScale(lqiAccessor(avgLqisPerDay[i]))}
            style="z-index: -1;"
            fill-opacity={fillOpacity}
            d={arc({
                innerRadius: innerRadius,
                outerRadius: outerRadius,
                startAngle: angelScaleTime(bounds[0]),
                endAngle: angelScaleTime(bounds[1]),
                padAngle: padAngle,
                padRadius: innerRadius,
            })}
        />
    {/each}
</g>

<style>
    .arc {
    }
</style>
