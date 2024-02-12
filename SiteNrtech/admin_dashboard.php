<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Projet NRTECH </title>
    <link rel="stylesheet" href="style.css">
    <link rel="shortcut icon" href="C:\Users\valen\Downloads\lOGOnRTECH.webp" />
    
</head>
<body>

    <header>
      
        <a href="Sitetemp.html" style="text-decoration: none; color: inherit; display: flex; align-items: center;">
            <img id="logo" src="C:\Users\valen\Downloads\lOGOnRTECH.webp" alt="Logo NRTECH">
            <h1>Projet NRTECH</h1>
        </a>
    </header>

    <section>
     
    </section>

    <section>
        <h2>Selectionnez la salle</h2>
        <div class="dropdown-container">
            <label for="choices">Salle :</label>
            <select id="choices" name="choices" class="dropdown">
                <option value="option1">E101</option>
                <option value="option2">E102</option>
                <option value="option3">E103</option>
            </select>
        </div>
        <div class="dropdown-container">
            <label for="choices">Fréquence de mesure :</label>
            <select id="choices" name="choices" class="dropdown">
                <option value="option1">5min</option>
                <option value="option2">30min</option>
                <option value="option3">1h</option>
            </select>
        </div>
        
    </section>

    <footer>
        <p>&copy; 2024 Projet NRTECH</p>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="FetchData.js"></script>

</body>
</html>
