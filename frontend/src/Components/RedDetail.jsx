import { useParams } from "react-router-dom"

export function RedDetail() {
    const params=useParams()
    console.log(params)
    return <div>
        {`Aqui esta el detalle de la red ${params.numero}`}
        
    </div>
}