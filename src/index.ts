import dotenv from 'dotenv'
dotenv.config()

import Server from './server'

const server = new Server().app

server.listen("3000", () => {
  console.log('listen port 3000')
})
