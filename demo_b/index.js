const express = require('express')
var async = require("async");
const axios = require('axios');
const res = require('express/lib/response');
const { log } = require('async');
const app = express()
const port = 8080
const domain = "http://localhost:3030"

app.get('/', (req, res) => {

    axios.get(domain)
    .then((result) => {
        console.log(result.data);
        res.json(result.data)
    }).catch((err) => {
        console.log(err)
    });
})

app.post('/students/create', function(req, res) {
    var results;
    req.on('data', chunk => {
        let data = JSON.parse(chunk);
        axios.post(domain + "/api/create", data)

        // axios({
        //     method: "POST",
        //     url: domain + "/api/create",
        //     data: data
        // })
        .then((result) => {
            console.log(result.data);
        }).catch((err) => {
            console.log(err);
        });

    })
    req.on('end', () => {       
        res.end();
    })
})

app.put('/students/update/:studentId', (req, res) => {
    req.on('data', chunk => {
        let studentId = req.params.studentId;
        let data = (chunk);
        console.log(data);
        axios({
            method: "PUT",
            url: domain + "/api/update/" + studentId,
            data: data,
        })
        .then((result) => {
            console.log(result.data);
        }).catch((err) => {
            console.log(err);
        });    
    })
    req.on('end', () => {       
        res.end();
    })
})

app.delete('/students/delete/:studentId', (req, res) => {

    let studentId = req.params.studentId;

    axios.delete(domain + "/api/delete/" + studentId)

    .then((result) => {
        console.log(result.data);
        res.json(result.data)
    }).catch((err) => {
        console.log(err);
    });
})

 app.get('/students/sum/:studentId', async (req, res) => {
    let studentId = req.params.studentId;
    res.json(await sum(studentId));
})

async function sum(studentId) {
    const math =  await axios.get(domain + "/api/getMath/" + studentId);
    const history = await axios.get(domain + "/api/getHistory/" + studentId);

    return math.data.data + history.data.data;
}


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})