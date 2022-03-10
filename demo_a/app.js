const express = require('express')
// const bodyParser = require('body-parser')
const app = express()
const port = 3000

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))

var user = {
    name : 'minhpham',
    pass : 12345678
}

var ACCESS_TOKEN = 'token_'

var data = [
    {
        name: 'name_1',
        class: 1,
        math: 5,
        history: 6,
        id: 1
    },
    {
        name: 'name_2',
        class: 2,
        math: 7,
        history: 8,
        id: 2
    },
    {
        name: 'name_3',
        class: 3,
        math: 9,
        history: 10,
        id: 3
    }
]

app.get('/', (req, res) => {
    res.json(data);
})


app.post('/login', (req, res, next) => {

    req.on('data', chunk => {
        let request = JSON.parse(chunk);
        // console.log(request);
        let userName = request.name;
        let pass = request.pass;
        if (userName == user.name && pass == user.pass) {
            res.status(200).json({
                success: true,
                _token: ACCESS_TOKEN
            })
        } else {
            res.status(401).json({
                success: false,
            })
        }
    })
});
function checkToken (req, res, next) {
    let accessTokenFromHeader =  req.headers.authorization;
    if (!accessTokenFromHeader) res.status(401).json("not access token")
    if (accessTokenFromHeader != ACCESS_TOKEN)  res.status(401).json("Unauthorised")
    next();

}
app.post('/api/create', checkToken, (req, res) => {
    req.on('data', chunk => {
        // console.log(accessTokenFromHeader);
        let student = JSON.parse(chunk);
        student['id'] = data[data.length - 1].id + 1;
        data.push(student);
        // console.log(data);
    });
    req.on('end', () => {
        res.status(200).json({
            success: true,
            data: data
        });
        res.end();
    });
})


app.delete('/api/delete/:studentId', checkToken, (req, res) => {
    let studentId = req.params.studentId;
    let result = data.filter( student => student.id != studentId);

    data = result;

    res.status(200).json({
        success: true,
        data: data
    });
})

app.put('/api/update/:studentId', checkToken, (req,res) => {
    let studentId = req.params.studentId;
    
    console.log('studentId', studentId);

    let result = data.filter (student => {
        if (student.id == studentId) {
            req.on('data', chunk => {
                let val = JSON.parse(chunk);
                student.name = val.name;
                student.class = val.class;
                student.math = val.math;
                student.history = val.history;
            })
        }
    })
    req.on('end', () => {
        res.status(200).json({
            success: true,
            data: data
        });
        res.end();
    })
})

app.get('/api/getMath/:studentId', (req,res) => {
    let studentId = req.params.studentId;

    let result = data.filter( student => student.id == studentId);
    console.log('result', result);

    res.status(200).json({
        success: true,
        data: result[0].math
    });
})

app.get('/api/getHistory/:studentId', (req,res) => {
    let studentId = req.params.studentId;

    let result = data.filter( student => student.id == studentId);

    res.status(200).json({
        success: true,
        data: result[0].history
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})