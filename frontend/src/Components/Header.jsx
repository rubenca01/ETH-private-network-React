
import { Link } from "react-router-dom"
export function Header() {
    return <div className='my-2 d-flex justify-content-between'>
        <div className="d-flex">
            <div className="align-middle mh-100">
                logo
                {/* <img src={require ('../assets/eth.png')}/> */}
            </div>
            <Link to="/" className="fs-4 text-decoration-none">Build Private Ethereum Networks</Link>
        </div>
    </div>
}