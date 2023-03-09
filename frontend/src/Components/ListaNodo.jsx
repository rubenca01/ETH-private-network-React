import {Link} from 'react-router-dom'
import {useQuery} from 'react-query'
import { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Context } from '../App'
import { Modal, Button } from 'react-bootstrap';
import { BorrarNodo } from './BorrarNodo'

export function ListaNodo() {
    const [network, setNetwork] = useState(false);
    const [node, setNode] = useState(false)
    const [mensajeBorrar, setMensageBorrar] = useState(false);
    const[error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const handleCerrarModal = () => setShowModal(false);
    
    const handleSi = async () => {
        //console.log("Selected YES for ", network, node)
        setShowModal(false);
        const res = await BorrarNodo(network, node);
        if (res.status != 200) { setError ("Error borrando el nodo " + node + " en la red "+ network +" (" + res.status + " - " + res.message+")") }
        //console.log("retorn de la funció: ", error);
    };
    
    const hanlerBorrarNodo = (network, node) => {
        //console.log("Setting network to ", network, " and node to ", node)
        setNetwork(network);
        setNode(node);
        setMensageBorrar("Seguro que quieres borrar el nodo "+node+" en la red "+network+"?");
        setShowModal(true);
    }

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
                    <th></th>
                    <th>Numero de Nodo</th>
                    <th>Puerto</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {data.nodos.map((item,index) => (
                    <tr key={index}>
                        <td>
                                <a className="btn btn-outline-secondary btn-sm" role="button" onClick={() => {hanlerBorrarNodo(params.numero, item.numero)}}>Borrar el Nodo</a>
                                <Modal show={showModal} onHide={handleCerrarModal}>
                                    <Modal.Body>{mensajeBorrar}</Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="btn btn-outline-secondary" onClick={handleCerrarModal}>No</Button>
                                        <Button variant="btn btn-outline-primary" onClick={handleSi}>Sí</Button>
                                    </Modal.Footer>
                                </Modal>
                        </td>
                        <td>{item.numero}</td>
                        <td>{item.puerto}</td>
                        <td>{item.status}</td>
                    </tr>
                ) )}
            </tbody>
        </table>
        <div className="text-center">
            <b className="text-danger text-center">
                {error}
            </b>
        </div>
    </div>} catch(e) {
        return <div>Error </div>
    }
}