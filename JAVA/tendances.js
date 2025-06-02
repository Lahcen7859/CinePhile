
// URL de l'API pour récupérer les films tendances du jour (la notre maintenat)
const trendingUrl = `http://localhost:3000/api/tendances`;


const controller2 = new AbortController();
const timeoutId2 = setTimeout(() => controller2.abort(), 1000); // ⏱ 1 secondes max
// 📌 Envoi de la requête à notre API pour récupérer les films tendances
fetch(trendingUrl, {
    cache: "no-store", // Ignorer le cache
    signal: controller2.signal // Permet d’annuler la requête
})
    .then(response => response.json()) // 🔹 Convertit la réponse en JSON
    .then(data => { // 🔹 Une fois les données reçues, cette fonction s'exécute
        clearTimeout(timeoutId2); // On annule le timer si tout s’est bien passé
        
        // 📌 Sélectionne l'élément HTML où afficher les films tendances
        const trendingContainer = document.getElementById("trending-container");

        // ✅ Vérification : Si l'élément HTML n'existe pas, on arrête le script
        if (!trendingContainer) return;

        // 📌 Vide le contenu du conteneur avant d'afficher les nouveaux résultats
        trendingContainer.innerHTML = "";

        // 📌 Initialisation d'une variable pour stocker le HTML des films
        let filmsHTML = "";

        // 📌 Parcours de tous les films tendances reçus
        data.results.forEach(film => {

            
            const posterUrl = film.poster_path 
            //  Plus de besoin de vérifier si un film a une affiche car on utilise plus TMDB pour cette page

            // Génération du code HTML pour chaque film
            filmsHTML += `
                <div class="col-md-4 mb-4"> <!-- Chaque film prend 1/3 de la largeur -->
                    <div class="card">
                        <img src="${posterUrl}" class="card-img-top" alt="${film.title}"> <!-- Affiche du film -->
                        <div class="card-body">
                            <a href="details.html?id=${film.id}" class="btn btn-neon">Voir Détails</a> <!-- Bouton vers détails -->
                        </div>
                    </div>
                </div>
            `;
        });

        // Injecte le HTML généré dans la page pour afficher les films tendances
        trendingContainer.innerHTML = filmsHTML;
    })
     // Gestion des erreurs
    .catch(error => {
        console.error("Erreur lors de la récupération des films tendances :", error); // Affiche un message d'erreur dans la console
        
        const errorMessage = document.getElementById("error-message");
        if (errorMessage) {
            errorMessage.classList.remove("d-none");  
        }
    });

