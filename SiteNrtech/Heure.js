function afficherDateHeure() {
    const maintenant = moment().format('DD/MM/YYYY HH:mm');
    document.getElementById('dateHeure').innerHTML = `${maintenant}`;
  }
  
  setInterval(afficherDateHeure, 1000);
  
  afficherDateHeure();