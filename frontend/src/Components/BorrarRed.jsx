//Front: Borrar la red y todos sus nodos.

export function BorrarRed(network) {
    const order = `http://localhost:3000/network/delete/${network}`
    return fetch(order).then(res => {return {status: res.status, message: res.statusText};})
}