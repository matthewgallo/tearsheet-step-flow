import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import { Example } from './Example';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Example />
  </StrictMode>,
)
