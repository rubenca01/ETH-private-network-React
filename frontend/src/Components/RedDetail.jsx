import { useParams } from "react-router-dom"
import  {useContext} from "react"
import { ListaNodo } from "./ListaNodo"
import { Context } from "../App"

export function RedDetail() {
    //const [estado, setEstado]= useContext(Context)
    const params=useParams()
    //setEstado(params.numero)
    console.log(params)
    return <div>
        {`Aqui esta el detalle de la red ${params.numero}`}
        <ListaNodo/>
        
    </div>
}