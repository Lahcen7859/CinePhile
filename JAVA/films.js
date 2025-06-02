// URL de l'API pour récupérer les films populaires, avec la clé API et la langue en français
const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=fr-FR`;

// Création d'un contrôleur pour pouvoir interrompre la requête manuellement
const controller1 = new AbortController();

//  On lance un minuteur de 1 seconde : si la requête met plus de 1000 ms à répondre, elle est automatiquement annulée
const timeoutId1 = setTimeout(() => controller1.abort(), 1000); 

// Requête Fetch pour récupérer les films populaires depuis l'API TMDB
fetch(apiUrl, {
    cache: "no-store", // Ignorer le cache
    signal: controller1.signal // Permet d’annuler la requête
})
    .then(response => response.json()) // Convertir la réponse en JSON
    .then(data => {
        clearTimeout(timeoutId1); // On annule le timer si tout s’est bien passé

        const filmsContainer = document.getElementById("films-container"); // Sélectionne le conteneur où afficher les films
        if (!filmsContainer) return; // Vérifie que l'élément existe avant de continuer

        let filmsHTML = ""; // Variable pour stocker le HTML généré

        // Boucle à travers les résultats de l'API pour créer une carte par film
        data.results.forEach(film => {
            const posterUrl = `https://image.tmdb.org/t/p/w500${film.poster_path}`; // URL de l'affiche du film

            // Ajoute chaque film sous forme de carte Bootstrap
            filmsHTML += `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <img src="${posterUrl}" class="card-img-top" alt="${film.title}">
                        <div class="card-body">
                            <a href="details.html?id=${film.id}" class="btn btn-neon">Voir Détails</a>
                        </div>
                    </div>
                </div>
            `;
        });

        // Insère le HTML généré dans le conteneur
        filmsContainer.innerHTML = filmsHTML;
    })

// Gestion des erreurs : si la requête fetch échoue (pas de connexion, erreur serveur, etc.)
.catch(error => {

    // Affiche l’erreur technique dans la console (pour les développeurs)
    console.error("Erreur lors de la récupération des films populaires :", error);

    // Récupère l’élément HTML où on affiche un message d’erreur visible pour l’utilisateur
    const errorMessage = document.getElementById("error-message");

    // Si l’élément existe dans le HTML...
    if (errorMessage) {
        // ...on retire la classe Bootstrap 'd-none' pour le rendre visible
        errorMessage.classList.remove("d-none");
    }
});


// Gestion de la barre de recherche

// Écouteur d'événement sur le formulaire de recherche pour empêcher le rechargement de la page
document.getElementById("search-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    const query = document.getElementById("search-input").value.trim(); // Récupère la valeur du champ de recherche
    if (!query) return; // Vérifie que le champ n'est pas vide

    // Redirige vers la page de recherche avec le terme entré dans l'URL
    window.location.href = `recherche.html?query=${encodeURIComponent(query)}`;
});

// Ajout d'un écouteur d'événement sur le bouton de recherche
document.getElementById("search-button").addEventListener("click", function() {
    lancerRecherche(); // Appelle la fonction de recherche
});


// Fonction pour effectuer une recherche de films via l'API TMDB
function lancerRecherche() {
    const query = document.getElementById("search-input").value.trim(); // Récupère la valeur entrée par l'utilisateur
    if (!query) return; // Ne rien faire si le champ est vide

    console.log("Recherche pour :", query); // Vérification dans la console

    // URL de l'API pour rechercher un film avec le mot-clé de l'utilisateur
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=fr-FR`;

    // Requête Fetch pour récupérer les films correspondant à la recherche
    fetch(searchUrl, { cache: "no-store" })
        .then(response => response.json()) // Convertir la réponse en JSON
        .then(data => {
            console.log("Résultats de l'API :", data); // Vérifie si l'API répond correctement

            const searchResults = document.getElementById("search-results"); // Sélectionne le conteneur où afficher les résultats
            searchResults.innerHTML = ""; // Efface les anciens résultats de recherche

            // Si aucun film trouvé, afficher un message
            if (data.results.length === 0) {
                searchResults.innerHTML = "<p class='text-center'>Aucun film trouvé.</p>";
                return;
            }

            let resultsHTML = ""; // Variable pour stocker le HTML généré

            // Boucle à travers les résultats pour afficher chaque film trouvé
            data.results.forEach(film => {
                // Vérifie si une image est disponible, sinon affiche une image par défaut
                const posterUrl = film.poster_path ? `https://image.tmdb.org/t/p/w500${film.poster_path}` : "https://via.placeholder.com/500x750?text=Pas+de+Image";
                
                // Génère une carte pour chaque film trouvé
                resultsHTML += `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <img src="${posterUrl}" class="card-img-top" alt="${film.title}">
                            <div class="card-body">
                                <h5 class="card-title">${film.title}</h5>
                                <p class="card-text">${film.overview.substring(0, 100)}...</p>
                                <a href="details.html?id=${film.id}" class="btn btn-primary">Voir Détails</a>
                            </div>
                        </div>
                    </div>
                `;
            });

            // Insère les résultats dans le conteneur
            searchResults.innerHTML = resultsHTML;
        })
        .catch(error => console.error("Erreur lors de la recherche :", error)); // Gestion des erreurs
}
