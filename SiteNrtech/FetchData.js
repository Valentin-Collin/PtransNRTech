async function getTemperatureFromThingSpeak() {
    const url = 'https://api.thingspeak.com/channels/2410212/fields/1.json?results=2';

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

    // Actualiser la température toutes les 10 secondes (10000 millisecondes)
    setInterval(getTemperatureFromThingSpeak, 10000);
    // Vous pouvez également ajouter d'autres initialisations ou actions ici
};


$(document).ready(function() {
    function getData() {
        var url ="https://api.thingspeak.com/channels/2410212/fields/1.json?api_key=1UBZZWF2IZVHKLBA&results=10";

        $.getJSON(url, function(data) {
            var field1Values = [];
            var timestamps = [];

            $.each(data.feeds, function(index, feed) {
                field1Values.push(feed.field1);
                timestamps.push(feed.created_at);
            });
            //dealing the graph
            var ctx = document.getElementById('GraphiqueTemperature').getContext('2d');

            var chart = new Chart(ctx, {
                type:'line',
                data:{
                    labels:timestamps,
                    datasets:[{
                        label: 'Temperature °C',
                        data:field1Values,
                        borderColor: '#ff3131',
                        backgroundColor: '#ff3131',
                        //borderWidth: 1,
                        fill: false
                    },
                    ]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: false
                            }
                        }]
                    }
                }
            });




        });

    }
    getData();




});

