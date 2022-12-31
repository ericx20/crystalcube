import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ColorModeScript } from "@chakra-ui/react"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ColorModeScript />
    <BrowserRouter basename="/crystalcube">
      <ChakraProvider>
        {/* TODO: can we just say <App /> instead? */}
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
)
