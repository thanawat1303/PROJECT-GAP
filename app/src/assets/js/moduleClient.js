// class moduleClient {
//     constructor() {
//         this.post = async (url = "" , data={}) => {
//             try {
//                 return fetch(HOST_API + url, {
//                     method: 'post',
//                     headers: {
//                         'content-type': 'application/json'
//                     },
//                     body: JSON.stringify(data)
//                 }).then((e)=>e.text().then((context)=>context)).catch(err=>{
//                     return ""
//                 })
//             } catch {
//                 return ""
//             }
//         },
//         this.postForm = async (url = "" , data={}) => {
//             const formData = new FormData();
//             for(const key in data){
//                 formData.append(key , data[key])
//             }
//             try {
//                 return fetch(HOST_API + url, {
//                     method: 'POST',
//                     body: formData
//                 }).then((e)=>e.text().then((context)=>context)).catch(err=>{
//                     return ""
//                 })
//             } catch {
//                 return ""
//             }
//         },
//         this.put = async (url = "" , data={}) => {
//             try {
//                 return fetch(HOST_API + url, {
//                     method: 'put',
//                     headers: {
//                         'content-type': 'application/json'
//                     },
//                     body: JSON.stringify(data)
//                 }).then((e)=>e.text().then((context)=>context)).catch(err=>{
//                     return ""
//                 })
//             } catch {
//                 return ""
//             }
//         },
//         this.get = async (url = "") => {
//             try {
//                 return fetch(HOST_API + url, {
//                     headers: {
//                         'content-type': 'application/json'
//                     }
//                 }).then((e)=>e.text().then((context)=>context)).catch(err=>{
//                     return ""
//                 })
//             } catch {
//                 return ""
//             }
//         },
//         this.addAction = (el = '' , action , deley) => {
//             setTimeout(()=>{
//                 document.querySelector(el).classList.add(action)
//             } , deley)
//         },
//         this.rmAction = (el = '' , action , deley) => {
//             setTimeout(()=>{
//                 document.querySelector(el).classList.remove(action)
//             } , deley)
//         },
//         this.LoadingPage = () => {
//             let Load = document.getElementById("loading")
//             Load.removeAttribute("style")
//             setTimeout(()=>{
//                 Load.classList.remove('hide')
//             } , 1)
//         },
//         this.unLoadingPage = () => {
//             let Load = document.getElementById("loading")
//             if(!Load.classList.contains('hide')) {
//                 setTimeout(()=>{
//                     Load.classList.add('hide')
//                     setTimeout(()=>{
//                         Load.setAttribute("style" , "display: none; animation: none;")
//                     } , 1000)
//                 } , 1)
//             }
//         }
//     }
// }

const HOST_API = process.env.NODE_ENV === "development" ? 
                    "http://" + process.env.REACT_APP_API_LOCAL + ":" + process.env.REACT_APP_API_PORT : 
                    "https://" + process.env.REACT_APP_API_PUBLIC + ":" + process.env.REACT_APP_API_PORT

const clientMo = {
    post : async (url = "" , data={}) => {
        try {
            return fetch(HOST_API + url, {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials : 'include'
            }).then((e)=>e.text().then((context)=>context)).catch(err=>{
                return ""
            })
        } catch {
            return ""
        }
    },
    postForm : async (url = "" , data={}) => {
        const formData = new FormData();
        for(const key in data){
            formData.append(key , data[key])
        }
        try {
            return fetch(HOST_API + url, {
                method: 'POST',
                body: formData,
                credentials : 'include'
            }).then((e)=>e.text().then((context)=>context)).catch(err=>{
                return ""
            })
        } catch {
            return ""
        }
    },
    put : async (url = "" , data={}) => {
        try {
            return fetch(HOST_API + url, {
                method: 'put',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials : 'include'
            }).then((e)=>e.text().then((context)=>context)).catch(err=>{
                return ""
            })
        } catch {
            return ""
        }
    },
    get : async (url = "" , query = {}) => {
        const query_get = Object.entries(query).map((Data)=>{
            return `${Data[0]}=${Data[1]}`
        }).join("&")
        const url_get = url + ((query_get) ? `?${query_get}` : "")
        try {
            return fetch(HOST_API + url_get, {
                headers: {
                    'content-type': 'application/json'
                },
                credentials : 'include'
            }).then((e)=>e.text().then((context)=>context)).catch(err=>{
                return ""
            })
        } catch {
            return ""
        }
    },
    addAction : (el = '' , action , deley) => {
        setTimeout(()=>{
            document.querySelector(el).classList.add(action)
        } , deley)
    },
    rmAction : (el = '' , action , deley) => {
        setTimeout(()=>{
            document.querySelector(el).classList.remove(action)
        } , deley)
    },
    LoadingPage : () => {
        let Load = document.getElementById("loading")
        Load.removeAttribute("style")
        setTimeout(()=>{
            Load.classList.remove('hide')
        } , 1)
    },
    unLoadingPage : () => {
        let Load = document.getElementById("loading")
        if(!Load.classList.contains('hide')) {
            setTimeout(()=>{
                Load.classList.add('hide')
                setTimeout(()=>{
                    Load.setAttribute("style" , "display: none; animation: none;")
                } , 1000)
            } , 1)
        }
    }
}

export {clientMo}