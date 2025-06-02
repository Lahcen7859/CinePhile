// 📌 Définition de l'URL de l'API pour récupérer les films les mieux notés
// TMDb fournit une liste des films les mieux notés, triés par note moyenne des utilisateurs
const topRatedUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=fr-FR`;

const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 1000); // ⏱ 1 secondes max

// 📌 Envoi de la requête à l'API TMDb pour récupérer les films les mieux notés
fetch(topRatedUrl, {
    cache: "no-store", // Ignorer le cache
    signal: controller.signal // Permet d’annuler la requête
})
    .then(response => response.json())  // Conversion de la réponse en format JSON
    .then(data => {  // Une fois les données récupérées, exécution de cette fonction

        // 📌 Sélection de l'élément HTML qui contiendra la liste des films
        const topRatedContainer = document.getElementById("top-rated-container");

        // ✅ Vérification que l'élément existe dans le DOM
        if (!topRatedContainer) return; // Si l'élément n'existe pas, on arrête le script

        // 📌 Initialisation d'une variable qui va contenir le HTML des films
        let topRatedHTML = "";

        // 📌 On parcourt les 9 premiers films de la liste obtenue
        data.results.slice(0, 9).forEach(film => {  

            // 🔹 Construction de l'URL de l'affiche du film
            // TMDb stocke les images sur ses serveurs et fournit seulement le chemin
            // Si une affiche existe, on l'affiche, sinon on met une image par défaut
            const posterUrl = film.poster_path 
                ? `https://image.tmdb.org/t/p/w500${film.poster_path}`
                : "https://via.placeholder.com/500x750?text=Pas+de+Image"; // Image de remplacement si indisponible

            // 🔹 Génération du code HTML pour chaque film
            // Chaque film est affiché sous forme de "carte" Bootstrap avec :
            // ✅ Une image de l'affiche
            // ✅ Un bouton qui mène à la page de détails du film
            topRatedHTML += `
                <div class="col-md-4 mb-4"> <!-- Chaque film occupe 1/3 de la largeur (col-md-4) -->
                    <div class="card">
                        <img src="${posterUrl}" class="card-img-top" alt="${film.title}"> <!-- Affiche du film -->
                        <div class="card-body">
                            <a href="details.html?id=${film.id}" class="btn btn-neon">Voir Détails</a> <!-- Bouton vers la page détails -->
                        </div>
                    </div>
                </div>
            `;
        });

        // 📌 Ajout du contenu HTML généré à l'intérieur de l'élément conteneur
        topRatedContainer.innerHTML = topRatedHTML;
    })
    // Gestion des erreurs
    .catch(error => {
        console.error("Erreur lors de la récupération des films les mieux notés :", error); // Affiche un message d'erreur dans la console
        
        const errorMessage = document.getElementById("error-message");
        if (errorMessage) {
            errorMessage.classList.remove("d-none");  
        }
    });