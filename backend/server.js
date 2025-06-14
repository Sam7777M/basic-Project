const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://shashwat:aaaaaaaa@cluster0.8e6yml0.mongodb.net/temppp?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Define a simple schema and model
const TaskSchema = new mongoose.Schema({
  title: String,
  completed: {type: Boolean, default: true},
});

const Task = mongoose.model('Task', TaskSchema);
// Routes

// Fetch all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Create a new task
app.post('/tasks', async (req, res) => {
  const task = new Task({
    title: req.body.title,
    completed: req.body.completed,
  });

  try {
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
});

// Put API to update a task
app.put('/tasks/:id', async (req, res) => {
    const { title, completed } = req.body;
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, {title, completed});
        if (!task) {
            return res.status(404).json({message: 'Task not found'});
        }
        res.json({message: 'Task updated successfully'});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}
);
// Delete a task
app.delete('/tasks/:id', async (req, res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({message: 'Task not found'});
        }
        res.json({message: 'Task deleted successfully'});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
})