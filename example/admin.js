import nocmsAdminClient from '../nocms-render-server/client/admin';
import templates from './templates';
import sections from './sections';
import lang from './languages';

nocmsAdminClient
  .setSections(sections)
  .setTemplates(templates)
  .setLanguages(lang)
  .render();

