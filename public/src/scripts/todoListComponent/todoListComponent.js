export const generateTodoListComponent = (parentElement) => {
    //let todos = [{"todo": "test", "status": "active"}] ;
    let todos = [];

    return {
        setTodos: function (setTodos) {
            todos = setTodos;
        },
        render: function () {
            let html = '<table class="table"><tbody>';

            if (todos.length !== 0) {
                todos.forEach((element, index) => {
                    console.log(element)
                    if (!element.completed) {
                        html += '<tr><td>' + '<span id="todo' + index + '">' + element.name + '</span>' +
                            '</td><td><button type="button" id="conferma' + index + '" class="btn btn-success completa">COMPLETA</button>' +
                            '</td><td><button type="button" id="elimina' + index + '" class="btn btn-danger elimina">ELIMINA</button>' + '</td></tr>';
                    } else {
                        html += '<tr><td>' + '<span id="todo' + index + '" class="active">' + element.name + '</span>' +
                            '</td><td><button type="button" id="conferma' + index + '" class="btn btn-success completa">COMPLETA</button>' +
                            '</td><td><button type="button" id="elimina' + index + '" class="btn btn-danger elimina">ELIMINA</button>' + '</td></tr>';
                    }
                })
            } else {
                html = "Non ci sono ancora delle attivita'. Aggiungine di nuove per gestirle!";
            }

            html += '</tbody></table>';
            parentElement.innerHTML = html;

            document.querySelectorAll(".elimina").forEach((element, index) => {
                //(element);
                element.onclick = async () => {
                    //console.log("elimina");
                    await this.deleteTodo(todos[index].id);

                    //console.log(deleteTodo) ;

                    this.load()
                        .then((r) => {
                            this.setTodos(r.todos);
                            this.render();
                        });
                }
            });

            document.querySelectorAll(".completa").forEach((element, index) => {
                //console.log(element);
                element.onclick = async () => {
                    //   console.log("completa");

                    await this.completeTodo(todos[index]);
                    //console.log(completeTodo) ;

                    this.load()
                        .then((r) => {
                            this.setTodos(r.todos);
                            //     console.log(r.todos);
                            this.render();
                        });
                }
            });
        },
        send: function (todo) {
            return new Promise((resolve, reject) => {
                fetch("/todo/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(todo),
                })
                    .then((response) => response.json())
                    .then((json) => {
                        resolve(json); // risposta del server all'aggiunta
                    });
            });
        },
        load: function () {
            return new Promise((resolve, reject) => {
                fetch("/todo")
                    .then((response) => response.json())
                    .then((json) => {
                        resolve(json); // risposta del server con la lista
                    })
            })
        },
        completeTodo: function (todo) {
            return new Promise((resolve, reject) => {
                fetch("/todo/complete", {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(todo)
                })
                    .then((response) => response.json())
                    .then((json) => {
                        resolve(json);
                    })
            })
        },
        deleteTodo: function (id) {
            return new Promise((resolve, reject) => {
                fetch("/todo/" + id, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => response.json())
                    .then((json) => {
                        resolve(json);
                    });
            });
        },
    }
}