import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './index.css';
import { ensureSeed } from './store/seed';

registerSW({ immediate: true });

async function bootstrap() {
  await ensureSeed();

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}

bootstrap().catch((err) => {
  console.error('Failed to bootstrap application', err);
});
