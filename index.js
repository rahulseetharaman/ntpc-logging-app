//  ---------------- IMPORTS ----------------------------------------------

const electron = require('electron');
const {app,BrowserWindow,ipcMain} = electron;

// replace the value below with the Telegram token you receive from @BotFather
const TelegramBot = require('node-telegram-bot-api');
const token = '1223684247:AAF2-iM3daBaZut86Q0CRBKwU5Dgx9EVH9Y';
const bot = new TelegramBot(token, {polling: true});

//  ------------- FIREBASE IMPORT AND INITIALIZE ----------------------
var firebase = require('firebase');
const { DataSessionPage } = require('twilio/lib/rest/wireless/v1/sim/dataSession');
var firebaseConfig = {
    apiKey: "AIzaSyB6wKbRZrAK6bxYqNKi8_lrjVOeqsz3tkg",
    authDomain: "savvy-pagoda-234618.firebaseapp.com",
    databaseURL: "https://savvy-pagoda-234618.firebaseio.com",
    projectId: "savvy-pagoda-234618",
    storageBucket: "savvy-pagoda-234618.appspot.com",
    messagingSenderId: "820244590979",
    appId: "1:820244590979:web:d9e0d515837b3e7f7a06b6",
    measurementId: "G-RCS5XSG2YK"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database=firebase.database();

 // this is sorta overall process(Electron App)
let mainWindow;
app.on('ready', () => {

    let senderPhoneNumber
    let senderName;

    console.log('App is now ready!!!');
    mainWindow=new BrowserWindow({webPreferences:{
        nodeIntegration: true
    }});
    mainWindow.loadURL(`file://${__dirname}/templates/loginform.html`)
    mainWindow.webContents.openDevTools()

    ipcMain.on("register:form",(event,data)=>{
        mainWindow.loadURL(`file://${__dirname}/templates/registerform.html`)
    })

    ipcMain.on("submit:register",(event,data)=>{
        var employeeId=data['empid']
        var phone=data['phone']
        var name=data['name']
        var password=data['password']
        var confirm=data['confirm']
        if(password==confirm){
            database.ref('users/'+employeeId).on('value',(snapshot)=>{
                if(snapshot.val()==null){
                    database.ref('users/'+employeeId).set({
                        'phone':phone,
                        'name':name,
                        'password':password,
                    })
                }
            })
            mainWindow.loadURL(`file://${__dirname}/templates/loginform.html`)
        }
    })

    ipcMain.on("submit:login",(event,data)=>{
        var employeeId=data["empid"];
        var password=data["password"];
        database.ref('users/'+employeeId).on('value',(snapshot)=>{
            if(snapshot.val()!=null){
                if(snapshot.val()['password']==password){
                     senderName=snapshot.val()['name']
                     senderPhoneNumber=snapshot.val()['phone']
                     mainWindow.loadURL(`file://${__dirname}/templates/index.html`)
                }
            }
        })
    })
    ipcMain.on("submit:data",(event,data)=>{
        // var text=
        // `
        // Sir, 
        // ${senderName}

        // ${senderPhoneNumber}
        
        // `;
        // for(key in data){
        //     text+=`${key}   ${data[key]} \n`
        // }

        var text=`
        ${data["DATE"]} ${data["SHIFT"]} Shift Report
        
        Stage 1&2

        DC D/M/Y ${data["Stage 1&2 DC/D"]}/${data["Stage 1&2 DC/M"]}/${data["Stage 1&2 DC/Y"]}
        SG D/M/Y ${data["Stage 1&2 SG/D"]}/${data["Stage 1&2 SG/M"]}/${data["Stage 1&2 SG/M"]}


        Stage 3

        DC D/M/Y ${data["Stage 3 DC/D"]}/${data["Stage 3 DC/M"]}/${data["Stage 3 DC/Y"]}
        SG D/M/Y ${data["Stage 3 SG/D"]}/${data["Stage 3 SG/M"]}/${data["Stage 3 SG/M"]}

        Day Gen : ${data["Day Gen"]}
        Day PLF: ${data["Day PLF"]}
        Monthly PLF : ${data["Monthly PLF"]}
        Yearly PLF : ${data["Yearly PLF"]}
        APC: ${data["APC"]}

        Coal Receipt/Consumption/Stock
        ${data["RECEIPT"]}/${data["CONS"]}/${data["STOCK"]}

        1% Ramp Rate Status
        Stage 1&2 : ${data["RAMP RATE STAGE 1&2"]}
        Stage 3: ${data["RAMP RATE STAGE 3"]}

        U1 : ${data["MAJOR ISSUES UNIT 1"]}
        U2 : ${data["MAJOR ISSUES UNIT 2"]}
        U3 : ${data["MAJOR ISSUES UNIT 3"]}
        U4 : ${data["MAJOR ISSUES UNIT 4"]}
        U5 : ${data["MAJOR ISSUES UNIT 5"]}
        U5 : ${data["MAJOR ISSUES UNIT 6"]}
        U5 : ${data["MAJOR ISSUES UNIT 7"]}

        Stage 1 Offsites
        Ash Series: ${data["ASH SERIES"]}
        ATs: ${data["ATs"]}
        ASH TRUCKS: ${data["ASH TRUCKS"]}
        Silo levels: ${data["Stage 1 Silo Levels"]}
        St 1 RW Level: ${data["St 1 RW Level"]}
        St 2 CW sump level : ${data["St2 CW sump level"]}


        Stage 2 Offsites
        Dry Ash Sys I/s: ${data["Dry ash sys I/S"]}
        Ash Lines not avl: ${data["Ash Lines not avl"]}
        Vessels NA: ${data["Vessels NA"]}
        Silo Levels: ${data["Silo levels"]}
        BAS: ${data["BAS"]}
        FAS: ${data["FAS"]}

        Stage 3 Offsites
        ESP Passes Dry : ${data["ESP Passes Dry"]}
        ESP Passes Wet : ${data["ESP Passes Wet"]}
        Series Avl : ${data["Series Avl"]}
        Series Not Avl: ${data["Series Not Avl"]}
        Ash Trucks: ${data["Ash Trucks"]}
        Silo Levels : ${data["Stage 3 Silo Levels"]}
        

        Regards
        SCE NAME : ${data["SCE NAME"]}
        SCE GROUP: ${data["SCE GROUP"]}

        `


        bot.sendMessage("@ntpcrgdm",text)
    })


});


// the above listener that is attached can be broken down to three -
// app - thing we are listening to
// ready - event we are listening for
// function to call when event occurs