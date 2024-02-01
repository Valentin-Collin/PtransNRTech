<?php
session_start();

// Vérification des informations d'identification côté serveur
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $admin_username = "admin";
    $admin_password = "admin123";

    $input_username = $_POST["username"];
    $input_password = $_POST["password"];

    if ($input_username === $admin_username && $input_password === $admin_password) {
        // Informations d'identification correctes, rediriger vers la page admin
        header("Location: admin_dashboard.php");
        exit();
    } else {
        // Informations d'identification incorrectes, afficher un message d'erreur
        echo "Nom d'utilisateur ou mot de passe incorrect.";
    }
}
?>
