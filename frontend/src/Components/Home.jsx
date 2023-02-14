import {Route, Routes, Outlet, BrowserRouter} from 'react-router-dom'

import { Header } from './Header'
import { Footer } from './Footer'

export function Home() {
    return <div>
        <Header/>
        Home - text to delete later on
        <Outlet/>
        <Footer/>
    </div>
}