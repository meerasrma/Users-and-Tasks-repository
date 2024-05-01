const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const db = require("./database")

const app = express();
const port = process.env.PORT || 3000;
// const db = new sqlite3.Database(':memory:');


app.use(bodyParser.json());

// * Start a Server
const startServer= async()=>{
  try {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error.message)
  }
}
startServer()


// Define API endpoints here

// Create a new task
app.post("/tasks/", async (req, res) => {
  const tasksDetails = req.body;
  const {
    title,
    description,
    status,
    assigneeId,
    createdAt,
    updatedAt
  } = tasksDetails;

  const addTasksQuery = `
    INSERT INTO
    Tasks(
      title,
      description,
      status,
      assignee_id,
      created_at,
      updated_at
    )
    VALUES(
      '${title}',
      '${description}',
      '${status}',
      ${assigneeId},
      '${createdAt}',
      '${updatedAt}'
    );`;

  const dbResponse = await db.run(tasksDetails);
  const taskId = dbResponse.lastId;
  res.send({ id: taskId });
})

// Retrive all tasks
app.get("/tasks/", async (req, res) => {
  const getTasksQuery = `SELECT * FROM Tasks`
  const tasks = await db.get(getTasksQuery);
  res.send(tasks);
});

//Retrive a specific task by ID
app.get("/tasks/:id/", async (req, res) => {
  const { taskId } = req.params;
  const getTaskQuery = `SELECT *
    FROM Tasks
    WHERE id = ${taskId};`;

  const task = await db.get(getTaskQuery);
  res.send(task);
});

//Update a specific task by ID
app.put("/tasks/:id", async (req, res) => {
  const { taskId } = req.params;
  const tasksDetails = req.body;
  const {
    title,
    description,
    status,
    assigneeId,
    createdAt,
    updatedAt
  } = tasksDetails;
  const updateTaskQuery = `
    UPDATE Tasks
    SET
    title='${title}',
      description='${description}',
      status='${status}',
      assigneeId=${assigneeId},
      createdAt='${createdAt}',
      updatedAt='${updatedAt}'
    WHERE
    id=${taskId};`;
  await db.run(updateTaskQuery);
  res.send("Task Updated Successfully");

});

// Delete a specific task by ID
app.delete("/tasks/:id", async (req, res) => {
  const { taskId } = req.params
  const deleteTaskFromQuery = `
    DELETE FROM 
    Tasks
    WHERE id=${taskId};`;
  await db.run(deleteTaskFromQuery);
  res.send("Task Deleted Successfully");
});

//Register User API
app.post("/users/", async (req, res) => {
  const { id, username, passwordHash } = req.body;
  const hashedPassword = await bcrypt.hash(passwordHash, 10);
  const selectUserQuery = `
    SELECT *
    FROM Users
    WHERE 
      username='${username}';`;

  const dbUser = await db.get(selectUserQuery);
  if(dbUser===undefined){
    const createUserQuery = `
    INSERT INTO
      Users(id, username, password_hash)
    VALUES(
      ${id},
      '${username}',
      '${hashedPassword}'
    );`;
    await db.run(createUserQuery)
    res.send("User Created Successfully")

  }else{
    res.status(400);
    res.send("User Already Exists");
  }
})







// "test": "echo \"Error: no test specified\" && exit 1"