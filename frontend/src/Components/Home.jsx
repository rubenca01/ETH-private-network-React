import {Route, Routes, Outlet, BrowserRouter} from 'react-router-dom'

import { Header } from './Header'
import { Footer } from './Footer'

export function Home() {
    return <div className='d-flex flex-column'>
        <div><Header/></div>
        <div className='pb-5'><Outlet/></div>
        <div><Footer/></div>
    </div>
}