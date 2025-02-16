//Componente Middleware
export const createMiddleware = () => {
    return {
        send: (todo) => {
            return new Promise((resolve, reject) => {
                fetch("/todo/add", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(todo)
                })
                    .then((response) => response.json())
                    .then((json) => {
                        resolve(json); // risposta del server all'aggiunta
                    })
            })
        },
        load: () => {
            return new Promise((resolve, reject) => {
                fetch("/todo")
                    .then((response) => response.json())
                    .then((json) => {
                        resolve(json); // risposta del server con la lista         
                    })
            })
        },
        put: (todo) => {
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
        delete: (id) => {
            return new Promise((resolve, reject) => {
                fetch("/todo/" + id, {
                    method: 'DELETE'                
                })
                    .then((response) => response.json())
                    .then((json) => {
                        resolve(json);
                    })
            })
        }
    }
}

//Componente FORM
export const createForm = (add) => {
    const inputInsert = document.querySelector("#inputInsert");
    const buttonInsert = document.querySelector("#buttonInsert");
    buttonInsert.onclick = () => {
        add(inputInsert.value);
        inputInsert.value = "";
    }
}

//Componente Tabella
export const createList = () => {
    const listTable = document.querySelector("#listTable");
    const template = `
                    <tr>                            
                        <td class="%COLOR">%TASK</td>
                        <td><button class="btn btn-success" id="COMPLETE_%ID" type="button">COMPLETA</button></td>                            
                        <td><button class="btn btn-danger" id="DELETE_%ID" type="button">ELIMINA</button></td>                                                    
                    </tr>
    `;
    return {
        render: (todos, completeTodo, deleteTodo) => {
            let html = "";
            todos.forEach((todo) => {
                let row = template.replace("COMPLETE_%ID", "COMPLETE_" + todo.id);
                row = row.replace("DELETE_%ID", "DELETE_" + todo.id);
                row = row.replace("%TASK", todo.name);
                row = row.replace("%COLOR", todo.completed ? "text-success" : "text-primary");
                html += row;
            });
            listTable.innerHTML = html;
            todos.forEach((todo) => {
                document.querySelector("#COMPLETE_" + todo.id).onclick = () => completeTodo(todo.id);
                document.querySelector("#DELETE_" + todo.id).onclick = () => deleteTodo(todo.id);
            })
        }
    }
}

//Componente BusinessLogic
export const createBusinessLogic = (middleware, list) => {
    let todos = [];
    const reload = () => {
        middleware.load()
        .then((json) => {
            todos = json.todos;
            list.render(todos, completeTodo, deleteTodo);
        })
    }
    const completeTodo = (id) => {
        const todo = todos.filter((todo) => todo.id === id)[0];
        middleware.put(todo)
            .then(() => reload());
    }
    const deleteTodo =  (id) => {
        console.log("delete " + id);
        middleware.delete(id)
        .then(() => reload());
    }
    return {
        add: (task) => {
            const todo = {
                name: task,
                completed: false
            }
            middleware.send({ todo: todo })
                .then(() => reload());
        },
        reload: reload
    }
}

const middleware = createMiddleware();
const list = createList();
const businessLogic = createBusinessLogic(middleware, list);
const form = createForm(businessLogic.add);
businessLogic.reload();



const createController = () => {
    
}


//Componente Navigatore
const hide = (elements) => {
    elements.forEach((element) => {
       element.classList.add("hidden");
       element.classList.remove("visible");
    });
};
 
const show = (element) => {
    element.classList.add("visible");
    element.classList.remove("hidden");
};

document.getElementById("buttonCancella").onclick = () => {
    window.location.hash = "#home";
};
  
document.getElementById("adminButton").onclick = () => {
    window.location.hash = "#login";
};
 
export const createNavigator = (parentElement) => {
    const pages = Array.from(parentElement.querySelectorAll(".page"));
 
    const render = () => {
       console.log("aaaaa");
       const url = new URL(document.location.href);
       const pageName = url.hash.replace("#", "");
       const selected = pages.filter((page) => page.id === pageName)[0] || pages[0];
 
       hide(pages);
       show(selected);
    }
    window.addEventListener('popstate', render); 
    render();
};



//Componente LOGIN
const registerButton = document.getElementById("register-button");
const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");
const privateSection = document.getElementById("private-section");
const registerUsername = document.getElementById("register-username");
const registerPassword = document.getElementById("register-password");
const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");

const openModalButton = document.getElementById("openModalButton");
const modifyButton = document.getElementById("modifyButton");
const deleteButton = document.getElementById("deleteButton");

const isLogged = sessionStorage.getItem("Logged") === "true";

if (isLogged) {
  openModalButton.classList.remove("hidden");
  modifyButton.classList.remove("hidden");
  deleteButton.classList.remove("hidden");
}

export const login = function (username, password) {
  return fetch("conf.json")
    .then((response) => response.json())
    .then((confData) => {
      return fetch("https://ws.cipiaceinfo.it/credential/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          key: confData.cacheToken,
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.result === true) {
            alert("Login effettuato con successo!");
            openModalButton.classList.remove("hidden");
            modifyButton.classList.remove("hidden");
            deleteButton.classList.remove("hidden");
            sessionStorage.setItem("Logged", "true");
          } else {
            alert("Credenziali errate.");
          }
        })
        .catch((error) => {
          console.error("Errore login:", error);
          alert("Login fallito. Controlla le credenziali.");
        });
    });
};

loginButton.onclick = () => {
  const username = loginUsername.value;
  const password = loginPassword.value;
  if (username && password) {
    login(username, password);
  } else {
    alert("Compila tutti i campi.");
  }
};