
let token;
const tasks = [];
const TOKEN_KEY = "token";
const myHeaders = {'accept': 'application/json',
'Content-Type': 'application/json'};

const getToken = async (email, password) =>{
    let res = await fetch("https://to-do-afpa.forticas.com/public/authentication_token", {
    method: "POST",
    headers: myHeaders,
    body:
    JSON.stringify({ 
        "email": `${email}`,
        "password": `${password}`
    })
})
let key = await res.json();
localStorage.setItem('token', key.token);
}

const createHtml = (task) =>{
    const listContainer  = document.getElementById("listContainer");
    const taskDateString = task.date.toString();
    const taskDate = taskDateString.split("T")[0];
    var tasksHtml= "";
    tasksHtml += `
    <ul class="list-group list-group-horizontal  rounded-0 bg-transparent">
    <li class="list-group-item d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 bg-transparent">
    <div class="form-check">
    <input class="form-check-input me-0" type="checkbox" value="" id="flexCheckChecked1" aria-label="..."/>
    </div>
    </li>
    <li class="list-group-item px-3 py-1 d-flex align-items-center flex-grow-1 border-0 bg-transparent">
    <p class="lead fw-normal mb-0">${task.Title}</p>
    </li>
    <li class="list-group-item ps-3 pe-0 py-1 rounded-0 border-0 bg-transparent">
    <div class="d-flex flex-row justify-content-end mb-1">
    <a href="${tasks[0].indexOf(task)}" class="editTaskBtn text-info" data-mdb-toggle="tooltip" title="Edit todo"><i class="fas fa-pencil-alt me-3"></i></a>
    <a href="#!" class=" text-danger" data-mdb-toggle="tooltip" title="Delete todo"><i class="fas fa-trash-alt"></i></a>
    </div>
    <div class="text-end text-muted">
    <a href="#!" class="text-muted" data-mdb-toggle="tooltip" title="Created date">
    <p class="small mb-0"><i class="fas fa-info-circle me-2"></i>${taskDate}</p></a>
    </div>
    </li>
    </ul>
    
    <div id="edit${tasks[0].indexOf(task)}" class="card-body">
    
    </div>
    `
    listContainer.innerHTML += tasksHtml;



    
}

const editHTML = (task) => {
    
    editTaskHtml = ``;
    editTaskHtml = `<form action="" class="editForm">
    <div class="d-flex flex-row align-items-center">
    <input type="text" class="form-control form-control-lg" value="${task.Title}">  
    </div>
    <div class="d-flex flex-row align-items-center mt-3">
    <input type="text" class="form-control form-control-lg" value="${task.description}">
    </div>
    <select  class="form-select" aria-label="Default select example">
    <option >Choisissez la priorité</option>
    <option value="haute" ${task.periority=="Haute"?"selected":""}>Haute</option>
    <option value="normal" ${task.periority=="Normal"?"selected":""}>Normal</option>
    <option value="basse" ${task.periority=="Basse"?"selected":""}>Basse</option>
    </select>
    
    <div class="mt-3"><input id="date${task.id}" type="text" class="datepick form-control form-control-lg"  "></div>
    <input  type="hidden" value="${task.id}">
    <button type="submit"  class="btn mt-3 btn-primary">Valider la modification</button>
    </form>
    `
    document.getElementById(`edit${tasks[0].indexOf(task)}`).innerHTML = editTaskHtml;
    document.querySelectorAll(".editForm").forEach(form =>{
        form.addEventListener("submit", (e)=>{
            e.preventDefault();
            editTask(form);
            getTask();
        });
    })
    $(".datepick").each(function(){
        $(this).datepicker({ dateFormat: 'yy-mm-dd' }).val();
        $(this).datepicker("setDate",  `${tasks[0][tasks[0].indexOf(task)].date.split("T")[0]}` ); 
    })
}

const editTask = (form)=>{
    fetch(`https://to-do-afpa.forticas.com/public/api/tasks/` + form[4].value, {
    method: "PUT",
    headers: {'accept': 'application/json',
    'Content-Type': 'application/json', 'Authorization' : `Bearer ${localStorage.getItem(TOKEN_KEY)}`},
    body: JSON.stringify({
        "Title": `${form[0].value}`,
        "description": `${form[1].value}`,
        "date": `${form[3].value}`,
        "periority": `${form[2].value}`
    })
})
}

const getTask = async () =>{
    let res = await fetch(`https://to-do-afpa.forticas.com/public/api/tasks` , {
    method: "GET", 
    headers:  {'accept': 'application/json',
    'Content-Type': 'application/json', 'Authorization' : `Bearer ${localStorage.getItem(TOKEN_KEY)}`},
})
tasks.push(await res.json());
console.log(tasks);
if(res.status == 401){
    localStorage.removeItem('token');
    getToken;
}
tasks[0].forEach(task =>{
    createHtml(task);
    console.log(task)
})
document.querySelectorAll(".editTaskBtn").forEach(btn =>{
    btn.addEventListener("click", (e)=>{
        e.preventDefault();
        editHTML(tasks[0][btn.getAttribute("href")]);
    })
})
}

const newTask = async (title, description, date, priority) =>{
    fetch(`https://to-do-afpa.forticas.com/public/api/tasks`,{
    method: "POST",
    headers: {'accept': 'application/json',
    'Content-Type': 'application/json', 'Authorization' : `Bearer ${localStorage.getItem(TOKEN_KEY)}`},
    body: JSON.stringify({
        "Title": `${title}`,
        "description": `${description}`,
        "date": `${date}`,
        "periority": `${priority}`
    })
})
}

document.getElementById("addTask").addEventListener('submit', (e)=>{
    e.preventDefault();
    const titre = document.getElementById("titre");
    const description = document.getElementById("description");
    const datepicker = document.getElementById("datepicker");
    const priority = document.getElementById("priorite");
    newTask(titre.value, description.value, datepicker.value, priority.value);  
    alert("hey")
})
document.addEventListener("DOMContentLoaded", ()=>{
    const application = document.getElementById("application");
    const login = document.getElementById("login");
    token = localStorage.getItem(TOKEN_KEY);
    if(!token){
        login.classList.remove("d-none");
        document.getElementById("loginBtn").addEventListener('click', async e =>{
            e.preventDefault();
            await getToken(
                document.getElementById("email").value, 
                document.getElementById("password").value
                ).then(login.classList.add("d-none"),
                application.classList.remove("d-none")
                );
                getTask();
            })
        }
        else{
            getTask();
            application.classList.remove("d-none");
        }
        $(".datepick").each(function(){
            $(this).datepicker({ dateFormat: 'yy-mm-dd' }).val();
        })
    })
