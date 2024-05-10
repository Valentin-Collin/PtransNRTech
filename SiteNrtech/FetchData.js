
async function fetchTemperatureData() {
    // URL de base pour les champs spécifiques
    const baseUrl = 'https://api.thingspeak.com/channels/2410212/fields/';

    // Identifiants des champs à récupérer
    const fieldIds = {
        E101: '1', // Supposons que field1 correspond à la salle E101
        E102_1: '3', // Supposons que field3 correspond à la salle E102_1
        E102_2: '5', // Supposons que field5 correspond à la salle E102_2
        E103: '7', // Supposons que field7 correspond à la salle E103
    };

    try {
        // Boucle sur chaque champ et effectue une requête HTTP
        for (let room in fieldIds) {
            const fieldId = fieldIds[room];
            const url = `${baseUrl}${fieldId}/last.json`;
            const response = await axios.get(url);
            const fieldValue = response.data[`field${fieldId}`]; // Accède dynamiquement à la bonne propriété

            // Vérifie si l'élément HTML exist avant de le mettre à jour
            const element = document.getElementById(`temperature${room}`);
            if (element) {
                element.innerText = `Température : ${fieldValue}°C`;
            } else {
                console.warn(`Élément non trouvé : temperature${room}`);
            }
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données de température :', error);
    }
}

// Démarrage
fetchTemperatureData();

 



async function fetchFrequencyData() {
    // URL de base pour les champs spécifiques
    const baseUrl = 'https://api.thingspeak.com/channels/2410212/fields/';

    // Identifiants des champs à récupérer
    const fieldIds = {
        E101: '2', // Supposons que field2 correspond à la salle E101
        E102_1: '4', // Supposons que field4 correspond à la salle E102
        E103: '6', // Supposons que field6 correspond à la salle E103
        E102_2: '8',
    };

    try {
        // Boucle sur chaque champ et effectue une requête HTTP
        for (let room in fieldIds) {
            const fieldId = fieldIds[room];
            const url = `${baseUrl}${fieldId}/last.json`;
            const response = await axios.get(url);
            // Assurez-vous d'accéder à la propriété correcte de la réponse
            // La propriété à accéder dépend de la structure de la réponse de l'API
            // Supposons que la valeur soit directement dans 'field{fieldId}' (e.g., 'field2')
            const fieldValue = response.data[`field${fieldId}`]; // Accède dynamiquement à la bonne propriété


            // Vérifie si l'élément HTML exist avant de le mettre à jour
            const element = document.getElementById(`frequence${room}`);
            if (element) {
                element.innerText  = `Période : ${fieldValue} secondes`;
            } else {
                console.warn(`Élément non trouvé : frequence${room}`);
            }
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données de fréquence :', error);
    }
}

fetchFrequencyData();



