import { useParams,  } from "react-router-dom"
import  {useContext} from "react"
import { ListaNodo } from "./ListaNodo"
import { Context } from "../App"
import { BlockList } from "./BlockList"
import { ChainID } from "./ChainID"

export function RedDetail() {
    //const [estado, setEstado]= useContext(Context)
    const params=useParams()
    //setEstado(params.numero)
    console.log(params)

    return <div>
        <h2 className="mb-3">{`Aqui esta el detalle de la red ${params.numero}`}</h2>
        <ChainID/>
        <ListaNodo/>
        <BlockList/>
        
    </div>
}