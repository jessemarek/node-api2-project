/************************* SERVER SETUP *************************/
const express = require('express')

const server = express()

const port = 8000

server.listen(port, () => {
    console.log(`\n === Server listening on port ${port} === \n`)
})

/****************************************************************/

//Middleware
server.use(express.json())

//Routers
const postsRouter = require('./posts/postsRouter')

server.use('/api/posts', postsRouter)