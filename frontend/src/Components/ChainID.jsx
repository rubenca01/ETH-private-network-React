import { useParams } from "react-router-dom";
import { useQuery } from "react-query";

export function ChainID() {
    const params= useParams()
    const networkid=params.numero
    try {const {data, isLoading} = useQuery("chainID", ()=> {
            return fetch(`http://localhost:3000/network/${networkid}/chainID`).then(res => res.json())
        })
        if (isLoading) {
            return <div>Cargando...</div>
        }
        
        console.log("statut", data)
        return <div>
            <h3>ID de cadena</h3>
            <h4>{JSON.stringify(data)}</h4>
        </div>
    } catch(e) {
        return <div>{`Error ${e.message}`}</div>
    }
}