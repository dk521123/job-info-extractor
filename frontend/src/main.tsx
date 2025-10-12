import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppOCRUpload from './AppOCRUpload.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppOCRUpload />
  </StrictMode>,
)
