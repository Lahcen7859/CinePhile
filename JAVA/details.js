const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 1000); // ⏱ 1 secondes max

function afficherErreurGlobale() {
    const mainContent = document.getElementById("principal"); // Sélectionne le conteneur contenant le contenu principal
    if (mainContent) mainContent.classList.add("d-none"); //  Le masque si conditions vérifiée

    const errorPage = document.getElementById("error-page"); // Sélectionne le bloc d'erreur du HTML
    if (errorPage) errorPage.classList.remove("d-none"); // L'affiche si la conditions est vérifiée
}

//  Récupération de l'ID du film à partir de l'URL
// Lorsque l'utilisateur clique sur un film, son ID est ajouté à l'URL sous forme de paramètre (ex: details.html?id=12345)
// Ici, on extrait cet ID pour l'utiliser dans nos requêtes API.
const urlParams = new URLSearchParams(window.location.search); // Analyse les paramètres de l'URL actuelle
const movieId = urlParams.get('id'); // Récupère la valeur associée à "id"

//  Vérification que l'ID du film est bien présent dans l'URL
if (movieId) {
    // Définition des URLs pour récupérer les informations du film depuis l'API TMDb
    const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=fr-FR`; // Détails du film
    const castUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=fr-FR`; // Casting
    const trailerUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=fr-FR`; // Bande-annonce

    //  Récupération des détails du film
    fetch(movieUrl, {
        cache: "no-store", // Ignorer le cache
        signal: controller.signal // Permet d’annuler la requête
    })
        .then(response => response.json()) // Conversion de la réponse en format JSON
        .then(data => {
            // Sélection des éléments HTML où afficher les données du film
            document.getElementById("movie-title").textContent = data.title; // Titre du film
            document.getElementById("movie-poster").src = `https://image.tmdb.org/t/p/w500${data.poster_path}`; // Affiche du film
            document.getElementById("release-date").textContent = data.release_date; // Date de sortie
            document.getElementById("movie-overview").textContent = data.overview; // Synopsis
        })
        // Gestion des erreurs
        .catch(error => {
            console.error("Erreur lors du chargement des détails :", error); // Message dans la console
            afficherErreurGlobale(); // Appel ici de la fonction
        });

    //  Récupération des acteurs principaux du film
    fetch(castUrl, {
        cache: "no-store", // Ignorer le cache
        signal: controller.signal // Permet d’annuler la requête
    })
        .then(response => response.json()) // Conversion en JSON
        .then(data => {
            const actorsContainer = document.getElementById("actors-container"); // Section pour afficher les acteurs
            if (!actorsContainer) return; // Vérifie si l'élément HTML est bien présent avant d'ajouter du contenu

            let actorsHTML = ""; // Initialisation du contenu HTML à insérer
            data.cast.slice(0, 6).forEach(actor => { // Sélection des 6 premiers acteurs
                const profileUrl = actor.profile_path !== null 
                    ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` // URL de l'image de l'acteur
                    : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"; // Image par défaut

                // Création d'une carte pour chaque acteur avec sa photo et son rôle
                actorsHTML += `
                    <div class="col-md-2 text-center">
                        <img src="${profileUrl}" class="img-fluid rounded-circle mb-2" alt="${actor.name}">
                        <p><strong>${actor.name}</strong></p>
                        <p class="fst-italic"><strong>${actor.character}</strong></p>
                    </div>
                `;
            });

            actorsContainer.innerHTML = actorsHTML; // Ajout des cartes d'acteurs dans la section prévue
        })
        //Gestion des erreurs
        .catch(error => {
            afficherErreurGlobale(); // 👈 Appel ici
        });

    //  Récupération de la bande-annonce du film
    fetch(trailerUrl, {
        cache: "no-store", // Ignorer le cache
        signal: controller.signal // Permet d’annuler la requête
    })
        .then(response => response.json()) // Conversion en JSON
        .then(data => {
            const trailerContainer = document.getElementById("movie-trailer"); // Zone pour afficher la bande-annonce
            const trailer = data.results.find(video => video.site === "YouTube" && video.type === "Trailer"); // Recherche d'une vidéo de type "Trailer"

            if (trailer) {
                // Affichage de la bande-annonce YouTube dans un iframe
                trailerContainer.innerHTML = `
                    <iframe width="100%" height="315" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>
                `;
            } else {
                trailerContainer.innerHTML = "<p><strong>Aucune bande-annonce disponible.</strong></p>"; // Message si aucune bande-annonce trouvée
            }
        })
        .catch(error => {
            afficherErreurGlobale(); // 👈 Appel ici
        });

} else {
    console.error("Aucun ID de film trouvé dans l'URL.");
    afficherErreurGlobale(); // 👈 Appel ici
}

//  Récupération des plateformes de streaming proposant ce film
const watchUrl = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}`;

fetch(watchUrl, {
    cache: "no-store", // Ignorer le cache
    signal: controller.signal // Permet d’annuler la requête
    })
    .then(response => response.json())
    .then(data => {
        const providersContainer = document.getElementById("watch-providers"); // Zone d'affichage
        if (!providersContainer) return;

        const providers = data.results?.FR?.flatrate || []; // Filtrage des plateformes disponibles en France

        if (providers.length === 0) {
            providersContainer.innerHTML = "<p><strong>Aucune plateforme disponible.</strong></p>"; // Message si aucune plateforme trouvée
            return;
        }

        let providersHTML = ""; // Initialisation du HTML
        providers.forEach(provider => {
            const logoUrl = `https://image.tmdb.org/t/p/w200${provider.logo_path}`; // Logo de la plateforme
            providersHTML += `
                <div class="col-md-2 text-center">
                    <img src="${logoUrl}" class="img-fluid mb-2" alt="${provider.provider_name}">
                    <p>${provider.provider_name}</p>
                </div>
            `;
        });

        providersContainer.innerHTML = providersHTML; // Ajout des plateformes dans la page
    })
    //Gestion des erreurs
    .catch(error => {
        afficherErreurGlobale(); // 👈 Appel ici
    });

//  Récupération de la note moyenne du film
const ratingElement = document.getElementById("movie-rating");

fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=fr-FR`, {
    cache: "no-store", // Ignorer le cache
    signal: controller.signal // Permet d’annuler la requête
    })
    .then(response => response.json())
    .then(data => {
        ratingElement.textContent = data.vote_average.toFixed(1); // Affichage de la note arrondie à 1 décimale
    })
    //Gestion des erreurs
    .catch(error => {
        afficherErreurGlobale(); // 👈 Appel ici
    });

//  Récupération des avis des spectateurs
const reviewsList = document.getElementById("reviews-list");

fetch(`https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${apiKey}&language=fr-FR`, {
    cache: "no-store", // Ignorer le cache
    signal: controller.signal // Permet d’annuler la requête
    })
    .then(response => response.json())
    .then(data => {
        reviewsList.innerHTML = ""; // On vide la liste avant d'ajouter de nouveaux avis

        if (data.results.length === 0) {
            reviewsList.innerHTML = "<li class='list-group-item'>Aucun avis disponible.</li>"; // Message si aucun avis
            return;
        }

        data.results.slice(0, 5).forEach(review => { // On limite à 5 avis max
            const li = document.createElement("li");
            li.classList.add("list-group-item");
            li.innerHTML = `<strong>${review.author}</strong>: ${review.content.substring(0, 150)}...`; // Affichage limité à 150 caractères
            reviewsList.appendChild(li);
        });
    })
    //Gestion des erreurs
    .catch(error => {
        afficherErreurGlobale(); // 👈 Appel ici
    });
