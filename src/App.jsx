import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import LogoGenerator from './Pages/LogoGenerator.jsx'
import AvatarGenerator from './Pages/AvatarGenerator.jsx'
import ArchitectureGenerator from './Pages/ArchitectureGenerator.jsx'
import ProductGenerator from './Pages/ProductGenerator.jsx'
import AppUiGenerator from './Pages/AppUiGenerator.jsx'
import TattooGenerator from './Pages/TattooGenerator.jsx'
import ImageEditor from './Pages/ImageEditor.jsx'
import Projects from './Pages/Projects.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logo" element={<LogoGenerator />} />
        <Route path="/avatar" element={<AvatarGenerator />} />
        <Route path="/architecture" element={<ArchitectureGenerator />} />
        <Route path="/product" element={<ProductGenerator />} />
        <Route path="/ui" element={<AppUiGenerator />} />
        <Route path="/tattoo" element={<TattooGenerator />} />
        <Route path="/editor" element={<ImageEditor />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
