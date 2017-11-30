const folders = {
  content: {
    no: 'Innhold og tekst',
    en: 'Content and texts',
  },
  special: {
    no: 'Spesialkomponenter',
    en: 'Special components',
  },
  media: {
    no: 'Media',
    en: 'Media',
  },
  newsAndBlogs: {
    no: 'Nyheter og blog',
    en: 'News and blog',
  },
  all: {
    no: 'Alle typer',
    en: 'All types',
  },
};

const sectionData = [
  {
    name: 'banner',
    description: '',
    categories: [],
    icon: '',
    label: {
      no: 'Artikkel-header',
      en: 'Article header',
    },
  },
  {
    name: 'chapter',
    description: '',
    categories: [folders.content, folders.all],
    icon: '',
    label: {
      no: 'Kapittel',
      en: 'Chapter',
    },
  },
  {
    name: 'chapterWithSubHeader',
    description: '',
    categories: [folders.content, folders.all],
    icon: '',
    label: {
      no: 'Kapittel med underoverskrift',
      en: 'Chapter with sub header',
    },
  },
  {
    name: 'bodyText',
    description: '',
    categories: [folders.content, folders.all],
    icon: '',
    label: {
      no: 'Brødtekst',
      en: 'Body text',
    },
  },
  {
    name: 'paragraphWithImage',
    description: '',
    categories: [folders.content, folders.all],
    icon: '',
    label: {
      no: 'Paragraf med bilde',
      en: 'Paragraph with image',
    },
  },
  {
    name: 'quote',
    description: '',
    categories: [folders.special, folders.all],
    icon: '',
    label: {
      no: 'Sitat',
      en: 'Quote',
    },
  },
  {
    name: 'image',
    description: '',
    categories: [folders.media, folders.all],
    icon: '',
    label: {
      no: 'Bilde',
      en: 'Image',
    },
  },
  {
    name: 'code',
    description: '',
    categories: [folders.special, folders.all],
    icon: '',
    label: {
      no: 'Kodeblokk',
      en: 'Code',
    },
  },
  {
    name: 'pdf',
    description: '',
    categories: [folders.media, folders.all],
    icon: '',
    label: {
      no: 'PDF',
      en: 'PDF',
    },
  },
  {
    name: 'blogposts',
    description: '',
    categories: [folders.newsAndBlogpost, folders.all],
    icon: '',
    label: {
      no: 'Bloggpost',
      en: 'Blog post',
    },
  },
  {
    name: 'latestBlogpost',
    description: '',
    categories: [folders.newsAndBlogpost, folders.all],
    icon: '',
    label: {
      no: 'Siste fra fagbloggen',
      en: 'Latest from the blog',
    },
  },
  {
    name: 'news',
    description: '',
    categories: [folders.newsAndBlogpost, folders.all],
    icon: '',
    label: {
      no: 'Nyheter',
      en: 'News',
    },
  },
  {
    name: 'cta',
    description: '',
    categories: [folders.special, folders.all],
    icon: '',
    label: {
      no: 'Lenkeknapp',
      en: 'Call2Action button',
    },
  },
  {
    name: 'fourblockteaser',
    description: '',
    categories: [folders.special, folders.all],
    icon: '',
    label: {
      no: '4-blokk',
      en: 'Four block teaser',
    },
  },
];

export default sectionData;
