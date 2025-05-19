const scraper = require('./services/scraper');

// Fonction pour afficher les articles de manière lisible
function displayArticles(articles) {
  console.log(`\nNombre d'articles trouvés: ${articles.length}\n`);
  
  articles.forEach((article, index) => {
    console.log('----------------------------------------------');
    console.log(`Article #${index + 1}`);
    console.log('----------------------------------------------');
    console.log(`Titre: ${article.title}`);
    console.log(`Date: ${article.publishDate}`);
    console.log(`Catégorie: ${article.category}`);
    console.log(`Sous-catégorie: ${article.subcategory}`);
    if (article.imageUrl) {
      console.log(`Image: ${article.imageUrl}`);
    }
    console.log(`Contenu: ${article.content.substring(0, 100)}...`);
    console.log(`URL: ${article.url}\n`);
  });
}

// Fonction pour afficher le contenu d'un article
function displayArticleContent(content) {
  console.log('\n----------------------------------------------');
  console.log('Contenu de l\'article');
  console.log('----------------------------------------------');
  console.log(`Titre: ${content.title}`);
  console.log(`Date: ${content.publishDate}`);
  console.log(`Contenu: ${content.content.substring(0, 200)}...`);
  console.log('Images:');
  content.images.forEach((image, index) => {
    console.log(`  ${index + 1}. ${image}`);
  });
  console.log('\n');
}

// Fonction pour afficher les sous-catégories
function displaySubcategories(subcategories) {
  console.log('\n----------------------------------------------');
  console.log('Sous-catégories disponibles');
  console.log('----------------------------------------------');
  
  subcategories.forEach((subcat, index) => {
    console.log(`${index + 1}. ${subcat.name} (id: ${subcat.id})`);
    console.log(`   URL: ${subcat.url}`);
  });
  
  console.log('\n');
}

// Fonction pour afficher la structure des catégories
function displayCategoriesStructure(structure) {
  console.log('\n==============================================');
  console.log('STRUCTURE DES CATÉGORIES');
  console.log('==============================================\n');
  
  structure.forEach((category, index) => {
    console.log(`Catégorie ${index + 1}: ${category.name} (${category.id})`);
    console.log(`URL: ${category.url}`);
    console.log('Sous-catégories:');
    
    if (category.subcategories && category.subcategories.length > 0) {
      category.subcategories.forEach((subcat, subIndex) => {
        console.log(`  ${subIndex + 1}. ${subcat.name} (${subcat.id})`);
        console.log(`     URL: ${subcat.url}`);
      });
    } else {
      console.log('  Aucune sous-catégorie');
    }
    
    console.log('----------------------------------------------');
  });
}

// Tests des différentes fonctions du scraper
async function runDemo() {
  console.log('==============================================');
  console.log('DÉMONSTRATION DE L\'API AUTUN NEWS');
  console.log('==============================================\n');
  
  console.log('1. Récupération automatique de la structure des catégories...');
  const structure = await scraper.getCategoriesStructure();
  const nbCategories = structure.length;
  const totalSubcategories = structure.reduce((acc, cat) => acc + cat.subcategories.length, 0);
  
  console.log(`\nTrouvé ${nbCategories} catégories et ${totalSubcategories} sous-catégories`);
  
  // Afficher les 3 premières catégories pour l'exemple
  displayCategoriesStructure(structure.slice(0, 3));
  
  console.log('2. Récupération des derniers articles...');
  const latestArticles = await scraper.getLatestArticles();
  displayArticles(latestArticles.slice(0, 5)); // Afficher les 5 premiers articles
  
  if (latestArticles.length > 0) {
    console.log('3. Récupération des articles de la catégorie "sport"...');
    const sportArticles = await scraper.getArticlesByCategory('sport');
    displayArticles(sportArticles.slice(0, 3)); // Afficher les 3 premiers articles
    
    console.log('4. Récupération des sous-catégories de "sport"...');
    const sportSubcategories = await scraper.getSubcategories('sport');
    displaySubcategories(sportSubcategories);
    
    console.log('5. Récupération du contenu d\'un article spécifique...');
    if (latestArticles[0].url) {
      const articleContent = await scraper.getArticleContent(latestArticles[0].url);
      if (articleContent) {
        displayArticleContent(articleContent);
      } else {
        console.log('Impossible de récupérer le contenu de l\'article.');
      }
    }
  }
  
  console.log('Démonstration terminée!');
}

// Exécuter la démonstration
runDemo().catch(err => console.error('Erreur pendant la démonstration:', err)); 