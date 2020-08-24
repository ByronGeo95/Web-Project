const express = require('express');
const app = express();
const fs = require('fs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Initial 'GET' of the Web-Project .json file, upon render of the React App
app.get('/defWP', (req, res) => {
    fs.readFile('./src/web-projects.json', 'utf-8', (err, data) => {
        if (err)
        {
            res.send('File not found. First post to create file.');
        }
        else
        {
            res.json(data);
        }
    });
});

//When the user Adds a new item to the Web-Project List
app.post('/addNewWP', (req, res) => {
    let oldWP = '';
    fs.readFile('./src/web-projects.json', 'utf-8', (err, curWP) => {
        if (err)
        {
            res.send('Unable to read existing file.');
            console.log(err);
        }
        else
        {
            oldWP = curWP;
            oldWP = oldWP.substring(1, oldWP.length - 1);
            fs.writeFile('./src/web-projects.json', `[${oldWP},{"id": ${req.body.id}, "title": "${req.body.title}", "task": "${req.body.task}", "desc": "${req.body.desc}", "URL": "${req.body.URL}", "score": "${req.body.score}"}]`, (err) => {
                if (err)
                {
                    res.send('Unable to create new file with old data, & with existing data appended.');
                    console.log(err);
                }
                else
                {
                    res.send('File Appended!');
                }
            });
        }
    });
});

//When the user deletes an item from the Web-Project list
app.post('/delWPItem', (req, res) => {
    let oldWP;
    let newWP;
    fs.readFile('./src/web-projects.json', 'utf-8', (err, curWP) => {
        if (err)
        {
            res.send('Unable to read existing file.');
        }
        else
        {
            oldWP = JSON.parse(curWP);
            let id = req.body.id;
            oldWP.splice(id - 1, 1);
            for (let i = id - 1; i <= oldWP.length - 1; i++)
            {
                let newID = oldWP[i].id - 1;
                oldWP[i].id = newID;
            }
            newWP = JSON.stringify(oldWP);
            fs.writeFile('./src/web-projects.json', `${newWP}`, (err) => {
                if (err)
                {
                    res.send('Unable to create new file with old data, & with object of specified ID in array removed.');
                    console.log(err);
                }
                else
                {
                    res.send(`File Updated!`);
                }
            });
        }
    });
});

//When the user updates an existing item from the Web-Project List
app.post('/updateWPItem', (req, res) => {
    let oldWP;
    let newWP;
    fs.readFile('./src/web-projects.json', 'utf-8', (err, curWP) => {
        if (err)
        {
            res.send('Unable to read existing file.');
        }
        else
        {
            oldWP = JSON.parse(curWP);
            let id = req.body.id;
            let title = req.body.title;
            let task = req.body.task;
            let desc = req.body.desc;
            let URL = req.body.URL;
            let score = req.body.score;
            for (let i = 0; i <= oldWP.length - 1; i++)
            {
                oldWP = JSON.parse(curWP);
                if (oldWP[i].id === id)
                {
                    oldWP[i].title = title;
                    oldWP[i].task = task;
                    oldWP[i].desc = desc;
                    oldWP[i].URL = URL;
                    oldWP[i].score = score;
                    newWP = JSON.stringify(oldWP);
                }
            }
            fs.writeFile('./src/web-projects.json', `${newWP}`, (err) => {
                if (err)
                {
                    res.send('Unable to create new file with old data, & with object of specified ID in array updated.');
                    console.log(err);
                }
                else
                {
                    res.send(`File Updated!`);
                }
            });
        }
    });
});

//Express App is listening on PORT 3001 (React App on PORT 3000)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});