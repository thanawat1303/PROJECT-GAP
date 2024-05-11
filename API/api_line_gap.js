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
      "name": "signup",
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
            "uri": "https://liff.line.me/1661049098-dorebKYg"
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
            "uri": "https://liff.line.me/1661049098-A9PON7LB"
          }
        }
      ]
    }
    
    richmenu.createRichMenu(jsonLogin).then( async (RichID)=>{
      let pathImage = "API/assets/Menu.png"
      await richmenu.setRichMenuImage(RichID , fs.readFileSync(pathImage) , "image/png")
      richmenu.setDefaultRichMenu(RichID)
    })

  },

  createRichAddFarm : () => {
    const jsonHouse = 
    {
      "size": {
        "width": 2500,
        "height": 843
      },
      "selected": true,
      "name": "house",
      "chatBarText": "โรงเรือน",
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
            "uri": "https://liff.line.me/1661049098-Lm7mZW32"
          }
        },
        {
          "bounds": {
            "x": 1250,
            "y": 0,
            "width": 1250,
            "height": 843
          },
          "action": {
            "type": "postback",
            "text": "",
            "data": "house_add"
          }
        }
      ]
    }
    
    richmenu.createRichMenu(jsonHouse).then((RichID)=>{
      let pathImage = "API/assets/Group1.png"
      richmenu.setRichMenuImage(RichID , fs.readFileSync(pathImage) , "image/png")
    })

  },
  
  setDefault : (RichID) => {
    richmenu.deleteDefaultRichMenu().then(()=>{
      richmenu.setDefaultRichMenu(RichID).then(()=>console.log(`Rich menu ID : ${RichID} is Run`))
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
  },

  DeleteFriend : (userId) => {
    richmenu.linkRichMenuToUser(userId)
  } ,

  GetRichMenu : () => {
    richmenu.getRichMenuList().then((list)=>{
      console.log(list)
    })
  }

}

// richmenu.getMessageContent("466911495637172372").then((stream)=>{
//   console.log(stream.req)
// }).catch(error=>{
//   console.log({"ERROR" : error})
// })
// RichMenu.DeleteRichMenu.All()
// RichMenu.createRichLogin()
// RichMenu.createRichAddFarm()

// RichMenu.setDefault("richmenu-29008f2338b228f0e50630151d38c29e")

// richmenu.linkRichMenuToUser("Uceb5937bcd2edc0de5341022f8d59e9f" , "richmenu-e27bfb6f25e7ba8daa207df690e18489")

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


