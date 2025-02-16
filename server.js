const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const fs = require('fs');
const mysql = require('mysql2');
const conf = JSON.parse(fs.readFileSync("public/conf.json")).dbLogin;

conf.ssl.ca = fs.readFileSync(__dirname + '/ca.pem');
const connection = mysql.createConnection(conf);

const server = http.createServer(app);

app.post("/slider/add", (req, res) => {
   const newImage = req.body;
   insert(newImage)
   res.json({ result: "Ok" });
});

app.get("/slider", (req, res) => {
   select().then((data) => {
       images = data
       res.json(images);
   })
   
});

app.delete("/todo/:id", (req, res) => {
   const { id } = req.params;
   deleteTodo(id).then((result) => {
       res.json({ result: "Ok" });
   })
   
});


const executeQuery = (query,parametri) => {
   return new Promise((resolve, reject) => {      
         connection.query(query,parametri, (err, result) => {
            if (err) {
               console.error(err);
               reject();     
            }   
            console.log('done');
            resolve(result);         
      });
   })
}

const createTable = () => {
   return executeQuery(`
   CREATE TABLE IF NOT EXISTS slider
       ( 
       id INT PRIMARY KEY AUTO_INCREMENT,
       url VARCHAR(255) NOT NULL,
       )`);      
}

const insert = (image) => {
   const sql = `INSERT INTO slider (url) VALUES (?)`;
   const values = [
       image.url, 
   ];

   return executeQuery(sql, values);
}

const select = () => {
   const sql = `SELECT id, url FROM slider `;
   return executeQuery(sql); 
}

const deleteImage = (id) => {
   const sql = `DELETE FROM slider WHERE id = ?`;

   return new Promise((resolve, reject) => {
       connection.query(sql, [id], (err, result) => {
           if (err) {
               console.error("Errore:", err);
               reject(err);
           }
           resolve(console.log("OK"));
       });
   });
};


createTable().then(() => {
   //PER RESETTARE LA TABELLA
   //executeQuery("DROP TABLE slider");
});

server.listen(80, () => {
  console.log("- server running");
});