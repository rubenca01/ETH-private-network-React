
import { Link } from "react-router-dom"
import ethLogo from '../assets/eth.png'

export function Header() {
    return <div className='my-2 d-flex justify-content-between'>
        <div className="d-flex">
            <div className="align-self-center mh-100">
                <img style={{ width: 50, height: 50 }} src={ ethLogo}></img>
                {/* <img src={require ('../assets/eth.png')}/> */}
            </div>
            <Link to="/" className="fs-4 align-self-center text-decoration-none">Build Private Ethereum Networks</Link>
        </div>
{/*         <div className="d-flex justify-content-end">
            <div className="dropdown show">
                <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Red
                </a>

                <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <a className="dropdown-item" href="/privacidad">Crear</a>
                    <a className="dropdown-item" href="/privacidad">Consultar</a>
                </div>
            </div>
        </div> */}
    </div>
}