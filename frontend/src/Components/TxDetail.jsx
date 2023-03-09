import { useParams, Link } from "react-router-dom"
import { useQuery } from "react-query"

export function TxDetail() {
    const params = useParams()
    const request = {
        networkid: params.networkid,
        Tx: params.TxHash
    }
    try {const {data, isLoading} = useQuery("transaction", ()=> {
        return fetch(`http://localhost:3000/network/transaction`, {
            method: "POST",
            headers: {'Content-Type': "application/json"},
            body:  JSON.stringify(request)
        }).then(res => res.json())
    })
    if (isLoading) {
        return <div>Cargando...</div>
    }
    //console.log(data)
    return <div>
        <h2>Detalles de una transaccion de la red ${params.networkid}</h2>
        <h4>Hash de la transaccion ${params.TxHash}</h4>
        <ul>
            <li>from : <Link to={`/balance/${params.networkid}/${data.from}`}>{data.from}</Link></li>
            <li>to : <Link to={`/balance/${params.networkid}/${data.to}`}>{data.to}</Link></li>
            <li>{`value: ${parseInt(data.value)/10e17}`}</li>
        </ul>
        
        <h3 className="mt-3">Detalles de la transaccion</h3>
        <pre>{JSON.stringify(data, null, 4)}</pre>
    </div> 
    } catch (e) {
        return <div>{`Error ${e.message}`}</div>
    }
}