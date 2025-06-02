// 📌 Définition des catégories de séries et leurs endpoints sur l'API TMDb
const categories = {
    "popular-series": "tv/popular",         // Séries les plus populaires
    "top-rated-series": "tv/top_rated",     // Séries les mieux notées
    "trending-series": "trending/tv/day",   // Séries tendances du jour
    "on-air-series": "tv/on_the_air"        // Séries actuellement en diffusion
};

// 📌 Fonction pour récupérer et afficher les séries d'une catégorie spécifique
function fetchSeries(categoryId, endpoint) {
    // 🔹 Construction de l'URL d'appel à l'API
    const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey}&language=fr-FR`;

    // 📌 Envoi de la requête à l'API TMDb
    fetch(url)
        .then(response => response.json()) // 🔹 Convertit la réponse JSON en objet JavaScript
        .then(data => { // 🔹 Une fois les données reçues, on exécute cette fonction
            
            // 📌 Sélectionne l'élément HTML correspondant à la catégorie
            const container = document.getElementById(categoryId);

            // ✅ Vérification : Si l'élément HTML n'existe pas, on arrête le script
            if (!container) return;

            // 📌 Initialisation d'une variable qui contiendra le HTML des séries
            let seriesHTML = "";

            // 📌 Parcours des 6 premières séries renvoyées par l'API
            data.results.slice(0, 6).forEach(serie => {

                // 🔹 Construction de l'URL de l'affiche de la série
                // Si la série a une affiche (`poster_path`), on l'affiche
                // Sinon, on utilise une image de remplacement
                const posterUrl = serie.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${serie.poster_path}` 
                    : "https://via.placeholder.com/500x750?text=Pas+de+Image"; // Image par défaut

                // 🔹 Génération du code HTML pour chaque série
                seriesHTML += `
                    <div class="col-md-4 mb-4"> <!-- Chaque série prend 1/3 de la largeur -->
                        <div class="card text-center">
                            <img src="${posterUrl}" class="card-img-top" alt="${serie.name}"> <!-- Affiche de la série -->
                            <div class="card-body">
                                <a href="detailsseries.html?id=${serie.id}" class="btn btn-neon">Voir Détails</a> <!-- Bouton vers détails -->
                            </div>
                        </div>
                    </div>
                `;
            });

            // 📌 Injection du HTML généré dans la page pour afficher les séries
            container.innerHTML = seriesHTML;
        })
        .catch(error => console.error(`Erreur lors du chargement des séries (${categoryId}) :`, error)); // 🚨 Gestion des erreurs
}

// 📌 Lorsque la page est complètement chargée, on appelle `fetchSeries` pour chaque catégorie
document.addEventListener("DOMContentLoaded", () => {
    for (const [categoryId, endpoint] of Object.entries(categories)) {
        fetchSeries(categoryId, endpoint);
    }
});

// 📌 Gestion du formulaire de recherche des séries
document.getElementById("search-form").addEventListener("submit", function(event) {
    event.preventDefault(); // 🔹 Empêche le rechargement de la page lors de la soumission du formulaire

    // 🔹 Récupère la valeur de l'input de recherche et supprime les espaces inutiles
    const query = document.getElementById("search-input").value.trim();

    // ✅ Vérification : Si la recherche est vide, on ne fait rien
    if (!query) return;

    // 📌 Redirige vers la page de recherche des séries avec la requête dans l'URL
    window.location.href = `rechercheseries.html?query=${encodeURIComponent(query)}`;
});
