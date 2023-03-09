import { useParams } from "react-router-dom"
import { useQuery } from "react-query"

export function Balance() {
    const params = useParams()
    const request = {
        networkid: params.networkid,
        address: params.address
    }
    try {const {data, isLoading} = useQuery("balance", ()=> {
        return fetch(`http://localhost:3000/network/balance`, {
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
        <h3 className="mt-3">{`Balance en la red ${params.networkid}`}</h3>
        <h4>{`de la direccion ${params.address}`}</h4>
        <p><b>{`${data} ethers`}</b></p>
    </div> 
    } catch (e) {
        return <div>{`Error ${e.message}`}</div>
    }
}
