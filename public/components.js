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

//Componente PubSub
const createPubSub = () => {
    const dict = {};
    return {
        subscribe: (eventName, callback) => {
            if (!dict[eventName]) {
                dict[eventName] = callback;
            }
        },
        publish: (eventName) => {
            dict[eventName];
        }
    }
}
export const pubSub = createPubSub();

//Componente Tabella
export const createList = (newElement) => {
    let tableData;
    const bindingElement = newElement;
    return {
        render: () => {
            let line = `
            <h1>IMMAGINI</h1>
            <div style="text-align: left; padding-bottom:2%;">
                <h1 class="add-title">Aggiungi foto</h1>
                <button class="add-button"><b>+</b></button>
            </div>`;
            tableData.forEach((image,) => {
                let temp = image.url.split("/");
                const imageName = temp[temp.length - 1];
                row += `<div style="text-align: left; padding-bottom:2%;">
                            <a href=""><h1 class="image-name">${imageName}</h1></a>
                            <button id="button-delete-${image.id}" class="delete-button"><b>X</b></button>
                        </div>`
            });
            bindingElement.innerHTML = line;

            pubSub.publish("setDeleteOnclick");
        },
        setTableData: (newData) => {
            tableData = newData;
        }
    }
}

//Componente BusinessLogic

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

export const createNavigator = () => {
    const pages = Array.from(document.querySelectorAll(".page"));
 
    const render = () => {
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

export const createLogin = () => {
    let isLogged = false;
    return {
        checkLogin: (username, password) => {
            return new Promise ((resolve,reject) => {
                fetch("conf.json").then((response) => response.json()).then((confData) => {
                    fetch("https://ws.cipiaceinfo.it/credential/login", {
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                        key: confData.loginToken,
                        },
                        body: JSON.stringify({ username, password }),
                    })
                    .then((response) => response.json())
                    .then((result) => {
                        resolve(result.result);
                    })
                    .catch((error) => {
                        console.error("Errore login:", error);
                        alert("Errore");
                        reject (result);
                    });
                })
            });
        },
        validateLogin: () => {
            isLogged = true;
        },
    }
  return
};

