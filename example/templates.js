import React from 'react';

import FrontPage from '../src/nocms/components/templates/Frontpage.jsx';
import Article from '../src/nocms/components/templates/Article.jsx';
import Contact from '../src/nocms/components/templates/Contact.jsx';
import ErrorPage from '../src/nocms/components/templates/ErrorPage.jsx';
import sectionData from './sections';

// skille ut i helperfil et sted (utils?)
const getSectionData = (sections) => {
  const data = sections.map((section) => {
    return sectionData.find((item) => {
      // @TODO: gi warning dersom ikke finnes/find returnerer undefined?
      return item.name === section;
    });
  });
  return data;
};

export default [
  {
    id: 'frontpage',
    component: <FrontPage />,
    name: {
      no: 'Forside',
      en: 'Frontpage',
    },
    siteTemplate: true,
    sections: [],
  },
  {
    id: 'article',
    component: <Article />,
    name: {
      no: 'Artikkel',
      en: 'Article',
    },
    siteTemplate: true,
    sections: getSectionData([
      'chapter',
      'chapterWithSubHeader',
      'bodyText',
      'image',
      'quote',
      'blogposts',
      'latestBlogpost',
      'news',
      'cta',
      'fourblockteaser',
      'paragraphWithImage',
    ]),
  },
  {
    id: 'contact',
    component: <Contact />,
    name: {
      no: 'Kontaktside',
      en: 'Contact',
    },
    siteTemplate: true,
    sections: getSectionData([
      'chapter', 'bodyText', 'paragraphWithImage', 'quote', 'image', 'code',
    ]),
  },
  {
    id: 'errorPage',
    component: <ErrorPage />,
    name: {
      no: 'Feilside',
      en: 'Error page',
    },
    siteTemplate: false,
    sections: [],
  },
];

