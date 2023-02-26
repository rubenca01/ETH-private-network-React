//Front: Formulario para crear la red que nos pida: NUMERO DE RED. Creará la red con el nodo1

import React, { useState } from 'react';
import { useQuery } from 'react-query';

export function NuevaRed() {
    const [numRed, setNumRed] = useState('333444');
    const [network_ID, setNetworkID] = useState(null);
    const [node_ID, setNodeID] = useState(null);
    const [error, setError] = useState(null);

    async function crear() {
        try {
            const resp = await fetch(`http://localhost:3000/network/create/${numRed}`);
            const data = await resp.json();
            if (data.network_id) {
                setNetworkID (JSON.stringify(data.network_id)); 
                //setNodeID (JSON.stringify(data.node_ID));
                setError (null); 
            }
            if (data.error) {
                setError(JSON.stringify(data.error)); 
                setNetworkID (null); 
                setNodeID (null)
            }
        } catch (e) { 
            setError ("408 Request Timeout"); 
            setNetworkID (null); 
            setNodeID (null)
        }
    }

    return (
        <div className="border mb-5 px-5 py-5">
            <div className="text-center">
                <label className="mx-2">Número de Red:</label>
                <input type="text" value={numRed} onChange={(e) => setNumRed(e.target.value)}/>
            </div>
            <div className="text-center">
                <button type="submit" className="btn btn-primary my-4" onClick={() => crear()}>Crear Red {numRed}</button>
            </div>
        
            {network_ID && <div className="alert alert-info m-3">Red y nodo creados: {network_ID}</div>}
            {error && <div className="alert alert-danger mt-3">Error: {error}</div>}
        </div>
    );
}