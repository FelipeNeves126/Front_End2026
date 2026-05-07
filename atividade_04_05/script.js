  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');

function addTask(){
  const textItem = taskInput.value.trim();
  if(textItem !== ''){
    const newTask = document.createElement('li');
    newTask.innerHTML = `
    <span>${textItem}</span>
    <button onclick="concluirItem(this)">Feito</button>
    <button onclick="editarItem(this)">Editar</button>
    <button onclick="removerItem(this)">Remover</button>
    `;
    taskList.appendChild(newTask);
    taskInput.value='';
  }
     
}

function concluirItem(button){
  const taskComplete = button.parentElement;
  taskComplete.classList.add('completed');
}

function editarItem(){

}

function removerItem(button){
  const taskToRemove = button.parentElement;
  taskList.removeChild(taskToRemove); 

}