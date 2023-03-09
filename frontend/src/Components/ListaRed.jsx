import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import {useQuery} from 'react-query'
import { Modal, Button } from 'react-bootstrap';
import { BorrarRed } from './BorrarRed'

export function ListaRed() {
    const [network, setNetwork] = useState(false);
    const [mensajeBorrar, setMensageBorrar] = useState(false);
    const [error, setError] = useState (null);

    const [showModal, setShowModal] = useState(false);
    const handleCerrarModal = () => setShowModal(false);
    
    const handleSi = async () => {
        //console.log("Selected YES for ", network)
        setShowModal(false);
        const res = await BorrarRed(network);
        if (res.status != 200) { setError ("Error borrando la red "+ network +" (" + res.status + " - " + res.message+")") }
        //console.log("retorn de la funció: ", error);
    };
    
    const hanlerBorrarRed = (network) => {
        //console.log("Setting network to ", network)
        setError (null);
        setNetwork(network);
        setMensageBorrar("Seguro que quieres borrar la red "+network);
        setShowModal(true);
    }

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
            <table className="table" id="Redes">
                <thead>
                    <tr>
                        <th>Numero de Red</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.networks.map((item,index) => (
                        <tr key={index}>
                            <td><Link to={`/red/${item.number}`}>{item.number}</Link></td>
                            <td>
                                <a className="btn btn-outline-secondary btn-sm" role="button" onClick={() => {hanlerBorrarRed(item.number)}}>Borrar la Red</a>
                                <Modal show={showModal} onHide={handleCerrarModal}>
                                    <Modal.Body>{mensajeBorrar}</Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="btn btn-outline-secondary" onClick={handleCerrarModal}>No</Button>
                                        <Button variant="btn btn-outline-primary" onClick={handleSi}>Sí</Button>
                                    </Modal.Footer>
                                </Modal>
                            </td> 
                        </tr>
                    ) )}
                </tbody>
            </table>
            <div className="text-center"><b className="text-danger text-center">{error}</b></div>
        </div>} catch(e) {
        return <div>Error {JSON.stringify(e)}</div>
    }
}