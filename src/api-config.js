//Mavi Airquality 
export const apiKeySCM = "";
//SCM Wind, Temperature
export const apiKeyMavi = "";

export const apiSCM =
    [
        `https://api.mvvsmartcities.com/v3/device?Ocp-Apim-Subscription-Key=${apiKeySCM}`,
        `https://api.mvvsmartcities.com/v3/dimension?Ocp-Apim-Subscription-Key=${apiKeySCM}`,
        `https://api.mvvsmartcities.com/v3/timeseriesdefinition?Ocp-Apim-Subscription-Key=${apiKeySCM}`,
        `https://api.mvvsmartcities.com/v3/device/timeseriesdefinition?Ocp-Apim-Subscription-Key=${apiKeySCM}`,
        `https://api.mvvsmartcities.com/v3/timeseries?Ocp-Apim-Subscription-Key=${apiKeySCM}`,
        `https://api.mvvsmartcities.com/v3/device/timeseries?Ocp-Apim-Subscription-Key=${apiKeySCM}`,
        `https://api.mvvsmartcities.com/v3/indicator?Ocp-Apim-Subscription-Key=${apiKeySCM}`,
    ];
export const apiMavi =
    [
        `https://api.mvvsmartcities.com/v3/device?Ocp-Apim-Subscription-Key=${apiKeyMavi}`,
        `https://api.mvvsmartcities.com/v3/dimension?Ocp-Apim-Subscription-Key=${apiKeyMavi}`,
        `https://api.mvvsmartcities.com/v3/timeseriesdefinition?Ocp-Apim-Subscription-Key=${apiKeyMavi}`,
        `https://api.mvvsmartcities.com/v3/device/timeseriesdefinition?Ocp-Apim-Subscription-Key=${apiKeyMavi}`,
        `https://api.mvvsmartcities.com/v3/timeseries?Ocp-Apim-Subscription-Key=${apiKeyMavi}`,
        `https://api.mvvsmartcities.com/v3/device/timeseries?Ocp-Apim-Subscription-Key=${apiKeyMavi}`,
        `https://api.mvvsmartcities.com/v3/indicator?Ocp-Apim-Subscription-Key=${apiKeyMavi}`,
    ];

// DEBW005 Mannheim-Nord = 33df4c51-c02e-4cb4-8372-36340e36329c
// DEBW098 Mannheim-Friedrichsring = cc854fd0-68cf-476c-bba6-b7abea28b78c
// W-006 Wind Messplatz= 0004A30B00F750DC 
// T-016 Temperatur nähe Messplatz = 0004A30B00F72EED 
export const timeSeries = [
    {
        deviceId: "cc854fd0-68cf-476c-bba6-b7abea28b78c",
        timeseriesName: "UBA - Mannheim Friedrichsring, Feinstaub PM₁₀",
        keyName: "pm10",
        timeseriesId: "268dd323-7b7d-47d3-a1b2-89ce02e432c7",
        apiTimeseries: apiMavi[4]
    },
    {
        deviceId: "cc854fd0-68cf-476c-bba6-b7abea28b78c",
        timeseriesNames:  "UBA - Mannheim Friedrichsring, Stickstoffdioxid NO₂",
        keyName: "no2",
        timeseriesId:  "de25fb29-a688-4e02-9439-3fe047a717e2",
        apiTimeseries: apiMavi[4]
    },
    {
        deviceId: "0004A30B00F750DC", 
        timeseriesName: "W-006, Durchschn. Windrichtung",
        keyName: "windrichtung", 
        timeseriesId: "a2a407ce-d36d-4da8-9f2c-22ec00417951",
        apiTimeseries: apiSCM[4]
    },
    { 
        deviceId: "0004A30B00F72EED", 
        timeseriesNames: "T-016, Temperatur",
        keyName: "temperatur",
        timeseriesId: "2cf30dda-75c0-4b8e-851e-0b926fa24d5a",
        apiTimeseries: apiSCM[4]
    },
    //Added
    { 
        deviceId: "0004A30B00F72EED", 
        timeseriesNames: "T-016, max. Temperatur",
        keyName: "maxTemperature",
        timeseriesId: "27fd7f39-8328-4bbf-8fab-ea82aad32ecb",
        apiTimeseries: apiSCM[4]
    },
    { 
        deviceId: "0004A30B00F72EED", 
        timeseriesNames: "T-016, min. Temperatur",
        keyName: "minTemperature",
        timeseriesId: "8b858bf5-2ebd-400e-a0c4-893e98fa3f29",
        apiTimeseries: apiSCM[4]
    },
    { 
        deviceId: "DEBW098", 
        timeseriesNames: "LUBW - Mannheim Friedrichsring, Feinstaub PM₂,₅",
        keyName: "PM2.5",
        timeseriesId: "194fd90f-3de5-4606-b40c-2aa3246c0380",
        apiTimeseries: apiMavi[4]
    },
    { 
        deviceId: "0085EF4F08FF5288", 
        timeseriesNames: "Lufft WS10 MVV Energie AG, differencePrecipitation",
        keyName: "differencePrecipitation",
        timeseriesId: "3f3024c9-cc09-405c-8ea4-77c64846f806",
        apiTimeseries: apiMavi[4]
    }
    
];