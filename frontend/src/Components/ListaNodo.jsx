import {Link} from 'react-router-dom'
import {useQuery} from 'react-query'
import { useContext } from 'react'
import { Context } from '../App'





export function ListaNodo(network) {
    const [estado, setEstado]= useContext(Context)
    try {const {data, isLoading} = useQuery("nodos", ()=> {
        return fetch(`http://localhost:3000/nodos/list/${estado}`).then(res => res.json())
    })
    if (isLoading) {
        return <div>Cargando...</div>
    }
    return <div>
        <div className="d-flex">
            <h3 className="align-self-center">{`Nodos de la network ${estado}`}</h3>
        </div>
        <table className="table">
            <thead>
                <tr>
                    <th>Numero de Nodo</th>
                    <th>Puerto</th>
                </tr>
            </thead>
            <tbody>
                {data.nodos.map((item,index) => (
                    <tr key={index}>
                        <td>{item.numero}</td>
                        <td>{item.puerto}</td>
                    </tr>
                ) )}
            </tbody>
        </table>
    </div>} catch(e) {
        return <div>Error </div>
    }
}