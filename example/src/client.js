import templates from './templates';
import nocmsClient from '../nocms-render-server/client';

nocmsClient
  .setTemplates(templates)
  .render();
