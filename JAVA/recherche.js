
// 📌 Récupération du paramètre de recherche dans l'URL
// L'URL contient la recherche sous la forme : ?query=nom_du_film
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('query'); // Extrait la valeur après "query="

// ✅ Vérification si une recherche a bien été effectuée
if (query) {
    
    // 🔹 Modifier dynamiquement le titre de la page avec la recherche en cours
    document.title = `Résultats pour "${query}"`; 

    // 📌 Construction de l'URL pour interroger l'API TMDb
    // `encodeURIComponent(query)`: permet de gérer les espaces et caractères spéciaux dans l'URL
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=fr-FR`;

    // Création d'un contrôleur pour pouvoir interrompre la requête manuellement
    const controller = new AbortController();

    //  On lance un minuteur de 1 seconde : si la requête met plus de 1000 ms à répondre, elle est automatiquement annulée
    const timeoutId = setTimeout(() => controller.abort(), 1000); 

    // 📌 Envoi de la requête à l'API TMDb
    fetch(searchUrl, {
        cache: "no-store", // Ignorer le cache
        signal: controller.signal // Permet d’annuler la requête
    })
        .then(response => response.json())  // 🔹 Convertit la réponse JSON en objet JavaScript
        .then(data => {  // Une fois les données reçues, on exécute cette fonction
            clearTimeout(timeoutId); // On annule le timer si tout s’est bien passé
            
            // 📌 Sélectionne l'élément HTML qui contiendra les résultats de recherche
            const searchResults = document.getElementById("search-results");

            // ✅ Nettoyage de l'affichage : on efface les anciens résultats
            searchResults.innerHTML = ""; 

            // ✅ Vérification : Si aucun film trouvé, afficher un message
            if (data.results.length === 0) {
                searchResults.innerHTML = "<p class='text-center'>Aucun film trouvé.</p>";
                return; // On arrête l'exécution du script ici
            }

            // 📌 Initialisation d'une variable qui contiendra le HTML des résultats
            let resultsHTML = "";

            // 📌 Parcours des résultats renvoyés par l'API
            data.results.forEach(film => {

                // 🔹 Construction de l'URL de l'affiche du film
                // Si le film a une affiche (`poster_path`), on l'affiche
                // Sinon, on utilise une image de remplacement
                const posterUrl = film.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${film.poster_path}` 
                    : "https://via.placeholder.com/500x750?text=Pas+de+Image"; // Image par défaut

                // 🔹 Génération du code HTML pour chaque film
                resultsHTML += `
                    <div class="col-md-4 mb-4"> <!-- Chaque film prend 1/3 de la largeur (col-md-4) -->
                        <div class="card">
                            <img src="${posterUrl}" class="card-img-top" alt="${film.title}"> <!-- Affiche du film -->
                            <div class="card-body">
                                <a href="details.html?id=${film.id}" class="btn btn-neon">Voir Détails</a> <!-- Bouton vers détails -->
                            </div>
                        </div>
                    </div>
                `;
            });

            // 📌 Injection du HTML généré dans la page pour afficher les résultats
            searchResults.innerHTML = resultsHTML;
        })
       // Gestion des erreurs : si la requête fetch échoue (pas de connexion, erreur serveur, etc.)
.catch(error => {

    // Affiche l’erreur technique dans la console (pour les développeurs)
    console.error("Erreur lors de la recherche :", error);

    // Récupère l’élément HTML où on affiche un message d’erreur visible pour l’utilisateur
    const errorMessage = document.getElementById("error-message");

    // Si l’élément existe dans le HTML...
    if (errorMessage) {
        // ...on retire la classe Bootstrap 'd-none' pour le rendre visible
        errorMessage.classList.remove("d-none");
    }
});
}
