import { createNavigator, createMiddleware, createList, createBusinessLogic, createLogin } from "./components.js";

const navigator = createNavigator();
const middleware = createMiddleware();
const table = createList(document.getElementById("tabellaImmagini"));
const businessLogic = createBusinessLogic();
const login = createLogin();

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

//Upload File
const inputFile = document.querySelector('#file');
const button = document.querySelector("#button");
const link = document.querySelector("#link");

const render = async () => {
    const list = await fetch("/filelist");
    const data = await list.json();

    const html = data
        .map(e => `<li><a href="${e}">${e}</a></li>`)
        .join("");

    link.innerHTML = `<ul>${html}</ul>`; 
};

(async () => {
    await render();
})();

const handleSubmit = async (event) => {
    const formData = new FormData();
    formData.append("file", inputFile.files[0]);
    const body = formData;
    const fetchOptions = {
        method: 'post',
        body: body
    };
    try {
        const res = await fetch("/upload", fetchOptions);
        const data = await res.json();
        await render();
    } catch (e) {
        console.log(e);
    }
}
