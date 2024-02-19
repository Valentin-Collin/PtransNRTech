async function getTemperatureFromThingSpeak() {
    const url = 'https://api.thingspeak.com/channels/2410212/fields/1.json?results=1';

    try {
        const response = await fetch(url); // Utilisation de Fetch au lieu d'Axios
        const data = await response.json();
        const temperatureE101Element = document.getElementById('temperatureE101');
        const temperature = data.feeds[0].field1;

        // Mettre à jour la température dans la section appropriée
        temperatureE101Element.innerHTML = `<p>Température actuelle : ${temperature}°C</p>`;
    } catch (error) {
        console.error('Erreur lors de la récupération de la température :', error);
    }
}

// Appeler la fonction au chargement de la page
window.onload = () => {
    getTemperatureFromThingSpeak();

    // Actualiser la température toutes les 30 sec (30000 millisecondes)
    setInterval(getTemperatureFromThingSpeak, 30000);
    // Vous pouvez également ajouter d'autres initialisations ou actions ici
};


$(document).ready(function() {
    var timeRange = 'Dernier Jour'; // Default time range
    var field1Values = [];
    var timestamps = [];
    var myChart; // Global variable to store the chart instance

    function fetchData() {
        
        var startDate;

        // Adjust results and timescale based on time range
        switch (timeRange) {

            case 'Dernier Jour':
                results = 500;
                timescale = 30; // minutes
                startDate = moment().startOf('second').subtract(1, 'days'); 
                break;
            case 'Dernier Mois':
                results = 500; // 1 result per day for the last month
                timescale = 1440; // Minutes per data point
                startDate = moment().subtract(1, 'months'); // Start date set to 1 month ago from now
                break;
            case 'Derniere Annee':
                results = 500; // 1 result per month for the last year
                timescale = 1440;//43200; // Minutes per data point
                startDate = moment().subtract(1, 'years'); // Start date set to 1 year ago from now
                break;
        }
        

        var formattedStartDate = startDate.format('YYYY-MM-DD HH:mm:ss');
        var url = "https://api.thingspeak.com/channels/2410212/fields/1.json?api_key=1UBZZWF2IZVHKLBA&results=" + results + "&timescale=" + timescale + "&start=" + formattedStartDate;

        axios.get(url)
            .then(function(response) {
                var data = response.data;
                field1Values = [];
                timestamps = [];

                $.each(data.feeds, function(index, feed) {
                    field1Values.push(feed.field1);
                    timestamps.push(moment(feed.created_at).format('YYYY-MM-DD HH:mm'));
                });

                // Update temperature display
                var latestTemperature = field1Values[field1Values.length - 1];
                $("#temperatureE101").text("Température actuelle : " + latestTemperature + " °C");

                // Update chart
                updateChart();
                if (timeRange !== 'Derniere Jour') {
                    getTemperatureFromThingSpeak();
                }
            })
            .catch(function(error) {
                console.error("Error fetching data:", error);
            });
    }

    function updateChart() {
        var timeFormat = getTimeFormat();
        var ctx = document.getElementById('GraphiqueTemperature').getContext('2d');

        // Destroy the existing chart if it exists
        if (myChart) {
            myChart.destroy();
        }

        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [{
                    label: 'Temperature °C',
                    data: field1Values,
                    borderColor: '#ff3131',
                    backgroundColor: '#ff3131',
                    fill: false,
                    spanGaps: true, // Add this line to connect lines even when there are gaps
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: timeFormat.unit,
                            displayFormats: {
                                hour: 'MMM D, HH:mm',  // Adjust the format as needed
                                day: 'MMM D',
                                month: 'MMM YYYY'
                            },
                            tooltipFormat: 'MMM D, HH:mm'  // Adjust the tooltip format as needed
                        },
                        distribution: 'linear',
                        ticks: {
                            unitStepSize: timeFormat.unitStepSize // Added this line for better control over time scale
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max: 30, // Set the maximum value of the y-axis
                            stepSize: 5 // Set the step size of the y-axis
                        }
                    }]
                }
            }
        });
    }

    function getTimeFormat() {
        switch (timeRange) {
            case 'Dernier Jour':
                return { unit: 'minute', displayFormat: { hour: 'HH:mm' }, unitStepSize: 1 };
            case 'Dernier Mois':
                return { unit: 'day', displayFormat: { day: 'MMM D' }, unitStepSize: 1 };
            case 'Derniere Annee':
                return { unit: 'month', displayFormat: { month: 'MMM YYYY' }, unitStepSize: 1 };
            default:
                return { unit: 'hour', displayFormat: { hour: 'MMM D, HH:mm' }, unitStepSize: 1 };
        }
    }

    // Event listener for time range dropdown change
    $("#timeRange").change(function() {
        timeRange = $(this).val();
        fetchData(); // Fetch new data based on the selected time range
        getTemperatureFromThingSpeak();
    });

    fetchData(); // Initial data fetch
});






