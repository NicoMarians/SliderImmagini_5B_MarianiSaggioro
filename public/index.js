import { createNavigator, createMiddleware, createList, createLogin, pubSub, createCarosello } from "./components.js";

const navigator = createNavigator();
const middleware = createMiddleware();
const table = createList(document.getElementById("tabellaImmagini"));
const login = createLogin();
const carosello = createCarosello(document.getElementById("divCarosello"));

middleware.load().then((newData) => {
    console.log(newData);
    table.setTableData(newData);
    carosello.setImages(newData);
    table.render();
})



pubSub.subscribe("setDeleteOnclick",() => {
    const data = middleware.load();
    data.forEach((element) => {
        document.getElementById(`button-delete-${element.id}`).onclick = () => {
            middleware.delete(element.id);
        }
    });
});

pubSub.subscribe("renderCarosello",carosello.render);

//Servizi middleware
pubSub.subscribe("get",middleware.load);
pubSub.subscribe("set",middleware.send);
pubSub.subscribe("del",middleware.delete);


//Upload File

const handleSubmit = async (event) => {
    const inputFile = document.getElementById('inputFile');
    const formData = new FormData();
    formData.append("file", inputFile.files[0]);
    const body = formData;
    const fetchOptions = {
        method: 'post',
        body: body
    };
    try {
        const res = await fetch("http://localhost:5600/slider/add", fetchOptions);
        const image = res.json();
        window.location.hash = "#admin";
        middleware.load().then((newData) => {
            console.log(newData);
            table.setTableData(newData);
            carosello.setImages(newData);
        })  
    } catch (e) {
        console.log(e);
    }

    //middleware.send({url:inputFile.files[0].name}).then(console.log);
}


//BOTTONI

document.getElementById("buttonConfermaLogin").onclick = () => {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    if (username && password) {
        login.checkLogin(username, password).then((result) => {
            console.log(result);
            if (result === true) {
                login.validateLogin();
                window.location.hash = "#admin";
            } else {
                alert("Credenziali errate");
            }
        }, console.log);
    } else {
      alert("Compila tutti i campi.");
    }
};

document.getElementById("bottoneCaroselloDestra").onclick = () => {
    carosello.displayImageRight();
}

document.getElementById("bottoneCaroselloSinistra").onclick = () => {
    carosello.displayImageLeft();
}

document.getElementById("buttonCancella").onclick = () => {
    window.location.hash = "#home";
};
  
document.getElementById("adminButton").onclick = () => {
    window.location.hash = "#login";
};

document.getElementById("buttonConfermaFile").onclick = handleSubmit;

document.getElementById("back-button-view").onclick = () => {
    window.location.hash = "#admin";
}

document.getElementById("home-button-admin").onclick = () => {
    window.location.hash = "#home"
}
