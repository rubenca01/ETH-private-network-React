import { useState} from "react";
import { useParams, Link } from "react-router-dom";


export function GoBalance() {

    const params = useParams()
    const [address, setAddress] = useState("address")



    return <div>
        <h3 className="mt-3">Ver Balance</h3>
            <div className="form-group w-50">
                <label>Introduzca la direccion</label>
                <input type="text" className='form-control' value={address} onChange={(x) => setAddress(x.target.value)}></input>
            </div>
            <div className="btn btn-primary mt-3"><Link className="text-decoration-none text-white" to={`/balance/${params.numero}/${address}`}>Ver balance</Link></div>

    </div>
}