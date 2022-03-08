const express = require('express')
const app = express()
const port = 3033

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

app.post('/api/create', function (req, res) {
    req.on('data', chunk => {
        let student = JSON.parse(chunk);
        student['id'] = data[data.length - 1].id + 1;
        data.push(student);
    });

    req.on('end', () => {
        res.status(200).json({
            success: true,
            data: data
        });
        res.end();
    });
})

app.delete('/api/delete/:studentId', (req, res) => {
    let studentId = req.params.studentId;
    let result = data.filter( student => student.id != studentId);

    data = result;

    res.status(200).json({
        success: true,
        data: data
    });
})

app.put('/api/update/:studentId', (req,res) => {
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