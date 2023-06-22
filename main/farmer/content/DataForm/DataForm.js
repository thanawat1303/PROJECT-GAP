import React, { useEffect } from "react";
import { clientMo } from "../../../../src/assets/js/moduleClient";
import { CloseAccount } from "../../method";

const DataForm = ({ setBody , id_house , id_plant , liff , setPage , isClick = 0}) => {
    useEffect(()=>{
        setPage("DataForm")
        if(isClick === 1) window.history.pushState({} , null , `/farmer/form/${id_house}/d/${id_plant}`)

        FetchData()
    })

    const FetchData = async () => {
        const result = await clientMo.post("/api/farmer/formplant/select" , {id_formplant : id_plant , id_farmhouse : id_house})
        if(await CloseAccount(result , setPage)) {
            console.log(result)
        }
        if(document.getElementById("loading").classList[0] !== "hide")
            clientMo.unLoadingPage()
    }
}

export default DataForm