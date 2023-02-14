import { useState } from 'react'
import reactLogo from './assets/react.svg'
import {Route, Routes, Outlet, BrowserRouter} from 'react-router-dom'

import {Home} from './Components/Home'
import { Quienes } from './Components/Quienes'
import { Privacidad } from './Components/Privacidad'
import { Terminos } from './Components/Terminos'

export function App() {

  return <BrowserRouter>
    <Routes>
      <Route path="/" element ={<Home/>}>
        <Route path="/quienes" element ={<Quienes/>}/>
        <Route path="/Privacidad" element ={<Privacidad/>}/>
        <Route path="/Terminos" element ={<Terminos/>}/>

      </Route>
    </Routes>
  </BrowserRouter>
    
}


