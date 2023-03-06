import { useParams } from "react-router-dom"


export function TxDetail() {
    const params = useParams()
    return <div>
        <h2>Detalles de una transaccion de la red ${params.networkid}</h2>
        <h4>Hash de la transaccion ${params.TxHash}</h4>
    </div>
}