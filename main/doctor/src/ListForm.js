import React , {useEffect, useState} from "react"

const ListFormFarm = (props) => {

    const [List , setList] = useState(<></>)

    useEffect(()=>{
        if(props.status == 1) window.history.pushState({}, null , '/doctor/listformfarm')
        JSON.parse(props.list).map((formList , index)=>
            <div className="list-form">
                <div></div>
            </div>
        )
    } , [])

    return(
        <section id="list-form-farmer">
            {List}
        </section>
    )
}

export {ListFormFarm}