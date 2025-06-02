// URL de l'API TMDb pour récupérer les films actuellement en salle (now playing)
const nowPlayingUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=fr-FR`;

const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 1000); // ⏱ 1 secondes max

// Envoi de la requête pour récupérer les films en salle
fetch(nowPlayingUrl, {
    cache: "no-store", // Ignorer le cache
    signal: controller.signal // Permet d’annuler la requête
})
    .then(response => response.json()) // Convertir la réponse en JSON
    .then(data => {
        // Récupération du conteneur HTML où afficher les films
        const nowPlayingContainer = document.getElementById("now-playing-container");
        if (!nowPlayingContainer) return; // Vérification que l'élément existe, sinon on arrête

        let nowPlayingHTML = ""; // Variable pour stocker le HTML généré

        // On boucle sur les 9 premiers films récupérés
        data.results.slice(0, 9).forEach(film => {
            // Vérifier si le film a une image d'affiche, sinon afficher une image par défaut
            const posterUrl = film.poster_path 
                ? `https://image.tmdb.org/t/p/w500${film.poster_path}` // URL de l'image depuis TMDb
                : "https://via.placeholder.com/500x750?text=Pas+de+Image"; // Image par défaut

            // Génération du HTML pour chaque film
            nowPlayingHTML += `
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

        // Insérer le HTML généré dans le conteneur
        nowPlayingContainer.innerHTML = nowPlayingHTML;
    })
    // Gestion des erreurs
    .catch(error => {
        console.error("Erreur lors de la récupération des derniers films sortis :", error); // Affiche un message d'erreur dans la console
        
        const errorMessage = document.getElementById("error-message");
        if (errorMessage) {
            errorMessage.classList.remove("d-none");  
        }
    });
