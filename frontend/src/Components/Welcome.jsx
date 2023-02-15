import ethLogo from '../assets/eth.png'

export function Welcome() {
    return <div className="d-flex justify-content-center">
        <div className="d-flex flex-column w-50">
            <div className='align-self-center'>
                <img style={{ width: 300, height: 300 }} src={ ethLogo}></img>
            </div>
            <h2 className="text-center">Bienvenido a Build Private Ethereum Networks</h2>
        
            <a className="btn btn-outline-secondary m-1" href="/Privacidad" role="button">Crear red</a>
            <a className="btn btn-outline-secondary m-1" href="/Privacidad" role="button">Consultar red</a>
        </div>
    </div>
}