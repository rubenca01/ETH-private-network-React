import { useParams, Link } from "react-router-dom";
import { useQuery} from "react-query"

export function BlockDetail() {
    const params=useParams()
    const request = {
        networkid: params.networkid,
        blocknumber: params.block
    }
    try {const {data, isLoading} = useQuery("blockdetail", ()=> {
        return fetch(`http://localhost:3000/network/blockdetail`, {
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
        <h2 className="mt-3">
            {`Detalles del bloque ${params.block} de la red ${params.networkid}`}
        </h2>
        <h3 className="mt-3">{`Fecha: ${new Date(parseInt(data.timestamp)*1000)}`}</h3>
        <h3 className="mt-3">
            List of transactions
        </h3>
        <ul>{data.transactions.map((item, index) => <li key={index}><Link to={`/transaction/${params.networkid}/${item}`}>{item}</Link></li>)}</ul>
        <h3 className="mt-3">Detalles del bloque</h3>
        <pre>{JSON.stringify(data, null, 4)}</pre>
    </div> 
    } catch (e) {
        return <div>{`Error ${e.message}`}</div>
    }
}