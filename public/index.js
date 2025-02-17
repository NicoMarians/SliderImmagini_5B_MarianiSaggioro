import { createNavigator, createMiddleware, createForm, createList, createBusinessLogic, createLogin } from "./components";

const navigator = createNavigator();
const middleware = createMiddleware;
const form = createForm;
const table = createList;
const businessLogic = createBusinessLogic;
const login = createLogin;

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

button.onclick = handleSubmit;