import React, { useEffect, useState } from "react";
import ToDo from "./components/ToDo";
import axios from "axios";
import { baseURL } from "./utils/constant";
import Popup from "./components/Popup";
import { socketService } from "./utils/socketService";

const App = () => {
  const [toDos, setToDos] = useState([]);
  const [input, setInput] = useState("");
  const [updateUI, setUpdateUI] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({});

  useEffect(() => {
    // Connect to WebSocket
    socketService.connect();

    // Listen for todo updates from other clients
    socketService.onTodoUpdate(({ action, data }) => {
      if (action === 'add') {
        setToDos(prev => [...prev, data]);
      } else if (action === 'delete') {
        setToDos(prev => prev.filter(todo => todo._id !== data.id));
      } else if (action === 'update') {
        setToDos(prev => prev.map(todo => 
          todo._id === data.id ? { ...todo, toDo: data.text } : todo
        ));
      }
    });

    // Fetch initial todos
    fetchTodos();

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  const fetchTodos = () => {
    axios
      .get(`${baseURL}/get`)
      .then((res) => setToDos(res.data))
      .catch((err) => console.log(err));
  };

  const saveToDo = () => {
    if (!input.trim()) return;

    axios
      .post(`${baseURL}/save`, { toDo: input })
      .then((res) => {
        const newTodo = res.data;
        setToDos(prev => [...prev, newTodo]);
        setInput("");
        // Emit socket event for real-time update
        socketService.emitTodoChange('add', newTodo);
      })
      .catch((err) => console.log(err));
  };

  return (
    <main>
      <div className="container">
        <h1 className="title">ToDo App</h1>

        <div className="input_holder">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Add a ToDo..."
            onKeyPress={(e) => e.key === 'Enter' && saveToDo()}
          />
          <button onClick={saveToDo}>Add</button>
        </div>

        <div className="list">
          {toDos.map((el) => (
            <ToDo
              key={el._id}
              text={el.toDo}
              id={el._id}
              setToDos={setToDos}
              setShowPopup={setShowPopup}
              setPopupContent={setPopupContent}
            />
          ))}
        </div>
      </div>
      {showPopup && (
        <Popup
          setShowPopup={setShowPopup}
          popupContent={popupContent}
          setToDos={setToDos}
        />
      )}
    </main>
  );
};

export default App;