import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";


export function BlockList() {
    const params=useParams()
    const networkid=params.numero
    try {const {data, isLoading} = useQuery("blockNumber", ()=> {
        return fetch(`http://localhost:3000/network/${networkid}/block`).then(res => res.json())
        })
        if (isLoading) {
            return <div>Cargando...</div>
        } 
        console.log(data)
        var rows = []
        for (let i=data; i>=0 && i>= data-10; i--) {
            rows.push(<li key= {data}><Link to={`/Block/${networkid}/${data}`}>{`block number ${data}`}</Link></li>)
        }
        return <div className="mt-3">
            <h3>Ultimos bloques de la red</h3>
            <ul>{rows}</ul>

        </div>
    } catch(e) {
        return <div>{`Error ${e.message}`}</div>
    }
}