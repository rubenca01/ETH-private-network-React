import { useParams, Link } from "react-router-dom";

export function BlockDetail() {
    const params=useParams()
    return <h2>
        {`Detailles del bloque ${params.block} de la red ${params.networkid}`}
    </h2>
}