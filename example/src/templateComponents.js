export const templateComponents = {
  article: [
    'chapter',
    'chapterWithSubHeader',
    'bodyText',
    'image',
    'quote',
    'esi',
    'blogposts',
    'latestBlogpost',
    'news',
    'cta',
    'fourblockteaser',
    'paragraphWithImage',
  ],
  blogpost: [
    'chapter', 'bodyText', 'paragraphWithImage', 'quote', 'image', 'code',
  ],
  newsPage: [
    'chapter', 'image', 'pdf',
  ],
};

export const templateSectionCategories = [
  {
    name: 'content',
    sections: [
      'chapter',
      'bodyText',
      'chapterWithSubHeader',
      'paragraphWithImage',
    ],
  },
  {
    name: 'media',
    sections: [
      'youtube', 'image', 'pdf',
    ],
  },
  {
    name: 'special',
    sections: [
      'cta',
      'fourblockteaser',
      'quote',
    ],
  },
  {
    name: 'newsAndBlogs',
    sections: [
      'news',
      'blogposts',
      'latestBlogpost',
    ],
  },
  {
    name: 'all',
    sections: [
      'banner',
      'chapter',
      'chapterWithSubHeader',
      'bodyText',
      'paragraphWithImage',
      'youtube',
      'quote',
      'random_quote',
      'esi',
      'image',
      'code',
      'pdf',
      'blogposts',
      'latestBlogpost',
      'news',
      'cta',
      'fourblockteaser',
    ],
  },
];

export const templateSectionData = {
  icons: {
    blogposts: 'restaurant',
    latestBlogpost: 'restaurant',
    news: 'restaurant',
    chapter: 'restaurant',
    bodyText: 'restaurant',
    chapterWithSubHeader: 'restaurant',
    paragraphWithImage: 'restaurant',
    youtube: 'movie',
    quote: 'format_quote',
    random_quote: 'format_quote',
    esi: 'format_quote',
    image: 'add_a_photo',
    code: 'code',
    pdf: 'picture_as_pdf',
    cta: 'restaurant',
    fourblockteaser: 'restaurant',
  },
  labels: {
    blogposts: 'Fagblogg',
    latestBlogpost: 'Siste fra fagbloggen',
    news: 'Nyheter',
    chapter: 'Avsnitt',
    chapterWithSubHeader: 'Avsnitt med undertittel',
    paragraphWithImage: 'Paragraf med bilde',
    youtube: 'Youtube',
    quote: 'Sitat',
    random_quote: 'Tilfeldig sitat',
    esi: 'Ekstern komponent',
    image: 'Bilde',
    code: 'Formatert kodeblokk',
    pdf: 'PDF',
    cta: 'Call-to-action knapp',
    fourblockteaser: '2x2 Teaser',
    bodyText: 'Brødtekst',
  },
  folders: {
    content: 'Innhold og tekst',
    special: 'Spesialkomponenter',
    media: 'Media',
    newsAndBlogs: 'Nyheter og blog',
    all: 'Alle typer',
  },
};
