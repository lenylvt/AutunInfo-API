# API Autun News

API REST qui récupère les articles du site d'actualités [Autun-infos.com](https://www.autun-infos.com/).

## Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn

## Installation

1. Cloner le repository
2. Installer les dépendances :
```bash
npm install
```

3. Créer un fichier `.env` à la racine du projet avec les variables suivantes :
```
PORT=5000
```

4. Démarrer le serveur :
```bash
npm start
```

Le serveur cherchera automatiquement un port disponible si le port 5000 est déjà utilisé.

## Routes disponibles

### Articles

- `GET /api/articles` - Obtenir tous les derniers articles
- `GET /api/articles/category/:category` - Obtenir les articles par catégorie
- `GET /api/articles/category/:category/subcategories` - Obtenir les sous-catégories d'une catégorie
- `GET /api/articles/subcategory/:category/:subcategory` - Obtenir les articles par sous-catégorie
- `GET /api/articles/content?url=URL_ARTICLE` - Obtenir le contenu complet d'un article spécifique
- `GET /api/articles/latest/:limit` - Obtenir les N derniers articles
- `GET /api/articles/categories` - Obtenir la liste des catégories disponibles
- `GET /api/articles/categories/structure` - Obtenir la structure complète des catégories et leurs sous-catégories

## Démonstration

Pour lancer une démonstration interactive des fonctionnalités de l'API :

```bash
npm run demo
```

## Fonctionnement

Cette API utilise le web scraping pour récupérer les données du site [Autun-infos.com](https://www.autun-infos.com/) en temps réel. Les données sont extraites à la volée à chaque requête, sans être stockées dans une base de données.

L'API récupère automatiquement la structure des catégories et sous-catégories du site, sans nécessiter de configuration manuelle.

## Format des données

### Article (Liste)

```json
{
  "id": 1,
  "title": "Titre de l'article",
  "content": "Résumé de l'article",
  "publishDate": "17H30",
  "imageUrl": "http://bourgogne-infos.com/medias/91607_1_news.jpg",
  "url": "https://www.autun-infos.com/news/vie-locale/cinema/article.html",
  "category": "vie-locale",
  "subcategory": "cinema"
}
```

### Contenu d'article

```json
{
  "title": "Titre complet de l'article",
  "content": "Contenu complet de l'article",
  "publishDate": "Lundi 20 Mai 2024 - 17:30",
  "images": [
    "http://bourgogne-infos.com/medias/91607_1_news.jpg",
    "http://bourgogne-infos.com/medias/91607_2_news.jpg"
  ],
  "url": "https://www.autun-infos.com/news/vie-locale/cinema/article.html"
}
```

### Catégorie

```json
{
  "id": "vie-locale",
  "name": "Vie locale",
  "url": "https://www.autun-infos.com/news/vie-locale/"
}
```

### Sous-catégorie

```json
{
  "id": "cinema",
  "name": "Cinéma",
  "url": "https://www.autun-infos.com/news/vie-locale/cinema/"
}
```

### Structure des catégories

```json
[
  {
    "id": "vie-locale",
    "name": "Vie locale",
    "url": "https://www.autun-infos.com/news/vie-locale/",
    "subcategories": [
      {
        "id": "cinema",
        "name": "Cinéma",
        "url": "https://www.autun-infos.com/news/vie-locale/cinema/"
      },
      {
        "id": "pharmacie-de-garde",
        "name": "Pharmacie de garde",
        "url": "https://www.autun-infos.com/news/vie-locale/pharmacie-de-garde/"
      }
    ]
  }
]
``` 