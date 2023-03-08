import { useState, createContext } from 'react'
import reactLogo from './assets/react.svg'
import {Route, Routes, Outlet, BrowserRouter} from 'react-router-dom'
import {QueryClient, QueryClientProvider} from 'react-query'

import {Home} from './Components/Home'
import { Quienes } from './Components/Quienes'
import { Privacidad } from './Components/Privacidad'
import { Terminos } from './Components/Terminos'
import { Welcome } from './Components/Welcome'
import { RedDetail } from './Components/RedDetail'
import { NuevaRed } from './Components/NuevaRed'
import { BlockDetail } from './Components/BlockDetail'
import { TxDetail } from './Components/TxDetail'
import { Balance } from './Components/Balance'

const queryClient = new QueryClient()  
export const Context = createContext(null)

export function App() {
  const [estado, setEstado]= useState(null)
  return <Context.Provider value={[estado, setEstado]}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element ={<Home/>}>
            <Route path="*" element ={<Welcome/>}/>
            <Route index element ={<Welcome/>}/>
            <Route path="/quienes" element ={<Quienes/>}/>
            <Route path="/Privacidad" element ={<Privacidad/>}/>
            <Route path="/Terminos" element ={<Terminos/>}/>
            <Route path="/red/:numero" element={<RedDetail/>}/>
            <Route path="/Nuevared" element={<NuevaRed/>}/>
            <Route path="/Block/:networkid/:block" element={<BlockDetail/>}/>
            <Route path="/transaction/:networkid/:TxHash" element={<TxDetail/>}/>
            <Route path="/balance/:networkid/:address" element={<Balance/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </Context.Provider>
    
}


