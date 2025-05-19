const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'vie-locale',
      'autour-d-autun',
      'grand-autunois-morvan',
      'faits-divers',
      'saone-et-loire',
      'bourgogne-franche-comte',
      'sport',
      'etat-civil',
      'naissances',
      'medias'
    ]
  },
  subcategory: {
    type: String,
    enum: {
      'vie-locale': ['cinema', 'pharmacie-de-garde', 'vie-locale', 'saison-culturelle'],
      'autour-d-autun': [
        'plateau-d-antully',
        'autour-d-autun',
        'la-grande-verriere',
        'parc-du-morvan',
        'haut-morvan',
        'anost',
        'vallee-du-mesvrin',
        'massif-d-uchon',
        'beuvray',
        'etang-sur-arroux',
        'epinacois',
        'epinac',
        'auxy',
        'curgy'
      ],
      'grand-autunois-morvan': [
        'agriculture',
        'atelier-hip-hop',
        'enfance-jeunesse',
        'habitat',
        'centre-nautique-de-l-autunois',
        'ordures-menageres',
        'numerique',
        'grand-autunois-morvan',
        'parc-des-expositions-l-eduen'
      ],
      'faits-divers': [
        'en-saone-et-loire',
        'a-autun',
        'autour-d-autun-2',
        'en-bourgogne-franche-comte',
        'ailleurs',
        'tribunal'
      ],
      'saone-et-loire': [
        'opinion',
        'conseil-departemental',
        'prefecture',
        'autre'
      ],
      'bourgogne-franche-comte': ['bourgogne-franche-comte'],
      'sport': [
        'sport-automobile',
        'golf',
        'jeux-olympiques',
        'football',
        'tennis',
        'tennis-de-table',
        'sport',
        'judo',
        'equitation',
        'athletisme',
        'rugby',
        'basket',
        'gymnastique'
      ],
      'etat-civil': ['avis-de-deces'],
      'naissances': ['carnets-roses-et-carnets-bleus'],
      'medias': ['dans-le-monde', 'en-france']
    }
  },
  imageUrl: {
    type: String
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  author: {
    type: String
  },
  tags: [{
    type: String
  }]
});

module.exports = mongoose.model('Article', articleSchema); 