///<reference path="../../node_modules/@types/node/index.d.ts"/>
///<reference path="../../node_modules/electron/electron.d.ts" />
declare var __static: any;
import bluebird = require('bluebird-global')

import { app, BrowserWindow, ipcMain } from 'electron'
import { Datastore } from './Services/Database'
import { onTask } from './TaskManagement'

/**
 * Set `__static` path to static files in production
 */
if (process.env.NODE_ENV !== 'development') {
  global['__static'] = require('path')
        .join(__dirname, '/static')
        .replace(/\\/g, '\\\\')
  require('electron-debug')({  enabled: true })
}







let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    icon: __static + '/icons/png/64x64.png'
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/** platform-specific user data folder */
const userData = app.getPath('userData')
let DB_PATH = userData + '/zenomeprofile.dat'
//DB_PATH = './zenomeprofile.dat'

console.log('userData: ', DB_PATH)

const db = new Datastore(DB_PATH,
  object => mainWindow.webContents.send('db', object)
)


// import { db as _db } from '../ipc-leveldown/ipc-connector-main';



ipcMain.on('tasks-add', onTask(db))
ipcMain.on('db', (event, data) => db.remote(data))
