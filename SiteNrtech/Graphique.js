$(document).ready(function() {
    var timeRange = 'Dernier Jour'; // Default time range
    var temperatureData = {}; // Object to store temperature data for each room
    var myCharts = {}; // Object to store chart instances for each room

    function fetchData(room, containerId) {
        var startDate;
        var results;
        var timescale;

        // Adjust results and timescale based on time range
        switch (timeRange) {
            case 'Dernier Jour':
              startDate = moment().startOf('day').subtract(1, 'day');;
              endDate = moment();
              break;
            case 'Dernier Mois':
              startDate = moment().startOf('month').subtract(1, 'month');
              endDate = moment();
              break;
            case 'Derniere Annee':
                startDate = moment().startOf('year').subtract(1, 'year');
                endDate = moment();
              break;
          }

        var formattedStartDate = startDate.format('YYYY-MM-DD HH:mm:ss');
        url = `https://api.thingspeak.com/channels/2410212/fields/${room.field}.json?api_key=1UBZZWF2IZVHKLBA&start=${startDate.format('YYYY-MM-DDTHH:mm:ss')}&end=${endDate.format('YYYY-MM-DDTHH:mm:ss')}`;
        axios.get(url)
            .then(function(response) {
                var data = response.data;
                var fieldValues = [];
                var timestamps = [];

                $.each(data.feeds, function(index, feed) {
                    var fieldValue = feed['field' + room.field];
                    fieldValues.push(fieldValue);
                    timestamps.push(moment(feed.created_at).format('YYYY-MM-DD HH:mm'));
                });

                temperatureData[room.name] = { values: fieldValues, timestamps: timestamps };

                // Update temperature display
                var latestTemperature = fieldValues[fieldValues.length - 1];
                $("#temperature" + room.name).text("Température actuelle : " + latestTemperature + " °C");

                // Update chart
                updateChart(room, containerId);
            })
            .catch(function(error) {
                console.error("Error fetching data for " + room.name + ":", error);
            });
    }

    function updateChart(room, containerId) {
        console.log("Updating chart for room:", room.name, "with container ID:", containerId);
        var ctx = document.getElementById(containerId);
        console.log("Canvas element:", ctx);
                
        
        var timeFormat = getTimeFormat();
        var ctx = document.getElementById(containerId).getContext('2d');
        
        // Destroy the existing chart if it exists
        if (myCharts[room.name]) {
            myCharts[room.name].destroy();
        }
        
        myCharts[room.name] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: temperatureData[room.name].timestamps,
                datasets: [{
                    label: 'Temperature °C',
                    data: temperatureData[room.name].values,
                    borderColor: room.color,
                    backgroundColor: room.color,
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
                        },
                        scaleLabel: {
                            display: true,
                            labelString: getTimeLabel(timeRange) // Ajout de l'étiquette pour l'axe x
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max: 30, // Set the maximum value of the y-axis
                            stepSize: 5 // Set the step size of the y-axis
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Température en °C' // Ajout de l'étiquette pour l'axe y
                        }
                    }]
                }
            }
        });
    }
    

    function getTimeLabel(timeRange) {
        switch (timeRange) {
            case 'Dernier Jour':
                return 'Temps (Heure)';
            case 'Dernier Mois':
                return 'Temps (Jour)';
            case 'Derniere Annee':
                return 'Temps (Mois)';
            default:
                return 'Temps'; // Default label for other cases
        }
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

    // Define rooms with their properties
    var rooms = [
        { name: 'E101', field: 1, color: '#ff3131' },
        { name: 'E102_1', field: 3, color: '#318cff' },
        { name: 'E102_2', field: 5, color: '#31ff55' },
        { name: 'E103', field: 7, color: '#ffca31' }
    ];

    // Event listener for time range dropdown change
    $("#timeRange").change(function() {
        timeRange = $(this).val();
        rooms.forEach(function(room) {
            fetchData(room, "GraphiqueTemperature" + room.name);
        });
    });

    rooms.forEach(function(room) {
        var canvasElement = document.getElementById("GraphiqueTemperature" + room.name);
        if (canvasElement) {
            fetchData(room, "GraphiqueTemperature" + room.name);
        }
    });

    // Initial data fetch
    rooms.forEach(function(room) {
        fetchData(room, "GraphiqueTemperature" + room.name);
    });
});