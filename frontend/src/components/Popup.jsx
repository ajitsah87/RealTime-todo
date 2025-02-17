import axios from "axios";
import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { baseURL } from "../utils/constant";
import { socketService } from "../utils/socketService";

const Popup = ({ setShowPopup, popupContent, setToDos }) => {
  const [input, setInput] = useState(popupContent.text);

  const updateToDo = () => {
    axios
      .put(`${baseURL}/update/${popupContent.id}`, { toDo: input })
      .then((res) => {
        setToDos(prev => 
          prev.map(todo => 
            todo._id === popupContent.id ? { ...todo, toDo: input } : todo
          )
        );
        setShowPopup(false);
        // Emit socket event for real-time update
        socketService.emitTodoChange('update', { 
          id: popupContent.id, 
          text: input 
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="backdrop">
      <div className="popup">
        <RxCross1 className="cross" onClick={() => setShowPopup(false)} />
        <div className="popup__input_holder">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Update ToDo..."
            onKeyPress={(e) => e.key === 'Enter' && updateToDo()}
          />
          <button onClick={updateToDo}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;