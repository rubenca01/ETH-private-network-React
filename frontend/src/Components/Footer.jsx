import { Link } from "react-router-dom"

import logoFB from '../assets/logoFB.png'
import logogithub from '../assets/logogithub.png'
import logoinsta from '../assets/logoinsta.png'

export function Footer() {
    return  <div className="d-flex justify-content-around mt-4 fixed-bottom bg-secondary">
        <Link to="/quienes" className="text-decoration-none text-light" target="_blank">Quienes somos?</Link>
        <Link to="/privacidad" className="text-decoration-none text-light" target="_blank">Privacidad</Link>
        <Link to="/terminos" className="text-decoration-none text-light" target="_blank">Terminos & condiciones</Link>
        <div className="d-flex justify-content-between m-2">
            <a href="http://facebook.com" target="_blank"><img className="m-1" style={{ width: 20, height: 20 }} src={ logoFB} alt={"logoFB"}></img></a>
            <a href="http://github.com" target="_blank"><img className="m-1" style={{ width: 20, height: 20 }} src={ logogithub} alt={"logoGH"}></img></a>
            <a href="http://instagram.com" target="_blank"><img className="m-1" style={{ width: 20, height: 20 }} src={ logoinsta} alt={"logoInsta"}></img></a>

        </div>

    </div>

}