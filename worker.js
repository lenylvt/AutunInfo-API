import { Router } from 'itty-router';
import * as cheerio from 'cheerio';

// Créer un routeur
const router = Router();

// Base URL de l'API
const BASE_URL = 'https://www.autun-infos.com';

// Middleware pour CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Fonction pour obtenir une URL complète
function getFullUrl(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('./')) return `${BASE_URL}${url.substring(1)}`;
  return `${BASE_URL}/${url}`;
}

// Route racine
router.get('/', () => {
  return new Response(JSON.stringify({
    name: 'Autun News API',
    version: '1.0.0',
    description: 'API REST qui récupère les articles du site Autun-infos.com',
    endpoints: [
      '/articles',
      '/articles/latest/:limit',
      '/articles/category/:category',
      '/articles/subcategory/:category/:subcategory',
      '/articles/content?url=...',
      '/articles/categories',
      '/articles/categories/structure',
    ],
  }), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
});

// Route OPTIONS pour CORS
router.options('*', () => {
  return new Response(null, {
    headers: corsHeaders,
  });
});

// Récupérer tous les articles récents
router.get('/articles', async () => {
  try {
    const response = await fetch(BASE_URL);
    const html = await response.text();
    const $ = cheerio.load(html);
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
        const newsIndex = urlParts.indexOf('news');
        if (newsIndex !== -1 && urlParts.length > newsIndex + 1) {
          category = urlParts[newsIndex + 1] || 'non-categorise';
          subcategory = urlParts.length > newsIndex + 2 ? urlParts[newsIndex + 2] : '';
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
    
    return new Response(JSON.stringify(articles), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
});

// Récupérer les derniers articles avec une limite
router.get('/articles/latest/:limit', async ({ params }) => {
  try {
    const limit = parseInt(params.limit) || 10;
    
    const response = await fetch(BASE_URL);
    const html = await response.text();
    const $ = cheerio.load(html);
    const articles = [];
    
    // Récupère tous les articles du bloc "Ça vient d'arriver"
    $('.newsListInfos').each((index, element) => {
      if (index >= limit) return;
      
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
        const newsIndex = urlParts.indexOf('news');
        if (newsIndex !== -1 && urlParts.length > newsIndex + 1) {
          category = urlParts[newsIndex + 1] || 'non-categorise';
          subcategory = urlParts.length > newsIndex + 2 ? urlParts[newsIndex + 2] : '';
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
    
    return new Response(JSON.stringify(articles), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
});

// Récupérer les articles par catégorie
router.get('/articles/category/:category', async ({ params }) => {
  try {
    const category = params.category;
    const response = await fetch(`${BASE_URL}/news/${category}/`);
    const html = await response.text();
    const $ = cheerio.load(html);
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
    
    return new Response(JSON.stringify(articles), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
});

// Récupérer les articles par sous-catégorie
router.get('/articles/subcategory/:category/:subcategory', async ({ params }) => {
  try {
    const { category, subcategory } = params;
    const response = await fetch(`${BASE_URL}/news/${category}/${subcategory}/`);
    const html = await response.text();
    const $ = cheerio.load(html);
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
    
    return new Response(JSON.stringify(articles), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
});

// Récupérer le contenu d'un article spécifique
router.get('/articles/content', async (request) => {
  try {
    const url = new URL(request.url).searchParams.get('url');
    if (!url) {
      return new Response(JSON.stringify({ error: 'URL de l\'article requise' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
    
    // S'assurer que l'URL est complète
    const fullUrl = getFullUrl(url);
    if (!fullUrl) {
      return new Response(JSON.stringify({ error: 'URL invalide' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
    
    const response = await fetch(fullUrl);
    const html = await response.text();
    const $ = cheerio.load(html);
    
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
    
    const articleContent = {
      title,
      content,
      publishDate,
      images,
      url: fullUrl
    };
    
    return new Response(JSON.stringify(articleContent), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
});

// Récupérer la structure complète des catégories et sous-catégories
router.get('/articles/categories/structure', async () => {
  try {
    const response = await fetch(BASE_URL);
    const html = await response.text();
    const $ = cheerio.load(html);
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
    
    return new Response(JSON.stringify(structure), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
});

// Récupérer toutes les catégories
router.get('/articles/categories', async () => {
  try {
    const response = await fetch(BASE_URL);
    const html = await response.text();
    const $ = cheerio.load(html);
    const categories = [];
    
    // Parcourir les éléments de menu principal (les catégories)
    $('ul:not(.sub) > li > a[href*="./news/"]').each((index, element) => {
      const categoryUrl = $(element).attr('href');
      const categoryName = $(element).text().trim();
      
      if (categoryUrl && categoryName) {
        // Extraire l'identifiant de la catégorie à partir de l'URL
        const urlParts = categoryUrl.split('/');
        const categoryId = urlParts[urlParts.length - 2] || '';
        
        if (categoryId) {
          categories.push({
            id: categoryId,
            name: categoryName,
            url: getFullUrl(categoryUrl)
          });
        }
      }
    });
    
    return new Response(JSON.stringify(categories), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
});

// Récupérer les sous-catégories d'une catégorie spécifique
router.get('/articles/category/:category/subcategories', async ({ params }) => {
  try {
    const category = params.category;
    const response = await fetch(BASE_URL);
    const html = await response.text();
    const $ = cheerio.load(html);
    const subcategories = [];
    
    // Trouver la catégorie spécifique dans la navigation
    $(`ul:not(.sub) > li > a[href*="./news/${category}/"]`).each((index, element) => {
      // Récupérer les sous-catégories
      $(element).parent().find('ul.sub li a').each((subIndex, subElement) => {
        const subcategoryUrl = $(subElement).attr('href');
        const subcategoryName = $(subElement).text().trim();
        
        if (subcategoryUrl && subcategoryName) {
          const urlParts = subcategoryUrl.split('/');
          const subcategoryId = urlParts[urlParts.length - 2] || '';
          const parentCategory = urlParts[urlParts.length - 3] || '';
          
          // Vérifier que la sous-catégorie appartient bien à la catégorie demandée
          if (subcategoryId && parentCategory === category) {
            subcategories.push({
              id: subcategoryId,
              name: subcategoryName,
              url: getFullUrl(subcategoryUrl)
            });
          }
        }
      });
    });
    
    // Si aucune sous-catégorie trouvée, essayer de les récupérer directement depuis la page de catégorie
    if (subcategories.length === 0) {
      const catResponse = await fetch(`${BASE_URL}/news/${category}/`);
      const catHtml = await catResponse.text();
      const $cat = cheerio.load(catHtml);
      
      $cat('ul.sub li a').each((index, element) => {
        const subcategoryUrl = $cat(element).attr('href');
        const subcategoryName = $cat(element).text().trim();
        
        if (subcategoryUrl && subcategoryName) {
          const urlParts = subcategoryUrl.split('/');
          const subcategoryId = urlParts[urlParts.length - 2] || '';
          const parentCategory = urlParts[urlParts.length - 3] || '';
          
          // Vérifier que la sous-catégorie appartient bien à la catégorie demandée
          if (subcategoryId && parentCategory === category) {
            subcategories.push({
              id: subcategoryId,
              name: subcategoryName,
              url: getFullUrl(subcategoryUrl)
            });
          }
        }
      });
    }
    
    return new Response(JSON.stringify(subcategories), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
});

// Gestion des routes non trouvées
router.all('*', () => {
  return new Response(JSON.stringify({ error: 'Route non trouvée' }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
});

// Fonction de gestion des requêtes
export default {
  async fetch(request, env, ctx) {
    return router.fetch(request, env, ctx);
  },
}; 