import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.less';
import { loggingService } from './services/logging.service';

// Bắt toàn bộ lỗi runtime JS và promise rejection trên client
window.addEventListener('error', (event) => {
  loggingService.logClientError(event.error || { message: event.message, filename: event.filename, lineno: event.lineno });
});

window.addEventListener('unhandledrejection', (event) => {
  loggingService.logClientError(event.reason || { message: 'Unhandled Promise Rejection' });
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
