import React , {useEffect, useState} from "react"

const ListFormFarm = (props) => {

    const [List , setList] = useState(<></>)

    useEffect(()=>{
        if (props.status == 0) window.history.replaceState({} , null , '/doctor/listformfarm/approve')
        else if(props.status == 1) window.history.pushState({}, null , '/doctor/listformfarm/approve')
        console.log(props.path)
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