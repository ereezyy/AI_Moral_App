import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import App from './App.tsx';
import './index.css';

// Initialize TensorFlow.js backend before rendering
tf.setBackend('webgl');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
