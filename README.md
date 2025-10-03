
# Cinéphile

Ce site web est est le produit final du projet de fin de semestre. Il s'agit d'une page web sur le thème du cinéma utilisant l'API publique TMDB et une API  personnalisée seulement effective pour la page "tendances.html". Elle offre de nombreuses fonctionnalitées telles que l'affichage des films à venir , les tendances du moment , les films les mieux notées de la plateforme... Il y a également un petit coin séries.
## Structure
### HTML

- `index.html` : Page d'accueil
- `derniersfilms.html ` : Affiche les derniers films sortis
- `details.html` : Affiche les détails d'un film (synopsis,acteurs...)
- `detailsseries.html` : Affiche les détails d'une série (nombres de saisons/épisosdes, doubleurs...)
- `filmsavenir.html` : Affiche les prochaines sorties de films
- `mieuxnote.html` : Affiche les films les mieux notés de la platforme TMDB
- `recherche.html` : Page qui est utilisée lorsque l'utilisateur utilise la barre de recherche
- `rechercheseries.html` : Identique à recherche.html pour la catégorie séries
- `series.html` :  Affiche différentes catégories de séries

### CSS
- `styles.css` : Fichier qui gère la stylisation du sortie

### Javascript
- `cle.js` : Script contenant la cle API de TMDB
- `films.js` : Sert à charger les films populaires et gère aussi la barre de recherche
- `recherche.js` : Sert à récupérer les films correspondant à un terme de recherche 
- `server.js` : Sert à créer un serveur web avec Express et une API personnalisée
- `derniersfilms.js` : Sert à récupérer les films actuellement en salle
- `details.js` : Sert à récupérer toutes les informations d’un film spécifique
- `detailsseries.js` : Idem que details.js mais pour les séries
- `filmsavenir.js` : Ce script sert à récupérer les prochaines sorties de films
- `mieuxnote.js` : Récupère les films les mieux notés
- `rechercheseries.js` : Sert à récupérer les séries correspondant à un terme de recherche 
- `series.js` : Récupère à récupérer différentes catégories de séries TV (populaires, mieux notées, tendances et en diffusion)
- `tendances.js` : Ce script va récupérer les films tendances du moment

## Installation

### Avertissement
Ne pas ouvrir index.html directement en cliquant dessus : cela marchera mais de nombreux bugs peuvent survenir tel que le refus du site d'afficher la band-annonce par exemple. Il est préferable d'utiliser le serveur local via la commande node dans un terminal comme expliqué ci-dessous

### Prérequis
Utilisé un navigateur web moderne (Google Chrome, Firefox,...). Firefox de préférence.

1. Clonez le projet : 
```bash
  git clone https://github.com/Lahcen7859/CinePhile.git
```
2. Ouvrez un Terminal

3. Déplacez- vous dans le répertoire JAVA (cd "nom du chemin d'accès")

4. Entrez cette commande : node server.js

5. Un lien vers le serveur du site s'affichera. Ouvrez le dans un navigateur.
    
## Auteurs

Ce projet a été réalisé par Lahcen IDLAHCEN dans le cadre d'un projet de fin de semestre en informatique.

