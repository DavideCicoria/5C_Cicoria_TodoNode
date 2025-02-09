const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");

const fs = require('fs');
const mysql = require('mysql2');
const conf = JSON.parse(fs.readFileSync('config.json'));
const connection = mysql.createConnection(conf);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const path = require('path');
app.use("/", express.static(path.join(__dirname, "public")));

const executeQuery = (sql) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, function (err, result) {
            if (err) {
                console.error(err);
                reject();
            }
            //console.log('done');
            resolve(result);
        });
    })
}

const createTable = async () => {
    return await executeQuery(`
    CREATE TABLE IF NOT EXISTS todo
       ( id INT PRIMARY KEY AUTO_INCREMENT, 
          name VARCHAR(255) NOT NULL, 
          completed BOOLEAN ) 
       `);
}
const insert = async (todo) => {
    const template = `
    INSERT INTO todo (name, completed) VALUES ('$NAME', '$COMPLETED')
       `;
    let sql = template.replace("$NAME", todo.name);
    sql = sql.replace("$COMPLETED", todo.completed ? 1 : 0);
    return await executeQuery(sql);
}
const select = async () => {
    const sql = `
    SELECT id, name, completed FROM todo 
       `;
    return await executeQuery(sql);
}
const update = async (todo) => {
    let sql = `
    UPDATE todo
    SET completed=%COMPLETED
    WHERE id=%ID
       `;
    sql = sql.replace("%ID", todo.id);
    sql = sql.replace("%COMPLETED", todo.completed ? 1 : 0);
    return await executeQuery(sql);
}
const deleteElement = async (todo) => {
    let sql = `DELETE FROM todo WHERE id=%ID`;
    sql = sql.replace("%ID", todo.id);
    return await executeQuery(sql);
}

createTable().then((res) => {}).catch((err) => {});

app.post("/todo/add", async (req, res) => {
    const todo = req.body.todo;
    await insert(todo);
    res.json({ result: "Ok" });

});

app.get("/todo", async (req, res) => {
    res.json({ todos: await select() });
});

app.delete("/todo/:id", async (req, res) => {
    const todos = await select();
   const todo = todos.filter((element) => element.id == req.params.id);
   await deleteElement(todo[0]);
    res.json({ result: "Ok" });

});

app.put("/todo/complete", async (req, res) => {
    const todo = req.body;
    todo.completed = true;
    await update(todo);
    res.json({ result: "Ok" });

})

const server = http.createServer(app);
server.listen(80, () => {
    console.log("- server running");
});