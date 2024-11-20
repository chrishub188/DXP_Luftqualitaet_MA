<script lang="ts">
  import * as d3 from "d3";
  import type { TopAppBarComponentDev } from "@smui/top-app-bar";
  import TopAppBar, {
    Row,
    Section,
    Title,
    AutoAdjust,
  } from "@smui/top-app-bar";
  import { Icon } from "@smui/button";
  import KpiBar from "./visuals/KPI-Bar.svelte";
  import RadialChart from "./visuals/Radial-Chart.svelte";
  import { onMount } from "svelte";
  import { timeSeries } from "./api-config";
  import { Jumper } from "svelte-loading-spinners";
  import RadialChartLegend from "./visuals/Radial-Chart-Legend.svelte";
  import { focusPosition } from "./visuals/store/store.js";

  export let name: string;
  let topAppBar: TopAppBarComponentDev;
  let width;

  //API-Parameter
  let dateTo = new Date();
  let dateFrom = getWeekStart(dateTo);
  let apiConfig = {
    interval: "H",
    func: "avg",
    sort: "asc",
    limit: 10000,
    output: "records",
    metadata: "true",
    from: dateFrom,
    to: dateTo,
  };

  onMount(() => {
    // console.log("From: " + dateFrom.toISOString());
    // console.log("To: " + dateTo.toISOString());
    // console.log(getAngleLabel(0));
    // console.log("Mobile Browser ?" + checkBrowserType());
  });

  function checkBrowserType() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  //only for the the specific air datapoint
  // pm10 no2 ... are not generic
  const fullDataset = getAllTimeseries(timeSeries, apiConfig).then(
    ([
      pm10,
      no2,
      windrichtung,
      temperatur,
      maxTemperatur,
      minTemperatur,
      pm25,
      precipitation,
    ]) => {
      const dates = d3.timeHour.range(dateFrom, dateTo);
      let resultDataset = [];
      //Create one dataset
      dates.forEach((item, i) => {
        //Seach if date has an value or undefined
        const searchFunc = (d) => {
          const date = new Date(d.timestamp);
          return date.toISOString() === item.toISOString();
        };
        //undefined values are "" not just undefined
        const ifValueDefined = (d) => {
          if (d === undefined) return "";
          else return d.value;
        };
        // Example format for each item in dataset-array
        // {
        // 	timestamp: "2022-05-30T14:00:00.000Z",
        // 	PM10: "",
        // 	NO2: "",
        // 	averageWindDirection: 92,
        // 	temperature: 17.8,
        // 	lqi: "",
        // 	lqiNO2: "",
        // 	lqiPM10: "",
        // 	lqiOzon: "",
        // 	maxTemperature: 18.125,
        // 	minTemperature: 17.5,
        // 	PM25: "",
        // }
        let resultItem = {
          timestamp: item,
          [pm10[0].metadata.key]: ifValueDefined(
            pm10[0].records.find(searchFunc)
          ),
          [no2[0].metadata.key]: ifValueDefined(
            no2[0].records.find(searchFunc)
          ),
          [windrichtung[0].metadata.key]: ifValueDefined(
            windrichtung[0].records.find(searchFunc)
          ),
          WindLabel: getAngleLabel(
            ifValueDefined(windrichtung[0].records.find(searchFunc))
          ),
          [temperatur[0].metadata.key]: ifValueDefined(
            temperatur[0].records.find(searchFunc)
          ),
          lqi: getAirStatus(
            ifValueDefined(no2[0].records.find(searchFunc)),
            ifValueDefined(pm10[0].records.find(searchFunc))
          ),
          lqiNO2: getN02AirStatus(
            ifValueDefined(no2[0].records.find(searchFunc))
          ),
          lqiPM10: getPM10AirStatus(
            ifValueDefined(pm10[0].records.find(searchFunc))
          ),
          lqiOzon: "",
          //temperaturMax: "",
          [maxTemperatur[0].metadata.key]: ifValueDefined(
            maxTemperatur[0].records.find(searchFunc)
          ),
          //temperaturMin: "",
          [minTemperatur[0].metadata.key]: ifValueDefined(
            minTemperatur[0].records.find(searchFunc)
          ),
          //pm25: ""
          PM25: ifValueDefined(pm25[0].records.find(searchFunc)),
          precipitation: ifValueDefined(
            precipitation[0].records.find(searchFunc)
          ),
        };
        resultDataset.push(resultItem);
      });
      // resultDataset.forEach(item=>{
      // 	console.log("Angle:" + item.averageWindDirection)
      // 	console.log("Angle-Label:" + item.WindLabel)
      // });

      //console.log(resultDataset);
      //Offest items where no data is available
      let i = resultDataset.length - 1;
      while (resultDataset[--i].lqi === "") {
        resultDataset.pop();
      }
      $focusPosition.index = resultDataset.length - 2;

      return resultDataset;
    }
  );

  // Create the airquality-index for the airDataset
  // []
  function getAirStatus(no, pm) {
    if (no === "" && pm === "") {
      return "";
    } else if (no > 200 || pm > 100) {
      return "sehr schlecht";
    } else if ((no <= 200 && no > 100) || (pm <= 100 && pm > 50)) {
      return "schlecht";
    } else if ((no <= 100 && no > 40) || (pm <= 50 && pm > 35)) {
      return "mäßig";
    } else if ((no <= 40 && no > 20) || (pm <= 35 && pm > 20)) {
      return "gut";
    } else if (no <= 20 || pm <= 20) {
      return "sehr gut";
    }
  }

  function getN02AirStatus(no) {
    return getAirStatus(no, "");
  }

  function getPM10AirStatus(pm) {
    return getAirStatus("", pm);
  }

  function getAngleLabel(angle) {
    const winddirections = [
      { Label: "Nord", Start: 0, End: 22.5 },
      { Label: "NO", Start: 22.5, End: 67.5 },
      { Label: "Ost", Start: 67.5, End: 112.5 },
      { Label: "SO", Start: 112.5, End: 157.5 },
      { Label: "Süd", Start: 157.5, End: 202.5 },
      { Label: "SW", Start: 202.5, End: 247.5 },
      { Label: "West", Start: 247.5, End: 292.5 },
      { Label: "NW", Start: 292.5, End: 337.5 },
      { Label: "Nord", Start: 337.5, End: 360 },
    ];
    let resultLabel = "-";
    winddirections.forEach((item) => {
      if (between(angle, item.Start, item.End)) {
        resultLabel = item.Label;
      }
    });
    return resultLabel;
  }
  function between(x, start, end) {
    return x >= start && x <= end;
  }

  //Calculate the date one week ago
  //Full Day starting at 0 minutes 0 seconds
  function getWeekStart(weekEnd) {
    return new Date(
      weekEnd.getFullYear(),
      weekEnd.getMonth(),
      weekEnd.getDate() - 6,
      weekEnd.getHours(),
      weekEnd.getMinutes(),
      weekEnd.getSeconds(),
      weekEnd.getMilliseconds()
    );
  }

  //Mavi
  //https://api.mvvsmartcities.com/v3/timeseries?timeSeriesId=268dd323-7b7d-47d3-a1b2-89ce02e432c7&timeSeriesId=de25fb29-a688-4e02-9439-3fe047a717e2&from=2022-05-02T22%3A00%3A00.000Z&to=2022-05-09T08%3A21%3A58.209Z&func=avg&interval=H&sort=desc&limit=10000&output=records&metadata=true
  //SCM
  //https://api.mvvsmartcities.com/v3/timeseries?timeSeriesId=2cf30dda-75c0-4b8e-851e-0b926fa24d5a&timeSeriesId=a2a407ce-d36d-4da8-9f2c-22ec00417951&from=2022-05-02T22%3A00%3A00.000Z&to=2022-05-09T08%3A21%3A58.209Z&func=avg&interval=H&sort=desc&limit=10000&output=records&metadata=true

  //Calls all timeseries
  function getAllTimeseries(timeSeriesArray, config) {
    const response = Promise.all(
      timeSeriesArray.map((item) => {
        return getTimeseriesByID(item.apiTimeseries, item.timeseriesId, config);
      })
    );
    // console.log(response);
    return response;
  }

  //Calls one timeseries by it's individual timeseries id (see api-config.js)
  function getTimeseriesByID(apiTimeseries, timeseriesID, config) {
    return fetch(
      `${apiTimeseries}
				&from=${dateFrom.toISOString()}&to=${dateTo.toISOString()}&sort=${
        config.sort
      }&limit=${config.limit}&interval=${config.interval}&func=${
        config.func
      }&output=${config.output}&metadata=${
        config.metadata
      }&timeSeriesId=${timeseriesID}`
    )
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        //console.log(response);
        return response;
      });
  }
</script>

<main bind:clientWidth={width}>
  <!-- <div class="center">
    <div class="center-element"> -->
      <TopAppBar
        id="title-bar"
        bind:this={topAppBar}
        variant="fixed"
        dense={false}
      >
        <Row>
          <Section>
            <!-- <img  class="smart-icon"  src="assets/rahmen.svg" alt="Logo"> -->
            <Icon class="material-icons">
              <!-- <img class="smart-icon" {src} alt="Logo" /> -->
              <svg
                class="smart-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 0 50 50"
              >
                <g id="sMArt_Logo_1c_2_neg" transform="translate(-0.03 -0.03)">
                  <path
                    id="Pfad_399"
                    data-name="Pfad 399"
                    d="M23.577,82.83a5.587,5.587,0,0,0-2.156-.431,4.142,4.142,0,0,0-1.234.17,2.8,2.8,0,0,0-.947.484,2.114,2.114,0,0,0-.6.767,2.423,2.423,0,0,0-.207,1,1.639,1.639,0,0,0,.437,1.213A3.027,3.027,0,0,0,20.4,86.7c.22.045.395.085.53.125a1.138,1.138,0,0,1,.307.13.35.35,0,0,1,.137.158.6.6,0,0,1,.032.215.434.434,0,0,1-.21.368.923.923,0,0,1-.535.143,3.35,3.35,0,0,1-1.882-.681l-.862,1.679A5.237,5.237,0,0,0,20.6,89.6a4.487,4.487,0,0,0,1.294-.175,3.1,3.1,0,0,0,1-.5,2.254,2.254,0,0,0,.655-.792,2.345,2.345,0,0,0,.235-1.062,1.789,1.789,0,0,0-.485-1.29,2.711,2.711,0,0,0-1.462-.7l-.57-.13a1.332,1.332,0,0,1-.327-.118A.36.36,0,0,1,20.8,84.7a.457.457,0,0,1-.032-.19.4.4,0,0,1,.2-.353.96.96,0,0,1,.53-.133,2.773,2.773,0,0,1,1.284.358l.8-1.546Zm3.216,6.539.85-5.688,2.209,5.688h1.02L33.2,83.682l.847,5.688h2.549L34.932,79.49H32.386l-1.959,5.262L28.452,79.49H25.916l-1.672,9.879ZM41.141,85.7l1.152-3.29,1.149,3.29Zm3.568,3.668h2.731L43.693,79.49h-2.8l-3.748,9.879h2.731l.587-1.716h3.661l.587,1.716Zm3.646,0h2.366V86.485a2.172,2.172,0,0,1,.412-1.433,1.512,1.512,0,0,1,1.234-.5,2.244,2.244,0,0,1,1.02.236V82.532a1.477,1.477,0,0,0-.25-.028h-.215a2.474,2.474,0,0,0-1.282.323,2.72,2.72,0,0,0-.927.922v-1.1H48.348v6.722Zm10.585-4.74V82.649H57.6V80.62H55.229v2h-.785v2h.785v4.743H57.6V84.629Z"
                    transform="translate(-13.4 -59.599)"
                    fill="#333"
                  />
                  <path
                    id="Pfad_400"
                    data-name="Pfad 400"
                    d="M49.5.5v49H.5V.5h49M50,0H0V50H50Z"
                    transform="translate(0.03 0.03)"
                    fill="#333"
                  />
                </g>
              </svg>
              <!-- menu -->
            </Icon>
            <Title>{name}</Title>
          </Section>
          <!-- <Section>
				<Title>Luftqualität in Mannheim</Title>
			</Section> -->
        </Row>
      </TopAppBar>
      <AutoAdjust {topAppBar}>
        <div class="visuals">
          {#await fullDataset}
            <!-- Check for animation https://schum123.github.io/svelte-loading-spinners/?ref=madewithsvelte.com -->
            <!-- <Firework size="100" color="#d9ff54" unit="px" duration="0.5s"></Firework> -->
            <div class="await-animation">
              <Jumper
                size={width / 2}
                color="#2A2A2A"
                unit="px"
                duration="1.5s"
              />
            </div>
          {:then dataset}
            <KpiBar {dataset} />
            <!-- width*0.94 3% padding on each side  -->
            <RadialChart {dataset} width={width * 0.94} />
          {:catch error}
            <!-- Define some error Message -->
          {/await}
        </div>
        <div class="legend">
          {#await fullDataset then dataset}
            <RadialChartLegend {dataset} {width} />
          {/await}
        </div>
        <p class="description">
          Die Grafik stellt die Luftqualitätswerte der Luftmesstation am
          Mannheimer Friedrichsring dar. Enthalten sind die Parameter
          Feinstaubpartikel kleiner 10 Mikrometer(PM10), die Stickstoffbelastung
          (NO2) sowie die Ozon Werten. Auf Basis der Messwerte wird der
          Luftqualitätsindex (LQI) berechnet. Dieser stellt die gesundheitliche
          Bewertung der Luft in Mannheim dar, auf Basis der Grenzen des
          Umweltbundesamtes. Ergänzt werden die Messwerte durch die
          Klimasensoren aus dem Sensornetzwerk Mannheim. Enthalten sind die
          Messwerte der nahegelegenen Temperaturmessstation sowie die
          Windrichtung.
        </p>
        <!-- <h2>Location:</h2> -->
        <!-- Leaflet Location-->
        <!-- <div class="mapbox">
			<Map width={width * 0.94}></Map>
		</div> -->
        <!-- Matomo Image Tracker-->
        <!-- <img
          referrerpolicy="no-referrer-when-downgrade"
          src="https://www.smartmannheim.de/matomo/matomo.php?idsite=2&amp;rec=1"
          style="border:0;height:0;width:0;position:absolute;visibility:hidden;"
          alt=""
        /> -->
        <!-- End Matomo -->
      </AutoAdjust>
    <!-- </div>
  </div> -->
</main>

<style lang="scss">
  /* Hide everything above this component. */
  :global(app),
  :global(body),
  :global(html) {
    display: block !important;
    height: auto !important;
    width: auto !important;
    position: static !important;
    border: 0 !important;
    padding: 0 !important;
    margin:0 auto !important;
    max-width: 450px !important;
    

  }
  .center {
    max-width: 450px;
    display: flex;
    margin:0 auto;

  }
  .center-element {
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin:0 auto;

  }
  .visuals {
    padding: 3%;
    padding-bottom: 0;
  }
  .await-animation {
    display: flex;
    justify-content: center;
  }
  .legend {
    padding: 2%;
    padding-top: 0;
  }
  .description {
    padding: 3%;
    font-family: "Montserrat";
    font-weight: 500;
    margin-top: 0;
  }
  .smart-icon {
    width: 40px;
    height: auto;
    padding: 2px;
  }
  :global(.mdc-top-app-bar__title) {
    color: #333;
    font-family: "Montserrat", Bold !important;
    font-weight: 800 !important;
    padding-left: 1%;
  }
  :global(#title-bar) {
    // align-items: center;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
    // background-color: var(--mdc-theme-primary, #d9ff54);
    background-color: var(--mdc-theme-primary, #ffffff);
    max-width: 450px !important;
  }
  // .mapbox{
  // 	display: flex;
  // 	justify-content: center;
  // 	align-items: center;
  // }
</style>
