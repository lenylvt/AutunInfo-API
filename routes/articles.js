const router = require('express').Router();
const scraper = require('../services/scraper');

// Obtenir tous les articles (dernières actualités)
router.get('/', async (req, res) => {
  try {
    const articles = await scraper.getLatestArticles();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtenir les articles par catégorie
router.get('/category/:category', async (req, res) => {
  try {
    const articles = await scraper.getArticlesByCategory(req.params.category);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtenir les articles par sous-catégorie
router.get('/subcategory/:category/:subcategory', async (req, res) => {
  try {
    const articles = await scraper.getArticlesBySubcategory(
      req.params.category,
      req.params.subcategory
    );
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtenir le contenu d'un article spécifique
router.get('/content', async (req, res) => {
  try {
    if (!req.query.url) {
      return res.status(400).json({ message: 'URL de l\'article requise' });
    }
    
    const articleContent = await scraper.getArticleContent(req.query.url);
    if (!articleContent) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    
    res.json(articleContent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtenir les dernières actualités avec limite
router.get('/latest/:limit', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    const articles = await scraper.getLatestArticles();
    res.json(articles.slice(0, limit));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtenir les catégories disponibles
router.get('/categories', async (req, res) => {
  try {
    const categories = await scraper.getAllCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtenir la structure complète des catégories et sous-catégories
router.get('/categories/structure', async (req, res) => {
  try {
    const structure = await scraper.getCategoriesStructure();
    res.json(structure);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtenir les sous-catégories d'une catégorie
router.get('/category/:category/subcategories', async (req, res) => {
  try {
    const subcategories = await scraper.getSubcategories(req.params.category);
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 