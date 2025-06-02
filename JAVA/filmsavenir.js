// 📌 Définition de l'URL pour récupérer les films à venir
// L'API TMDb fournit une liste des films qui sortiront prochainement
const upcomingUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=fr-FR`;

const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 1000); // ⏱ 1 secondes max

// 📌 Envoi de la requête pour obtenir les films à venir
fetch(upcomingUrl, {
    cache: "no-store", // Ignorer le cache
    signal: controller.signal // Permet d’annuler la requête
})
    .then(response => response.json()) // Conversion de la réponse en JSON
    .then(data => {
        // Sélection de l'élément HTML où afficher les films
        const upcomingContainer = document.getElementById("upcoming-container");
        if (!upcomingContainer) return; // Vérification de l'existence de l'élément avant d'y ajouter du contenu

        let upcomingHTML = ""; // Initialisation du contenu HTML pour les films

        // 📌 Boucle sur les 9 premiers films de la liste obtenue
        data.results.slice(0, 9).forEach(film => { 
            // Vérification de l'existence d'une affiche pour le film, sinon afficher une image par défaut
            const posterUrl = film.poster_path 
                ? `https://image.tmdb.org/t/p/w500${film.poster_path}` // URL de l'affiche du film
                : "https://via.placeholder.com/500x750?text=Pas+de+Image"; // Image par défaut si aucune affiche n'est disponible

            // 📌 Génération du code HTML pour chaque film sous forme de carte Bootstrap
            upcomingHTML += `
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

        // 📌 Insertion du contenu généré dans la page
        upcomingContainer.innerHTML = upcomingHTML;
    })

    // Gestion des erreurs
    .catch(error => {
        console.error("Erreur lors de la récupération des films à venir :", error); // Affiche un message d'erreur dans la console
        
        const errorMessage = document.getElementById("error-message");
        if (errorMessage) {
            errorMessage.classList.remove("d-none");  
        }
    });
