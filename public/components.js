//Componente Middleware
export const createMiddleware = () => {
    return {
        send: (images) => {
            return new Promise((resolve, reject) => {
                fetch("/images/add", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(images)
                })
                    .then((response) => response.json())
                    .then((json) => {
                        resolve(json); // risposta del server all'aggiunta
                    })
            })
        },
        load: () => {
            return new Promise((resolve, reject) => {
                fetch("/images")
                    .then((response) => response.json())
                    .then((json) => {
                        resolve(json); // risposta del server con la lista         
                    })
            })
        },
        put: (images) => {
            return new Promise((resolve, reject) => {
                fetch("/images/complete", {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(images)
                })
                    .then((response) => response.json())
                    .then((json) => {
                        resolve(json);
                    })
            })
        },
        delete: (id) => {
            return new Promise((resolve, reject) => {
                fetch("/images/" + id, {
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

//Componente Tabella
export const createList = (newElement) => {
    let tableData;
    const bindingElement = newElement;
    return {
        render: (todos, completeTodo, deleteTodo) => {
            let line = `
            <h1>IMMAGINI</h1>
            <div style="text-align: left; padding-bottom:2%;">
                <h1 class="add-title">Aggiungi foto</h1>
                <button class="add-button"><b>+</b></button>
            </div>`;
            tableData.forEach((image,index) => {
                //--------------------------------------------CAMBIARE NOME-------------------------------------------------------
                const imageName = image.url
                row += `<div style="text-align: left; padding-bottom:2%;">
                            <a href=""><h1 class="image-name">${imageName}</h1></a>
                            <button id="button-delete-${index}" class="delete-button"><b>X</b></button>
                        </div>`
            });
            bindingElement.innerHTML = html;

            tableData.forEach((images,index) => {
                document.getElementById(`button-delete-${index}`).onclick = () => {
                    //--------------------------------------FINIRE-------------------------------------------
                }
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
const loginButton = document.getElementById("login-button");
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

export const createLogin = function (username, password) {
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