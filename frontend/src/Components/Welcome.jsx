import ethLogo from '../assets/eth.png'

import { ListaRed } from './ListaRed'

export function Welcome() {
    return <div className="d-flex justify-content-center">
        <div className="d-flex flex-column w-50">
            <div className='align-self-center'>
                <img style={{ width: 200, height: 200 }} src={ ethLogo}></img>
            </div>
            <h2 className="text-center">Bienvenido a Build Private Ethereum Networks</h2>
        
            <a className="btn btn-outline-secondary m-1" href="/NuevaRed" role="button">Crear red</a>
            <div className='d-flex justify-content-center'><ListaRed/></div>
            
        </div>
    </div>
}