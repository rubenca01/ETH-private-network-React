import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

export function Faucet() {
    const params = useParams()
    const [account, setAccount] = useState(null)
    const {register, handleSubmit} = useForm({
        defaultValues:{amount:0}
    })
    useEffect(()=>{
        window.ethereum && window.ethereum.request({
            method:'eth_requestAccounts'
        }).then( cuentas => {
            setAccount(cuentas[0])
            ethereum.on("accountsChanged", (cuentas) => {
                setAccount(cuentas[0])
            })
        })
    }, [])

    function cargar(datos) {
        console.log("amount to send",datos.amount)
        const data ={
            amount: datos.amount,
            address: account,
            networkid: params.numero
        }
        console.log(data)
        fetch("http://localhost:3000/network/charge", {
            method: "POST",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify(data)

        })

    }


    return <div>
        <h3 className="mt-3">Faucet</h3>
        <p>{`Cuenta que cargar :${account}`}</p>
        <form onSubmit={handleSubmit(cargar)}>
            <div className="form-group w-25">
                <label>Introduzca el importe</label>
                <input {...register('amount')} type="number" className='form-control'></input>
            </div>
            <button className="btn btn-primary mt-3">Mandar importe</button>
        </form>
    </div>
}