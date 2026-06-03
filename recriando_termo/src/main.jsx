import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import Jogo from './Jogo.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Jogo />
  </StrictMode>
);
