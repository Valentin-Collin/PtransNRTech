function attemptLogin() {
    // Récupérer les valeurs des champs
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Effectuer la vérification côté client
    if (username === "admin" && password === "admin123") {
        // Informations d'identification correctes, rediriger vers la page admin
        window.location.href = "admin_dashboard.html";
    } else {
        // Informations d'identification incorrectes, afficher un message d'erreur
        var errorMessageElement = document.getElementById('error-message');
        errorMessageElement.style.display = 'block';
        errorMessageElement.innerHTML = "Nom d'utilisateur ou mot de passe incorrect.";
    }
}