const express = require('express')
const {generateSlug} = require('random-word-slugs')

const app = express()
const port = 9000
app.use(express.json())

app.post('/deploy',(req,res)=>{

})

app.listen(port,()=>{
    console.log(`Api server started on port ${port}`)
})