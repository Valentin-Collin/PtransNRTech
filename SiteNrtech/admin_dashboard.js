
function selectRandomFrequency() {
    const randomFrequency = Math.floor(Math.random() * (3600 - 15) + 15);
    document.getElementById('frequency').value = randomFrequency;
}

let selectedField; // Variable globale pour stocker le numéro de champ

function selectRoom(room) {
    // Déterminer le numéro du champ en fonction de la salle sélectionnée
    switch (room) {
        case 'Salle E101':
            selectedField = 2;
            break;
        case 'Salle E102_1':
            selectedField = 4;
            break;
        case 'Salle E103':
            selectedField = 6;
            break;
        case 'Salle E102_2':
            selectedField = 8;
            break;
        default:
            console.log("Salle non reconnue.");
            return; // Quitter la fonction si la salle n'est pas reconnue
    }
    console.log("Salle sélectionnée :", room);
    console.log("Numéro de champ sélectionné :", selectedField);
}

function updateFrequency() {
    const frequency = document.getElementById('frequency').value;
    console.log("Fréquence entrée :", frequency);

    const apiKey = 'SXFVX6AVKGBGK90T'; // Remplacez par votre clé d'API ThingSpeak

    const url = `https://api.thingspeak.com/update?api_key=${apiKey}&field${selectedField}=${frequency}`;
    console.log("URL de la requête :", url);

    fetch(url, {
        method: 'POST'
    })
    .then(response => {
        if (response.ok) {
            alert('Période mise à jour avec succès !');
        } else {
            alert('Erreur lors de la mise à jour de la fréquence.');
        }
    })
    .catch(error => {
        console.error('Erreur lors de la mise à jour de la fréquence:', error);
    });
}

