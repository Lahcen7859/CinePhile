function afficherErreurGlobale() {
    const mainContent = document.getElementById("principal2"); // Sélectionne le conteneur contenant le contenu principal
    if (mainContent) mainContent.classList.add("d-none"); //  Le masque si conditions vérifiée

    const errorPage = document.getElementById("error-page2"); // Sélectionne le bloc d'erreur du HTML
    if (errorPage) errorPage.classList.remove("d-none"); // L'affiche si la conditions est vérifiée
}


// 📌 Récupérer l'ID de la série depuis l'URL de la page actuelle
const urlParams = new URLSearchParams(window.location.search);
const seriesId = urlParams.get('id'); // Extraction du paramètre 'id'

// 📌 Vérifier si un ID de série est présent avant de faire les requêtes API
if (seriesId) {
    // 🔗 Définition des URLs pour récupérer les différentes informations de la série via l'API TMDb
    const seriesUrl = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}&language=fr-FR`;
    const castUrl = `https://api.themoviedb.org/3/tv/${seriesId}/credits?api_key=${apiKey}&language=fr-FR`;
    const trailerUrl = `https://api.themoviedb.org/3/tv/${seriesId}/videos?api_key=${apiKey}&language=fr-FR`;
    const watchUrl = `https://api.themoviedb.org/3/tv/${seriesId}/watch/providers?api_key=${apiKey}`;
    const reviewsUrl = `https://api.themoviedb.org/3/tv/${seriesId}/reviews?api_key=${apiKey}&language=fr-FR`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000); // ⏱ 1 secondes max

    // 📌 Récupération des détails de la série
    fetch(seriesUrl, {
        cache: "no-store", // Ignorer le cache
        signal: controller.signal // Permet d’annuler la requête
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById("series-title").textContent = data.name;
            document.getElementById("series-poster").src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
            document.getElementById("first-air-date").textContent = data.first_air_date;
            document.getElementById("seasons").textContent = data.number_of_seasons;
            document.getElementById("episodes").textContent = data.number_of_episodes;
            document.getElementById("series-overview").textContent = data.overview;
            document.getElementById("series-rating").textContent = data.vote_average.toFixed(1);
        })
        // Gestion des erreurs
        .catch(error => {
            console.error("Erreur lors du chargement des détails :", error); // Message dans la console
            afficherErreurGlobale(); // Appel ici de la fonction
        });

    // 📌 Chargement du casting principal (acteurs)
    fetch(castUrl, {
        cache: "no-store", // Ignorer le cache
        signal: controller.signal // Permet d’annuler la requête
    })
        .then(response => response.json())
        .then(data => {
            const actorsContainer = document.getElementById("actors-container");

            let actorsHTML = "";
            data.cast.slice(0, 6).forEach(actor => { // On limite l'affichage aux 6 premiers acteurs
                const profileUrl = actor.profile_path !== null
                    ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` // URL de la photo de l'acteur
                    : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"; // Image par défaut

                // Ajout de chaque acteur sous forme de carte avec son nom et son rôle
                actorsHTML += `
                    <div class="col-md-2 text-center">
                        <img src="${profileUrl}" class="img-fluid rounded-circle mb-2">
                        <p><strong>${actor.name}</strong></p>
                        <p class="fst-italic">${actor.character}</p>
                    </div>
                `;
            });

            // 📌 Insertion des acteurs dans la page
            actorsContainer.innerHTML = actorsHTML;
        })
        // Gestion des erreurs
        .catch(error => {
            console.error("Erreur lors du chargement des détails :", error); // Message dans la console
            afficherErreurGlobale(); // Appel ici de la fonction
        });

    // 📌 Chargement de la bande-annonce (YouTube)
    fetch(trailerUrl, {
        cache: "no-store", // Ignorer le cache
        signal: controller.signal // Permet d’annuler la requête
    })
        .then(response => response.json())
        .then(data => {
            const trailerContainer = document.getElementById("series-trailer");
            const trailer = data.results.find(video => video.site === "YouTube" && video.type === "Trailer");

            if (trailer) {
                // ✅ Si une bande-annonce existe, on l'affiche via un iframe YouTube
                trailerContainer.innerHTML = `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>`;
            } else {
                // ❌ Message indiquant qu'aucune bande-annonce n'est disponible
                trailerContainer.innerHTML = "<p><strong>Aucune bande-annonce disponible.</strong></p>";
            }
        })
        // Gestion des erreurs
        .catch(error => {
            console.error("Erreur lors du chargement des détails :", error); // Message dans la console
            afficherErreurGlobale(); // Appel ici de la fonction
        });

    // 📌 Chargement des plateformes de streaming où la série est disponible
    fetch(watchUrl, {
        cache: "no-store", // Ignorer le cache
        signal: controller.signal // Permet d’annuler la requête
    })
        .then(response => response.json())
        .then(data => {
            const providersContainer = document.getElementById("watch-providers");
            const providers = data.results?.FR?.flatrate || []; // Récupération des services de streaming pour la France

            if (providers.length > 0) {
                let providersHTML = "";
                providers.forEach(provider => {
                    const logoUrl = `https://image.tmdb.org/t/p/w200${provider.logo_path}`;
                    providersHTML += `
                        <div class="col-3 col-md-2 text-center">
                            <img src="${logoUrl}" class="img-fluid mb-2" style="max-width: 80px; max-height: 80px;">
                            <p class="small">${provider.provider_name}</p>
                        </div>
                    `;
                });

                // ✅ Affichage des plateformes de streaming disponibles
                providersContainer.innerHTML = providersHTML;
            } else {
                // ❌ Message si aucune plateforme ne diffuse la série
                providersContainer.innerHTML = "<p><strong>Aucune plateforme disponible.</strong></p>";
            }
        })
        // Gestion des erreurs
        .catch(error => {
            console.error("Erreur lors du chargement des détails :", error); // Message dans la console
            afficherErreurGlobale(); // Appel ici de la fonction
        });

    // 📌 Chargement des avis des spectateurs
    fetch(reviewsUrl, {
        cache: "no-store", // Ignorer le cache
        signal: controller.signal // Permet d’annuler la requête
    })
        .then(response => response.json())
        .then(data => {
            const reviewsList = document.getElementById("reviews-list");
            reviewsList.innerHTML = ""; // Réinitialisation de la liste

            if (data.results.length === 0) {
                // ❌ Affichage d'un message si aucun avis n'est disponible
                reviewsList.innerHTML = "<li class='list-group-item'>Aucun avis disponible.</li>";
                return;
            }

            // ✅ Affichage des 5 premiers avis des spectateurs
            data.results.slice(0, 5).forEach(review => {
                const li = document.createElement("li");
                li.classList.add("list-group-item");
                li.innerHTML = `<strong>${review.author}</strong>: ${review.content.substring(0, 150)}...`;
                reviewsList.appendChild(li);
            });
        })
        // Gestion des erreurs
        .catch(error => {
            console.error("Erreur lors du chargement des détails :", error); // Message dans la console
            afficherErreurGlobale(); // Appel ici de la fonction
        });
}
