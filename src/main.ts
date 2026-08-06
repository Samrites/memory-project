import './styles/main.scss';
import { startRouter } from './app/router';

function initApp(): void {
  const appRoot = document.getElementById('app');
  if (!appRoot) {
    return;
  }

  startRouter(appRoot);
}

initApp();
