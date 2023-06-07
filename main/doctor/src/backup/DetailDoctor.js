import React , {useState , useEffect} from "react"

const ShowDetailDoctor = (props) => {

    const [List , setList] = useState("")

    useEffect(()=>{
        let profile = JSON.parse(props.doctor)[0]
        setList(
        <>
            <div className="img">
                <img src={(profile['img_doctor']['data'] != '') ? profile['img_doctor']['data'] : '/doctor-svgrepo-com.svg'}></img>
            </div>
            <div className="detail-doctor">
                <div className="id">
                    {props.id}
                </div>
                <div className="fullname">
                    {profile['fullname_doctor']}
                </div>
            </div>
        </>
        )
        document.getElementById('farmer-list-doctor-detail').setAttribute('show' , "")
    } , [])

    return(
        <section className="profile-doctor">
            {List}
        </section>
    )
}

export { ShowDetailDoctor }