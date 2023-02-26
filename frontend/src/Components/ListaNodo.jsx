import {Link} from 'react-router-dom'
import {useQuery} from 'react-query'
import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Context } from '../App'





export function ListaNodo() {
    //const [estado, setEstado]= useContext(Context)
    const params=useParams()
    try {const {data, isLoading} = useQuery("nodos", ()=> {
        const networkid=params.numero
        return fetch(`http://localhost:3000/network/node/list/${networkid}`).then(res => res.json())
    })
    if (isLoading) {
        return <div>Cargando...</div>
    }
    return <div>
        <div className="d-flex">
            <h3 className="align-self-center">{`Nodos de la network ${params.numero}`}</h3>
        </div>
        <table className="table">
            <thead>
                <tr>
                    <th>Numero de Nodo</th>
                    <th>Puerto</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {data.nodos.map((item,index) => (
                    <tr key={index}>
                        <td>{item.numero}</td>
                        <td>{item.puerto}</td>
                        <td>{item.status}</td>
                    </tr>
                ) )}
            </tbody>
        </table>
    </div>} catch(e) {
        return <div>Error </div>
    }
}