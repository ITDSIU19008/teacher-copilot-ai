import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import App from './App.jsx'

import {

  LessonProvider

} from './context/LessonContext'

import {

  ContentProvider

} from "./context/ContentContext";

createRoot(

  document.getElementById('root')

).render(

  <StrictMode>

    <LessonProvider>

      <ContentProvider>

        <App />

      </ContentProvider>

    </LessonProvider>

  </StrictMode>
)