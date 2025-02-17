//Componente Middleware
export const createMiddleware = () => {
    return {
        send: (image) => {
            return new Promise((resolve, reject) => {
                fetch("http://localhost:5600/slider/add", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(image)
                })
                    .then((response) => response.json())
                    .then((json) => {
                        resolve(json);
                    })
            })
        },
        load: () => {
            return new Promise((resolve, reject) => {
                fetch("http://localhost:5600/slider")
                    .then((response) => response.json())
                    .then((json) => {
                        resolve(json);       
                    })
            })
        },
        delete: (id) => {
            return new Promise((resolve, reject) => {
                fetch(`http://localhost:5600/delete/${id}`, {
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
                dict[eventName] = [];
            }
            dict[eventName].push(callback);
        },
        publish: (eventName) => {
            dict[eventName].forEach((callback) => callback());
        }
    }
}
export const pubSub = createPubSub();

//Componente Tabella
export const createList = (newElement) => {
    let tableData = [];
    const bindingElement = newElement;
    return {
        render: () => {
            let line = `
            <h1>IMMAGINI</h1>
            <div style="text-align: left; padding-bottom:2%;">
                <h1 class="add-title">Aggiungi foto</h1>
                <button class="add-button" id = "add-image-button"><b>+</b></button>
            </div>`;
            tableData.forEach((image,index) => {
                let temp = image.url.split("/");
                const imageName = temp[temp.length - 1];
                line += `<div style="text-align: left; padding-bottom:2%;">
                            <a id="view-${image.id}"><h1 class="image-name">${imageName}</h1></a>
                            <button id="button-delete-${image.id}" class="delete-button"><b>X</b></button>
                        </div>`
            });
            bindingElement.innerHTML = line;
            document.getElementById("add-image-button").onclick = () => {
                window.location.hash = "#insert";
            }

            tableData.forEach((image,index) => {
                document.getElementById(`view-${image.id}`).onclick = () => {
                    console.log(image.url);
                    document.getElementById("viewImmagine").innerHTML = `<img alt = "IMMAGINE" src="../${image.url}" style="height:100%">`;
                    window.location.hash = "#view";
                }
            });

            pubSub.publish("setDeleteOnclick");
        },
        setTableData: (newData) => {
            tableData = newData;
        }
    }
}

//Componente Carosello
export const createCarosello = (newElement) => {
    let images = [];
    const bindingElement = newElement;
    let displayedImage = 0;
    return {
        render: () => {
            console.log("render");
            bindingElement.innerHTML = `<img src="../${images[displayedImage].url}" alt="IMMAGINE" style = "width: 100%">`;
        },
        setImages: (newImages) => {
            images = newImages;
        },
        displayImageRight: () => {
            console.log("right");
            if (displayedImage + 1 >= images.length) displayedImage = 0;
            else displayedImage += 1;
            pubSub.publish("renderCarosello");
        },
        displayImageLeft: () => {
            console.log("left");
            if (displayedImage - 1 < 0) displayedImage = images.length - 1;
            else displayedImage -= 1;
            pubSub.publish("renderCarosello");
        }
    }
};

//Componente Navigatore

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


//Funzioni

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

