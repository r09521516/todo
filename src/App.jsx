import { useState } from 'react';
import './App.css';

const documentHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty("--doc-height", `${window.innerHeight}px`);
}
window.addEventListener("resize", documentHeight);
documentHeight();

const setTimeFormat = (yyyy, mm, dd, hh, ms) => {
  let format = `${yyyy}/`;
  if (mm < 10) {
    format += `0${mm}/`;
  } else {
    format += `${mm}/`;
  }
  if (dd < 10) {
    format += `0${dd} `;
  } else {
    format += `${dd} `;
  }
  if (hh < 10) {
    format += `0${hh}:`;
  } else {
    format += `${hh}:`;
  }
  if (ms < 10) {
    format += `0${ms}`;
  } else {
    format += `${ms}`;
  }
  return format;
}

function TaskBox({ task, id, handleTaskCheck, handleTaskDel, handleTaskTag, handleTaskX }) {
  const [words, setWords] = useState(task.word);
  return (
    <>
      <div id={`taskbox${id}`}  className={task.tag ? "box importanttag" : "box"}>
        <div className="checkarea">
          <input type="checkbox" id={`check${id}`} className="checkboxarea" onClick={handleTaskCheck}/>
          <label htmlFor={`check${id}`} className="undo"><i className="fa fa-square" aria-hidden="true"></i></label>
          <label htmlFor={`check${id}`} className="isdo"><i className="fa fa-check-square" aria-hidden="true"></i></label>
        </div>
        <div className="taskarea">
          <input 
            type="text" 
            id={`task-input${id}`} 
            className="task-input"
            value={words}
            onChange={(e) => {task.word = e.target.value; return setWords(e.target.value);}} 
            placeholder="New event"
            spellCheck="false"
          />
          <p id={`task-time${id}`} className="task-time">{task.time}</p>
        </div>
        <input type="checkbox" id={`task-del${id}`} className="checkboxarea" onClick={handleTaskDel} />
        <label htmlFor={`task-del${id}`} id={`btn-del${id}`} className="btn-task del"><i className="fa fa-trash" aria-hidden="true"></i></label>
        <label htmlFor={`task-del${id}`} id={`btn-red${id}`} className="btn-task redo"><i className="fa fa-reply" aria-hidden="true"></i></label>
        <button id={`task-tag${id}`} className={task.tag ? "btn-task tag important" : "btn-task tag"} onClick={handleTaskTag}><i className="fa fa-star" aria-hidden="true"></i></button>
        <button id={`task-x${id}`} className="btn-task delx" onClick={handleTaskX}><i className="fa fa-times" aria-hidden="true"></i></button>
      </div>
    </>
  )
}

function App() {
  var date = new Date();
  const nowtime = setTimeFormat(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes());
  const [title, setTitle] = useState("Hello TODO!");
  const [tasks, setTasks] = useState([{ id: 0, word: "", time: nowtime, val: false, del: false, tag: false }]);

  function handleTaskCheck(id) {
    tasks[id].val = !tasks[id].val;
    if (tasks[id].val == true && tasks[id].tag == true) {
      tasks[id].tag = false;
    }

    let box = document.getElementById(`taskbox${id}`);
    let btntag = document.getElementById(`task-tag${id}`);
    let inputtext = document.getElementById(`task-input${id}`);
    if (tasks[id].val == true) {
      document.getElementById(`check${id}`).checked = true;
      box.style.setProperty("opacity", "0.6");
      inputtext.style.setProperty("text-decoration", "line-through");
      btntag.classList.remove("important");
      box.classList.remove("importanttag");
    } else {
      inputtext.style.setProperty("text-decoration", "none");
      box.style.setProperty("opacity", "1");
    }
}
  
  function handleTaskDel(id) {
    tasks[id].del = !tasks[id].del;
    displayHide(id);

    let btndel = document.getElementById(`btn-del${id}`);
    let btnred = document.getElementById(`btn-red${id}`);
    let btntag = document.getElementById(`task-tag${id}`);
    let btnx = document.getElementById(`task-x${id}`);
    if (tasks[id].del == true) {
      setTimeout(function() {
        btndel.style.setProperty("display", "none");
        btnred.style.setProperty("display", "flex");
        btntag.style.setProperty("display", "none");
        btnx.style.setProperty("display", "flex");
      }, 600)
    } else {
      setTimeout(function() {
        btndel.style.setProperty("display", "flex");
        btnred.style.setProperty("display", "none");
        btntag.style.setProperty("display", "flex");
        btnx.style.setProperty("display", "none");
      }, 600)
    }
  }
  
  function handleTaskTag(id) {
    tasks[id].tag = !tasks[id].tag;

    let btntag = document.getElementById(`task-tag${id}`);
    let box = document.getElementById(`taskbox${id}`);
    if (btntag.classList.contains("important")) {
      btntag.classList.remove("important");
      box.classList.remove("importanttag");
    } else {
      btntag.classList.add("important");
      box.classList.add("importanttag");
    }
  }

  function handleTaskX(id) {
    displayHide(id);
    tasks[id].id = -1;
  }

  function handleTaskAdd() {
    var newdate = new  Date();
    const newtime = setTimeFormat(newdate.getFullYear(), newdate.getMonth() + 1, newdate.getDate(), newdate.getHours(), newdate.getMinutes());
    setTasks(prev => {
      let newTasks = [...prev];
      let newid = newTasks.length;
      newTasks.push({ id: newid, word: "", time: newtime, val: false, del: false, tag: false });
      return newTasks;
    });

    /*
    fetch("http://localhost:5173/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        word: "",
        time: nowtime,
        val: false,
        del: false,
        tag: false,
      }),
    }).then(() => {
      const newTasks = [...tasks];
      newTasks.push({ word: "", time: nowtime, val: false, del: false, tag: false });
      setTasks(newTasks);
    });
    */
  }
  

  function handleSelect(e) {
    const selected = document.getElementById("selected");
    const task_all = tasks.filter((task) => (task.del == false));
    const task_tag = tasks.filter((task) => (task.tag == true && task.del == false));
    const task_untag = tasks.filter((task) => (task.tag == false && task.del == false));
    const task_undo = tasks.filter((task) => (task.val == false && task.del == false));
    const task_done = tasks.filter((task) => (task.val == true && task.del == false));
    const task_del = tasks.filter((task) => (task.del == true && task.id >= 0));
    switch (e.target.value) {
      case "all":
        selected.innerHTML = "ALL";
        showSelect(task_all, [task_del]);
        document.getElementById("taskadd").disabled = false;
        break;
      case "tagged":
        selected.innerHTML = "STARRED";
        showSelect(task_tag, [task_untag, task_del]);
        document.getElementById("taskadd").disabled = true;
        break;
      case "undone":
        selected.innerHTML = "UNDONE";
        showSelect(task_undo, [task_done, task_del]);
        document.getElementById("taskadd").disabled = true;
        break;
      case "done":
        selected.innerHTML = "DONE";
        showSelect(task_done, [task_undo, task_del]);
        document.getElementById("taskadd").disabled = true;
        break;
      case "deleted":
        selected.innerHTML = "TRASH";
        showSelect(task_del, [task_all]);
        document.getElementById("taskadd").disabled = true;
        break;
      default:
        return;
    }
  }

  const showTask = tasks.filter((task) => (task.id >= 0)).map((task) => (
    <TaskBox 
      key={"task"+task.id}
      task={task} 
      id={task.id} 
      handleTaskCheck={() => handleTaskCheck(task.id)} 
      handleTaskDel={() => handleTaskDel(task.id)} 
      handleTaskTag={() => handleTaskTag(task.id)}
      handleTaskX={() => handleTaskX(task.id)}
    />
  ));

  function displayHide(id) {
    let box = document.getElementById(`taskbox${id}`);
    if (!box.classList.contains('hidden visuallyhidden')) {
      let boxopc = box.style.opacity;
      document.documentElement.style.setProperty("--taskbox-opc", `${boxopc}`);
      box.classList.add('visuallyhidden');  
      setTimeout(function () {
        box.classList.add('hidden');
      }, 600);
    }
  }

  function showSelect(showTasks, hideTasks) {
    // hide
    let isHidden = false;
    hideTasks.forEach((hidetask) => {
      hidetask.forEach((task) => {
        isHidden = true;
        displayHide(task.id);
      });
    });
    // show
    let showDelay = isHidden ? 600 : 0;
    showTasks.forEach((task) => {
      let box = document.getElementById(`taskbox${task.id}`);
      if (box.classList.contains('hidden')) {
        if (task.val == true) {
          document.documentElement.style.setProperty("--taskbox-opc", "0.6");
        } else {
          document.documentElement.style.setProperty("--taskbox-opc", "1");
        }
        setTimeout(function () {
          box.classList.remove('hidden');
          box.classList.remove('visuallyhidden');
        }, showDelay);
      }
    });
  }

  return (
    <>
      <div className="App">
        <input 
          type="text" 
          className="title" 
          placeholder="Hello TODO!"
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          title="Tap to edit the title"
          spellCheck="false" />
        <div className="boxs">
          {showTask}
        </div>
        <button 
          id="taskadd" 
          onClick={handleTaskAdd}><i className="fa fa-plus-square" aria-hidden="true"></i>
        </button>
        <input type="checkbox" id="barsinput" className="checkboxarea" />
        <div className="bars">
          <label htmlFor="barsinput"><i className="fa fa-bars"></i></label>
          <div className="select">
            <label htmlFor="selectid"><p id="selected">ALL</p></label>
            <select id="selectid" onChange={(e) => handleSelect(e)}>
              <option value="all">ALL</option>
              <option value="tagged">STARRED</option>
              <option value="undone">UNDONE</option>
              <option value="done">DONE</option>
              <option value="deleted">TRASH</option>
            </select>
          </div>
        </div>
        <div className="foot">
          <a href="https://github.com/r09521516/todo.git">Designed by Lei</a>
        </div>
      </div>
    </>
  )
}

export default App
