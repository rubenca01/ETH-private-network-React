import {Link} from 'react-router-dom'

const listaRed = [
    {
        numero : 123,
        data2 : "test",
    },
    {
        numero : 456,
        data2 : "pueba",
    }

]

export function ListaRed() {
    return <div>
        <div className="d-flex justify-content-center">
            <h2 className="align-self-center">Nuestras redes</h2>
        </div>
        <table className="table">
            <thead>
                <tr>
                    <th>Numero de Red</th>
                    <th>data2</th>
                </tr>
            </thead>
            <tbody>
                {listaRed.map((item,index) => (
                    <tr key={index}>
                        <td><Link to={`/red/${item.numero}`}>{item.numero}</Link></td>
                        <td>{item.data2}</td>
                    </tr>
                ) )}
            </tbody>
        </table>
    </div>
}