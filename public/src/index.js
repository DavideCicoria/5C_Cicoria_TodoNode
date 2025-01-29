import { generateFormComponent } from "./scripts/formComponent/formComponent.js";
import { generateTodoListComponent } from "./scripts/todoListComponent/todoListComponent.js";

const form = generateFormComponent(document.getElementById('formDiv')) ;
const todoList = generateTodoListComponent(document.getElementById('todoListDiv')) ;


let todos ;
todoList.load()
.then((json) => {
    todos = json.todos;
    todoList.setTodos(todos);
    console.log(todos) ;
    todoList.render();
});

todoList.render() ;

form.build('todoInput', 'submit') ;
form.render() ;
form.onsubmit((todo) => {
    todoList.send({todo: todo})
    .then(() => todoList.load())
    .then((json) => { 
        todos = json.todos;
        todoList.setTodos(todos) ;
        todoInput.value = "";
        todoList.render();
   });
}) ;

setInterval(() => {
    todoList.load().then((json) => {
        todoList.setTodos(json.todos);
        todoList.render();
  });
  }, 30000);