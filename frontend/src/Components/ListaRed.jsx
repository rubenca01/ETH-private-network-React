import {Link} from 'react-router-dom'
import {useQuery} from 'react-query'





export function ListaRed() {
    try {const {data, isLoading} = useQuery("network", ()=> {
        return fetch('http://localhost:3000/network/list').then(res => res.json())
    })
    if (isLoading) {
        return <div>Cargando...</div>
    }
    // data.networks.map((item, index) => console.log(index, item.number,item.chainid))
    return <div>
        <div className="d-flex justify-content-center">
            <h2 className="align-self-center">Nuestras redes</h2>
        </div>
        <table className="table">
            <thead>
                <tr>
                    <th>Numero de Red</th>
                    <th>ID de cadena</th>
                </tr>
            </thead>
            <tbody>
                {data.networks.map((item,index) => (
                    <tr key={index}>
                        <td><Link to={`/red/${item.number}`}>{item.number}</Link></td>
                        <td>{item.chainid}</td>
                    </tr>
                ) )}
            </tbody>
        </table>
    </div>} catch(e) {
        return <div>Error {JSON.stringify(e)}</div>
    }
}