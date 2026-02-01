import { useState, useEffect } from "react";

export default function AccountBox({accounts, setIndex, terminate}){

    //if the accounts is empty, terminate the box
    useEffect( 
        () => {
            if(!accounts || accounts.length === 0){
                terminate();
                return;
            } else {
                console.log(accounts);
            }
        }
    ,[accounts])


    return(
        <>
            {accounts.map((acc, idx) => {
                    return(
                        <div onClick={() => {setIndex(idx); terminate()}} key={acc.account_id}>
                            {acc.name}
                        </div>
                    )
            })}
        </>
    )
}