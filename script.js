  $(document).ready(function () {
    $("#datepicker").datepicker({

    });
});

const myHeaders = new Headers({'accept': 'application/json',
'Content-Type': 'application/json'});

const getToken = async () =>{
    fetch("https://to-do-afpa.forticas.com/public/authentication_token", {
    method: "POST",
    headers: myHeaders,
    body:
       JSON.stringify({ 
        "email": "kbrantone@gmail.com",
        "password": "ability"
      })
}).then(response => response.json())
   .then(key => {document.cookie = key.token})
}

const createHtml = (task) =>{
    const listContainer  = document.getElementById("listContainer");
    var tasksHtml= "";
    tasksHtml += `
    <ul class="list-group list-group-horizontal  ">
    <li class="list-group-item d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 ">
        <div class="form-check">
            <input
            class="form-check-input me-0"
            type="checkbox"
            value=""
            id="flexCheckChecked1"
            aria-label="..."
            checked
            />
        </div>
    </li>
    <li class="list-group-item px-3 py-1 d-flex align-items-center flex-grow-1">
        <p class="lead fw-normal mb-0">${task.Title}</p>
    </li>
    <li class="list-group-item ps-3 pe-0 py-1 rounded-0 border-0">
        <div class="d-flex flex-row justify-content-end mb-1">
            <a href="#!" class="text-info" data-mdb-toggle="tooltip" title="Edit todo"><i class="fas fa-pencil-alt me-3"></i></a>
            <a href="#!" class="text-danger" data-mdb-toggle="tooltip" title="Delete todo"><i class="fas fa-trash-alt"></i></a>
        </div>
        <div class="text-end text-muted">
            <a href="#!" class="text-muted" data-mdb-toggle="tooltip" title="Created date">
                <p class="small mb-0"><i class="fas fa-info-circle me-2"></i>28th Jun 2020</p></a>
            </div>
        </li>
    </ul>
    `
    listContainer.innerHTML += tasksHtml;

}

const getTask = async () =>{
    fetch(`https://to-do-afpa.forticas.com/public/api/tasks` , {
        method: "GET", 
        headers: {'accept': 'application/json',
        'Content-Type': 'application/json', 'Authorization' : `Bearer ${document.cookie}`}
    }).then(response => response.json())
    .then(tasks => {tasks.forEach(task => {
        createHtml(task);
    });})
    
    }




getToken();
getTask();
