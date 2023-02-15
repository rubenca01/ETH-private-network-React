import { useState } from 'react'
import reactLogo from './assets/react.svg'
import {Route, Routes, Outlet, BrowserRouter} from 'react-router-dom'
import {QueryClient, QueryClientProvider} from 'react-query'

import {Home} from './Components/Home'
import { Quienes } from './Components/Quienes'
import { Privacidad } from './Components/Privacidad'
import { Terminos } from './Components/Terminos'
import { Welcome } from './Components/Welcome'

const queryClient = new QueryClient()  

export function App() {

  return <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element ={<Home/>}>
          <Route path="*" element ={<Welcome/>}/>
          <Route index element ={<Welcome/>}/>
          <Route path="/quienes" element ={<Quienes/>}/>
          <Route path="/Privacidad" element ={<Privacidad/>}/>
          <Route path="/Terminos" element ={<Terminos/>}/>

        </Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
    
}


