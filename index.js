import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";
const app = express();
const port = 3000;

env.config()
const db = new pg.Client({
  user :process.env.PG_USER,
  host :process.env.PG_HOST,
  database:process.env.PG_DB,
  password:process.env.PG_KEY,
  port: process.env.PG_PORT
})

db.connect((err) => {
  if (err){
    console.log(err.stack)
  }
  else{
    console.log(`Connected to the database successfully!`)
  }
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items")
    const items = result.rows;

  
    res.render("index.ejs",{
      listTitle: "Today",
      listItems: items,
      allLists:"list"
    })
  } catch (err) {
    console.error("Error occurred:", err.message); 
    res.status(500).json({ error: "Internal Server Error" }); 
  }
});

app.post("/add", async  (req, res) => {
  try {
    const item = req.body["newItem"];
    const date = new Date().toDateString();

    await db.query("INSERT INTO items (title,time_stamp) VALUES ($1,$2)",
      [item,date]
    )
    res.redirect("/")

  } catch (err) {
    console.error("Error occurred:", err.message); 
    res.status(500).json({ error: "Internal Server Error" }); 
  }
});

app.post("/edit", async (req, res) => {
  const item = req.body["updatedItemTitle"];
  const id = req.body["updatedItemId"];
 try {
   await db.query("UPDATE items SET title = ($1) WHERE id = $2",
    [item,id]
   )
   res.redirect("/")
 } catch (err) {
  
 }
});


app.post("/delete", async (req, res) => {
  const id = req.body["deleteItemId"]
  await db.query("DELETE FROM items WHERE id = $1",
    [id]
  )
  res.redirect("/")
});

app.get("/new",(req, res) => {

  res.render('new.ejs',)
})

app.post("/new")

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
