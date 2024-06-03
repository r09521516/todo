import { useEffect, useState } from 'react'


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

let numOfTask = 0;

function TaskBox() {

  var date = new Date();
  const nowtime = setTimeFormat(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes());

  const [task, setTask] = useState(() => ({val: 0, word: "", time: nowtime, del: 0, tag: 0, num: numOfTask}));

  function handleTaskCheck() {
    setTask(prev => {
      let neww = prev;
      if (prev.val == 0) {
        neww.val = 1;
      } else {
        neww.val = 0;
      }
      return neww;
    });

    let btntag = document.getElementById(`task-tag${task.num}`);
    let box = document.getElementById(`taskbox${task.num}`);
    if (document.getElementById(`check${task.num}`).checked) {
      document.getElementById(`task-input${task.num}`).style.setProperty("text-decoration", "line-through");
      box.style.setProperty("opacity", "0.6");
      if (btntag.classList.contains("important")) {
        btntag.classList.remove("important");
        box.classList.remove("importanttag");
      }
    } else {
      document.getElementById(`task-input${task.num}`).style.setProperty("text-decoration", "none");
      box.style.setProperty("opacity", "1");
    }
  }
  
  function handleTaskDel() {
    setTask(prev => {
      let neww = prev;
      if (prev.del == 0) {
        neww.del = 1;
      } else {
        neww.del = 0;
      }
      return neww;
    });

    let box = document.getElementById(`taskbox${task.num}`);
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

  // function handleTaskInput(e) {
  //   // let inputTask = document.getElementById(`task-input${task.num}`);
  //   let inputword = e.target.value.toString();
  //   if (inputword.length > 0) {
  //     return inputword;
  //   }
  // }

  function handleTaskTag() {
    setTask(prev => {
      let neww = prev;
      if (prev.tag == 0) {
        neww.tag = 1;
      } else {
        neww.tag = 0;
      }
      return neww;
    });

    let btntag = document.getElementById(`task-tag${task.num}`);
    let box = document.getElementById(`taskbox${task.num}`);
    if (btntag.classList.contains("important")) {
      btntag.classList.remove("important");
      box.classList.remove("importanttag");
    } else {
      btntag.classList.add("important");
      box.classList.add("importanttag");
    }
    // let inputTask = document.getElementById(`task-input${task.num}`);
    // inputTask.style.setProperty("z-index", "3");
    
    // window.addEventListener("keydown", (e) => {
    //   if (e.key == "Enter") {
    //     inputTask.style.setProperty("z-index", "-1");
    //     setTask(prev => {
    //       let neww = prev;
    //       neww.word = value;
    //       return neww;
    //     });
    //   }
    // });
    // window.removeEventListener("keydown");
    // console.log("edit");
  }
  
  return (
    <>
      <div id={`taskbox${task.num}`}  className="box">
        <div className="checkarea">
          <input type="checkbox" id={`check${task.num}`} className="checkboxarea" onClick={handleTaskCheck}/>
          <label htmlFor={`check${task.num}`} className="undo"><i className="fa fa-square" aria-hidden="true"></i></label>
          <label htmlFor={`check${task.num}`} className="isdo"><i className="fa fa-check-square" aria-hidden="true"></i></label>
        </div>
        <div className="taskarea">
          <input 
            type="text" 
            id={`task-input${task.num}`} 
            className="task-input"
            onChange={(e) => setTask(prev => {
              let neww = prev;
              neww.word = e.target.value;
              return neww;
            })} 
            placeholder="New event"
          />
          <p id={`task-time${task.num}`} className="task-time">{task.time}</p>
        </div>
        <button id={`task-del${task.num}`} className="btn-task del" onClick={handleTaskDel}><i className="fa fa-trash" aria-hidden="true"></i></button>
        <button id={`task-tag${task.num}`} className="btn-task tag" onClick={handleTaskTag}><i className="fa fa-star" aria-hidden="true"></i></button>
      </div>
    </>
  )
}

function App() {
  const [tasklist, setTasklist] = useState([<TaskBox key="0"></TaskBox>]);
  const [title, setTitle] = useState("Hello TODO!");

  function handleTaskAdd() {
    numOfTask += 1;
    setTasklist(prev => {
      let neww = [...prev];
      let count = neww.length;
      neww.push(<TaskBox key={count}></TaskBox>);
      return neww;
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
          title="Tap to edit title" />
        <div className="boxs">
          {tasklist}
        </div>
        <button id="taskadd" onClick={handleTaskAdd}><i className="fa fa-plus-square" aria-hidden="true"></i></button>
        {/* <button id="setting"><i className="fa fa-cog" aria-hidden="true"></i></button> */}
        <div className="foot"><a href="https://github.com/r09521516/wordle.git">Designed by Lei</a></div>
      </div>
    </>
  )
}

export default App
