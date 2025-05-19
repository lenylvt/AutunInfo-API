const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://www.autun-infos.com';

/**
 * Transforme une URL relative en URL absolue
 */
function getFullUrl(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('./')) return `${BASE_URL}${url.substring(1)}`;
  return `${BASE_URL}/${url}`;
}

/**
 * Récupère les derniers articles de la page d'accueil
 */
async function getLatestArticles() {
  try {
    const response = await axios.get(BASE_URL);
    const $ = cheerio.load(response.data);
    const articles = [];
    
    // Récupère tous les articles du bloc "Ça vient d'arriver"
    $('.newsListInfos').each((index, element) => {
      const timeElement = $(element).find('.newsListPubli').text().trim();
      const titleElement = $(element).find('.newsListTitle').text().trim();
      const contentElement = $(element).find('.newsListResume').text().trim();
      const imageElement = $(element).find('.newsListLeftImg').attr('src');
      const linkElement = $(element).find('a').attr('href');
      
      // Déterminer la catégorie et sous-catégorie à partir du lien
      let category = 'non-categorise';
      let subcategory = '';
      
      if (linkElement) {
        const urlParts = linkElement.split('/');
        if (urlParts.length >= 3) {
          // Si le lien commence par "./news/"
          const newsIndex = urlParts.indexOf('news');
          if (newsIndex !== -1 && urlParts.length > newsIndex + 1) {
            category = urlParts[newsIndex + 1] || 'non-categorise';
            subcategory = urlParts.length > newsIndex + 2 ? urlParts[newsIndex + 2] : '';
          }
        }
      }
      
      const article = {
        id: index + 1,
        title: titleElement,
        content: contentElement,
        publishDate: timeElement,
        imageUrl: getFullUrl(imageElement),
        url: getFullUrl(linkElement),
        category,
        subcategory
      };
      
      articles.push(article);
    });
    
    return articles;
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    return [];
  }
}

/**
 * Récupère les articles d'une catégorie spécifique
 */
async function getArticlesByCategory(category) {
  try {
    const response = await axios.get(`${BASE_URL}/news/${category}/`);
    const $ = cheerio.load(response.data);
    const articles = [];
    
    // Récupère tous les articles de la catégorie
    $('.newsListInfos').each((index, element) => {
      const timeElement = $(element).find('.newsListPubli').text().trim();
      const titleElement = $(element).find('.newsListTitle').text().trim();
      const contentElement = $(element).find('.newsListResume').text().trim();
      const imageElement = $(element).find('.newsListLeftImg').attr('src');
      const linkElement = $(element).find('a').attr('href');
      
      // Déterminer la sous-catégorie à partir du lien
      let subcategory = '';
      
      if (linkElement) {
        const urlParts = linkElement.split('/');
        const newsIndex = urlParts.indexOf('news');
        if (newsIndex !== -1 && urlParts.length > newsIndex + 2) {
          subcategory = urlParts[newsIndex + 2] || '';
        }
      }
      
      const article = {
        id: index + 1,
        title: titleElement,
        content: contentElement,
        publishDate: timeElement,
        imageUrl: getFullUrl(imageElement),
        url: getFullUrl(linkElement),
        category,
        subcategory
      };
      
      articles.push(article);
    });
    
    return articles;
  } catch (error) {
    console.error(`Erreur lors de la récupération des articles de la catégorie ${category}:`, error);
    return [];
  }
}

/**
 * Récupère les articles d'une sous-catégorie spécifique
 */
async function getArticlesBySubcategory(category, subcategory) {
  try {
    const response = await axios.get(`${BASE_URL}/news/${category}/${subcategory}/`);
    const $ = cheerio.load(response.data);
    const articles = [];
    
    // Récupère tous les articles de la sous-catégorie
    $('.newsListInfos').each((index, element) => {
      const timeElement = $(element).find('.newsListPubli').text().trim();
      const titleElement = $(element).find('.newsListTitle').text().trim();
      const contentElement = $(element).find('.newsListResume').text().trim();
      const imageElement = $(element).find('.newsListLeftImg').attr('src');
      const linkElement = $(element).find('a').attr('href');
      
      const article = {
        id: index + 1,
        title: titleElement,
        content: contentElement,
        publishDate: timeElement,
        imageUrl: getFullUrl(imageElement),
        url: getFullUrl(linkElement),
        category,
        subcategory
      };
      
      articles.push(article);
    });
    
    return articles;
  } catch (error) {
    console.error(`Erreur lors de la récupération des articles de la sous-catégorie ${subcategory}:`, error);
    return [];
  }
}

/**
 * Récupère le contenu d'un article spécifique
 */
async function getArticleContent(url) {
  try {
    // S'assurer que l'URL est complète
    const fullUrl = getFullUrl(url);
    if (!fullUrl) return null;
    
    const response = await axios.get(fullUrl);
    const $ = cheerio.load(response.data);
    
    // Récupère le contenu complet de l'article
    const title = $('.newsTitle').text().trim();
    const content = $('.newsContent').text().trim();
    const publishDate = $('.newsDateDetail').text().trim();
    const images = [];
    
    // Récupère toutes les images de l'article
    $('.newsContent img').each((index, element) => {
      const imageUrl = $(element).attr('src');
      if (imageUrl) {
        images.push(getFullUrl(imageUrl));
      }
    });
    
    return {
      title,
      content,
      publishDate,
      images,
      url: fullUrl
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération du contenu de l'article ${url}:`, error);
    return null;
  }
}

/**
 * Récupère la structure complète des catégories et sous-catégories
 */
async function getCategoriesStructure() {
  try {
    const response = await axios.get(BASE_URL);
    const $ = cheerio.load(response.data);
    const structure = [];
    
    // Parcourir les éléments de menu principal (les catégories)
    $('ul:not(.sub) > li > a[href*="./news/"]').each((index, element) => {
      const categoryUrl = $(element).attr('href');
      const categoryName = $(element).text().trim();
      
      if (categoryUrl && categoryName) {
        // Extraire l'identifiant de la catégorie à partir de l'URL
        const urlParts = categoryUrl.split('/');
        const categoryId = urlParts[urlParts.length - 2] || '';
        
        if (categoryId) {
          const category = {
            id: categoryId,
            name: categoryName,
            url: getFullUrl(categoryUrl),
            subcategories: []
          };
          
          // Récupérer les sous-catégories de cette catégorie
          $(element).parent().find('ul.sub li a').each((subIndex, subElement) => {
            const subcategoryUrl = $(subElement).attr('href');
            const subcategoryName = $(subElement).text().trim();
            
            if (subcategoryUrl && subcategoryName) {
              const subUrlParts = subcategoryUrl.split('/');
              const subcategoryId = subUrlParts[subUrlParts.length - 2] || '';
              
              if (subcategoryId) {
                category.subcategories.push({
                  id: subcategoryId,
                  name: subcategoryName,
                  url: getFullUrl(subcategoryUrl)
                });
              }
            }
          });
          
          structure.push(category);
        }
      }
    });
    
    return structure;
  } catch (error) {
    console.error('Erreur lors de la récupération de la structure des catégories:', error);
    return [];
  }
}

/**
 * Récupère toutes les catégories
 */
async function getAllCategories() {
  try {
    const structure = await getCategoriesStructure();
    return structure.map(category => ({
      id: category.id,
      name: category.name,
      url: category.url
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return [];
  }
}

/**
 * Récupère les sous-catégories d'une catégorie spécifique
 */
async function getSubcategories(category) {
  try {
    const structure = await getCategoriesStructure();
    const categoryData = structure.find(cat => cat.id === category);
    
    if (categoryData) {
      return categoryData.subcategories;
    }
    
    // Si la catégorie n'est pas trouvée dans la structure, on fait une requête directe
    const response = await axios.get(`${BASE_URL}/news/${category}/`);
    const $ = cheerio.load(response.data);
    const subcategories = [];
    
    // Récupère les sous-catégories de la catégorie spécifiée
    $('ul.sub li a').each((index, element) => {
      const link = $(element).attr('href');
      const name = $(element).text().trim();
      
      if (link && name) {
        const urlParts = link.split('/');
        const subcat = urlParts[urlParts.length - 2] || '';
        const parentCategory = urlParts[urlParts.length - 3] || '';
        
        // Vérifier que la sous-catégorie appartient bien à la catégorie demandée
        if (subcat && parentCategory === category) {
          subcategories.push({
            id: subcat,
            name: name,
            url: getFullUrl(link)
          });
        }
      }
    });
    
    return subcategories;
  } catch (error) {
    console.error(`Erreur lors de la récupération des sous-catégories de ${category}:`, error);
    return [];
  }
}

module.exports = {
  getLatestArticles,
  getArticlesByCategory,
  getArticlesBySubcategory,
  getArticleContent,
  getSubcategories,
  getAllCategories,
  getCategoriesStructure
}; 