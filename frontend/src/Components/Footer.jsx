import { Link } from "react-router-dom"

export function Footer() {
    return  <div className="d-flex justify-content-between fixed-bottom mt-4 bg-secondary">
        <Link to="/quienes" className="text-decoration-none text-light" target="_blank">Quienes somos?</Link>
        <Link to="/privacidad" className="text-decoration-none text-light" target="_blank">Privacidad</Link>
        <Link to="/terminos" className="text-decoration-none text-light" target="_blank">Terminos & condiciones</Link>
        <div className="d-flex justify-content-between">
            <p className="text-light">logo FB</p>
            <p className="text-light">logo LinkedIn</p>
            <p className="text-light">logo Insta</p>
        </div>

    </div>

}