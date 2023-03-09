//Front: Borrar un nodo de la red.

export function BorrarNodo(network, node) {
    const order = `http://localhost:3000/network/node/delete/${network}/${node}`
    //console.log ("Soc a BorrarNodo "+network+" - "+node);
    return fetch(order).then(res => {return {status: res.status, message: res.statusText};})
}