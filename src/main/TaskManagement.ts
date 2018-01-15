import ppipe = require('p-pipe');

import {
  /** IPC-related */
  updateTask,       /** Update the task representation on a front-end         */
  completeTask,     /** Set the task as completed and notify a front-end      */
  /** File-related */
  selectFile,       /** Shows a dialog for user to select a file              */
  processFilePath,  /** Extract filename and extension from the full path.    */
  extractFileHead,  /** Read a short fragment of file to determine its type   */
  getSize,          /** Returns the size of the file                          */
  /** Database-related */
  getById,          /** Get a database entry with a given id                  */
  /** Genetic file-related (23andMe-like) */
  getDataProvider,     /** Returns the name of data provider (based on header)*/
  linkGeneticFile,     /** Adding a record to database (for a genetic file)   */
  readRSIdsFromFile,   /** Reads a list of rsids from a file                  */
  processReportRequest,/** Make ajax request to service provider              */
  /** Interface to kind-a memory manager */

  /** @description
   *
   *  It proxifies request to data and keeps
   *  references to prevent memory from
   *  freeing and releases them when asked for).
   **/
  loadFileToMemory,
  getFromRam,
} from './Promises'


function generateTasks (db) {
  return {
  'select-file': [ selectFile, processFilePath, getSize, extractFileHead, getDataProvider ],
  'link-file': [ linkGeneticFile(db) ],
  'make-request': [ getById(db), readRSIdsFromFile, processReportRequest ], //fix
  'request-rsid': [ getById(db), readRSIdsFromFile, processReportRequest, saveDataAs (db, 'data', 'report') ],
  'task-db': [ taskDatabase(db) ],
  'load-to-ram': [ getById(db), loadFileToMemory ],
  'get-from-ram': [ getFromRam ]
  }
}



export function taskDatabase (db) {
  return async function (object) {
    return db.remote(object)
      .then(result => ({...object, ...result})
    )
  }
}

export function saveDataAs (db, category, type) {
  return async function (object) {
    delete object._id
    return db.insert({...object, category, type})
  }
}


export function onTask (db) {
 const Tasks = generateTasks (db)

 return (event, object) => {
  let { task } = object

  if (Array.isArray(task)) {
    task = task[0]
  }

  if (Tasks[task]) {
    withTaskUpdating(Tasks[task], event)(object)
  } else {
    completeTask(event)(object)
  }

  // console.log('event', object)
 }
}

export function withTaskUpdating (pipeline, event) {
  let temp = []
  let _updateTask = updateTask(event)

  for (let t of pipeline)
    temp.push(t, _updateTask)


  return (task) => ppipe(temp)(task)
    .catch(r => {
      console.log('ERROR', r)
      return task
    })
    .then(completeTask(event))
}
