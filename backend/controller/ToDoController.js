const ToDoModel = require("../models/ToDoModel");

module.exports.getToDos = async (req, res) => {
  try {
    const toDos = await ToDoModel.find();
    res.send(toDos);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err, msg: "Something went wrong!" });
  }
};

module.exports.saveToDo = async (req, res) => {
  const { toDo } = req.body;

  try {
    const newToDo = await ToDoModel.create({ toDo });
    console.log("Saved Successfully...");
    res.status(201).send(newToDo);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err, msg: "Something went wrong!" });
  }
};

module.exports.updateToDo = async (req, res) => {
  const { id } = req.params;
  const { toDo } = req.body;

  try {
    const updatedToDo = await ToDoModel.findByIdAndUpdate(
      id, 
      { toDo },
      { new: true } // Return the updated document
    );
    
    if (!updatedToDo) {
      return res.status(404).send({ msg: "Todo not found" });
    }

    res.send(updatedToDo);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err, msg: "Something went wrong!" });
  }
};

module.exports.deleteToDo = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedToDo = await ToDoModel.findByIdAndDelete(id);
    
    if (!deletedToDo) {
      return res.status(404).send({ msg: "Todo not found" });
    }

    res.send({ id, msg: "Deleted Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err, msg: "Something went wrong!" });
  }
};