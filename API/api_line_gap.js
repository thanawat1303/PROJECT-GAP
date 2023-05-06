const Line = require('@line/bot-sdk')
const fs = require("fs");
require('dotenv').config().parsed

const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret
}
const richmenu = new Line.Client(config)

const RichMenu = {
  createRichLogin : () => {
    const jsonLogin = 
    {
      "size": {
        "width": 2500,
        "height": 843
      },
      "selected": true,
      "name": "Login",
      "chatBarText": "เข้าสู่ระบบ",
      "areas": [
        {
          "bounds": {
            "x": 0,
            "y": 0,
            "width": 1250,
            "height": 843
          },
          "action": {
            "type": "uri",
            "uri": "https://liff.line.me/1661049098-A9PON7LB"
          }
        },
        {
          "bounds": {
            "x": 1252,
            "y": 0,
            "width": 1250,
            "height": 843
          },
          "action": {
            "type": "uri",
            "uri": "https://liff.line.me/1661049098-dorebKYg"
          }
        }
      ]
    }
    
    richmenu.createRichMenu(jsonLogin).then((RichID)=>{
      let pathImage = "assets/login.png"
      richmenu.setRichMenuImage(RichID , fs.readFileSync(pathImage) , "image/png").then(()=>{
        richmenu.setDefaultRichMenu(RichID).then(()=>console.log(`Rich menu ID : ${RichID} is Run`))
      })
    })

  },
  
  DeleteRichMenu : {
    All : () => {
      richmenu.getRichMenuList().then((val) => {
        if (val.length == 0) {
          console.log("No RichMenu")
          return 0
        }
        val.map(item => richmenu.deleteRichMenu(item.richMenuId).then(()=>console.log("Delete All complete")))
      })
    },
    someone : (RichMenuID) => {
      richmenu.deleteRichMenu(RichMenuID).then(()=>console.log("Delete Complete"))
    }
  }

}

RichMenu.createRichLogin()

// const createRichLogin = () => {
  // const jsonLogin = 
  // {
  //   "size": {
  //     "width": 2500,
  //     "height": 843
  //   },
  //   "selected": true,
  //   "name": "Login",
  //   "chatBarText": "เข้าสู่ระบบ",
  //   "areas": [
  //     {
  //       "bounds": {
  //         "x": 0,
  //         "y": 0,
  //         "width": 1250,
  //         "height": 843
  //       },
  //       "action": {
  //         "type": "uri",
  //         "uri": "line:https://liff.line.me/1661049098-A9PON7LB"
  //       }
  //     },
  //     {
  //       "bounds": {
  //         "x": 1252,
  //         "y": 0,
  //         "width": 1250,
  //         "height": 843
  //       },
  //       "action": {
  //         "type": "uri",
  //         "uri": "line:https://liff.line.me/1661049098-dorebKYg"
  //       }
  //     }
  //   ]
  // }
  
  // richmenu.createRichMenu(jsonLogin).then((RichID)=>{
  //   let pathImage = "assets/login.png"
  //   richmenu.setRichMenuImage(RichID , fs.readFileSync(pathImage) , "image/png").then(()=>{
  //     richmenu.setDefaultRichMenu(RichID).then(()=>console.log(`Rich menu ID : ${RichID} is Run`))
  //   })
  // })
// }

// const Create = () => {
//   const signinRich = {
//     size: {
//       width: 2500,
//       height: 843
//     },
//     selected: true,
//     name: "หมอช่วยได้",
//     chatBarText: "หมอช่วยได้",
//     areas: [
//       {
//         bounds: {
//           x: 0,
//           y: 0,
//           width: 2500,
//           height: 843
//         },
//         action: {
//           type: "postback",
//           text: "",
//           data: "sign"
//         }
//       }
//     ]
//   }
//   client.createRichMenu(signinRich).then(id => {
//     var image = fs.readFileSync("assets/img/bg.png");
//     client.setRichMenuImage(id, image, "image/png").then(val => {
//       client.setDefaultRichMenu(id);
//     });
//   });
// };

// const GetAll = () => {
//   client.getRichMenuList().then(val => {
//     val.map(item => console.log(item.richMenuId))
//   })
// }

// Delete()


