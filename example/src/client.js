import templates from './templates';
import { clientApp } from 'nocms-server/clientApp';

clientApp
  .setTemplates(templates)
  .render();
