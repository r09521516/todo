import { useEffect, useState } from 'react';
// import { Outlet, Link } from "react-router-dom";
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
var date = new Date();
const nowtime = setTimeFormat(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes());

function TaskBox({ task, id, handleTaskCheck, handleTaskDel, handleTaskTag }) {

  return (
    <>
      <div id={`taskbox${id}`}  className="box">
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
            onChange={(e) => (task.word = e.target.value)} 
            placeholder="New event"
            spellCheck="false"
          />
          <p id={`task-time${id}`} className="task-time">{task.time}</p>
        </div>
        <button id={`task-del${id}`} className="btn-task del" onClick={handleTaskDel}><i className="fa fa-trash" aria-hidden="true"></i></button>
        <button id={`task-tag${id}`} className="btn-task tag" onClick={handleTaskTag}><i className="fa fa-star" aria-hidden="true"></i></button>
      </div>
    </>
  )
}

function App() {
  const [title, setTitle] = useState("Hello TODO!");
  const [tasks, setTasks] = useState([{ word: "", time: nowtime, val: false, del: false, tag: false }]);
  const [show, setShow] = useState();

  function handleTaskCheck(id) {
    tasks[id].val = !tasks[id].val;
    if (tasks[id].val == true && tasks[id].tag == true) {
      tasks[id].tag = false;
    }

    let btntag = document.getElementById(`task-tag${id}`);
    let box = document.getElementById(`taskbox${id}`);
    let inputtext = document.getElementById(`task-input${id}`);
    if (document.getElementById(`check${id}`).checked) {
      inputtext.style.setProperty("text-decoration", "line-through");
      box.style.setProperty("opacity", "0.6");
      if (btntag.classList.contains("important")) {
        btntag.classList.remove("important");
        box.classList.remove("importanttag");
      }
    } else {
      inputtext.style.setProperty("text-decoration", "none");
      box.style.setProperty("opacity", "1");
    }
  }
  
  function handleTaskDel(id) {
    tasks[id].del = !tasks[id].del;

    let box = document.getElementById(`taskbox${id}`);
    let boxopc = box.style.opacity;
    document.documentElement.style.setProperty("--taskbox-opc", `${boxopc}`);
    if (box.classList.contains('hidden')) {
      box.classList.remove('hidden');
      setTimeout(function () {
        box.classList.remove('visuallyhidden');
      }, 1);
    } else {
      box.classList.add('visuallyhidden');    
      box.addEventListener('animationend', function(e) {
        box.classList.add('hidden');
      }, {
        capture: false,
        once: true,
        passive: false
      });
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

  function handleTaskAdd() {
    var newdate = new Date();
    const newtime = setTimeFormat(newdate.getFullYear(), newdate.getMonth() + 1, newdate.getDate(), newdate.getHours(), newdate.getMinutes());
    setTasks(prev  => {
      let newTasks = [...prev];
      newTasks.push({ word: "", time: newtime, val: false, del: false, tag: false });
      return newTasks;
    });
    // document.getElementsByClassName("App").setProperty("height", ``);
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
    // const taskboxs = document.querySelectorAll("TaskBox");
    switch (e.target.value) {
      case "all":
        selected.innerHTML = "ALL";
        setShow(showTask(tasks));
        break;
      case "tagged":
        selected.innerHTML = "STARRED";
        setShow(task_tag);
        break;
      case "undone":
        selected.innerHTML = "UNDONE";
        setShow(task_undo);
        break;
      case "done":
        selected.innerHTML = "DONE";
        setShow(task_do);
        break;
      case "deleted":
        selected.innerHTML = "TRASH";
        setShow(task_del);
        break;
      default:
        return;
  }
}
const showTask = (t) => t.map((task, id) => (
  <TaskBox 
    key={"task"+id}
    task={task} 
    id={id}
    handleTaskCheck={() => handleTaskCheck(id)} 
    handleTaskDel={() => handleTaskDel(id)} 
    handleTaskTag={() => handleTaskTag(id)}
  />
));

const task_tag = showTask(tasks.filter((task) => (task.tag == true && task.del == false)));
const task_undo = showTask(tasks.filter((task) => (task.val == false && task.del == false)));
const task_do = showTask(tasks.filter((task) => (task.val == true && task.del == false)));
const task_del = showTask(tasks.filter((task) => (task.del == true)));

  // let numOfBox = tasks.filter((task) => task.del == false).length;
  // let element = document.getElementsByClassName("App");
  // let prevHeight = window.getComputedStyle(element).getPropertyValue("height");
  // document.documentElement.style.setProperty("--app-height", `calc(70px * (${numOfBox} - 1) + ${prevHeight})`);
  
  useEffect(() => {
    setShow(showTask(tasks));
    console.log(tasks);
    // console.log(tasks);
  //   fetch("http://localhost:5173/task")
  //     .then((response) => response.json())
  //     .then((json) => setTasks(json));
  }, [tasks]);
  

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
          {show}
        </div>
        <button 
          id="taskadd" 
          onClick={handleTaskAdd}><i className="fa fa-plus-square" aria-hidden="true"></i>
        </button>
        <div className="bars"><i className="fa fa-bars"></i></div>
        <div className="select">
          <label htmlFor="selectid">
            <p id="selected">ALL</p>
          </label>
          <select id="selectid" onChange={(e) => handleSelect(e)}>
            <option value="all">ALL</option>
            <option value="tagged">STARRED</option>
            <option value="undone">UNDONE</option>
            <option value="done">DONE</option>
            <option value="deleted">TRASH</option>
          </select>
        </div>
        <div className="foot">
          <a href="https://github.com/r09521516/todo.git">Designed by Lei</a>
        </div>
      </div>
    </>
  )
}

export default App
