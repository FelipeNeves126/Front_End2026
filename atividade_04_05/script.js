  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');

function addTask(){
  const textItem = taskInput.value.trim();
  if(textItem !== ''){
    const newTask = document.createElement('li');
    newTask.innerHTML = `
    <span>${textItem}</span>
    <button onclick="">Editar</button>
    <button onclick="">Remover</button>
    `;
    taskList.appendChild(newTask);
    taskInput.value='';
  }
     
}