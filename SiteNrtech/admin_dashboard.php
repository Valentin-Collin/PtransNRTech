<?php
session_start();

// Vérifier si l'utilisateur est connecté en tant qu'administrateur
if (!isset($_SESSION['admin']) || $_SESSION['admin'] !== true) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
    header("Location: login.php");
    exit;
}

// Vérifier si la méthode de requête est POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupérer la nouvelle fréquence de mesure depuis le formulaire
    $new_frequency = $_POST["frequency"];

    // Enregistrer la nouvelle fréquence de mesure dans une base de données ou tout autre système de stockage
    // Ici, vous pouvez implémenter la logique pour mettre à jour la fréquence de mesure dans votre système

    // Rediriger l'utilisateur vers le tableau de bord avec un message de succès
    header("Location: admin_dashboard.php?message=Frequency updated successfully");
    exit;
}
?>
