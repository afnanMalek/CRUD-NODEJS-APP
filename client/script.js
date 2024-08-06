// const { json } = require("body-parser");

document.addEventListener('DOMContentLoaded',()=>{
    fetch("http://localhost:5000/getAll")
    .then(response=>response.json())
    .then(data=>LoadHTMLTable(data['data']));
});

const btn=document.getElementById("create-update-button");
btn.addEventListener("click",()=>{
    const input=document.getElementById('create-update-input');
    const input_data=input.value;
    input.value="";

    fetch("http://localhost:5000/insert",{
        headers:{
            'Content-type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({ name: input_data })
    })
    .then(response=>response.json())
    .then(data=>insertRowIntoTable(data['data']))
});


const insertRowIntoTable=(data)=>{
    const table_row=document.querySelector('table tbody');
    const isTableData=document.querySelector('.no_data');

    let tableHTML="<tr>"

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            if(key=='dateAdded'){
                data[key]=new Date(data[key]).toLocaleString();
            }
            tableHTML+=`<td>${data[key]}</td>`
        }
    }
    tableHTML+=`<td><button class="delete-row-button" data-id=${data.id}>Delete</button></td>
                <td><button class="edit-row-button" data-id=${data.id}>Edit</button></td>`
    tableHTML+="</tr>";

    table.innerHTML=tableHTML;
    // if(isTableData){
    //     table.innerHTML=tableHTML;
    // }
    // else{
        // const newrow=table.insertrow();
        // newrow.innerHTML=tableHTML;
    // }
}

const table=document.querySelector('table tbody');
table.addEventListener("click",(event)=>{
    // console.log(event.target);
    if(event.target.className==="delete-row-button"){
        // console.log(event.target.dataset.id); 
        deleteRowById(event.target.dataset.id);
    }
    else if(event.target.className==="edit-row-button"){
        console.log(event.target);
        handleEditRowById(event.target.dataset.id);
    }
});

const deleteRowById=(id)=>{
    // console.log(id);
    fetch("http://localhost:5000/delete/"+id, {
        method:'DELETE'
    })
    .then(response=>response.json())
    .then((data)=>{
        if(data.success){
            // location.reload();
            fetch("http://localhost:5000/getAll")
            .then(response=>response.json())
            .then(data=>LoadHTMLTable(data['data']));
        }
    });
}
const handleEditRowById=(id)=>{
    const update_section=document.getElementById("update-row");
    update_section.hidden=false;
    document.querySelector("#update-row-btn").dataset.id=id;
}

const update_btn=document.querySelector('#update-row-btn');
update_btn.onclick=()=>{
    const update_input=document.querySelector('#update-name-input');
    const id=document.querySelector("#update-row-btn").dataset.id;
    console.log(update_input.value);
    console.log(id);
    fetch("http://localhost:5000/update",{
        method:"PATCH",
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({
            id:id,
            name:update_input.value
        })
    })
    .then(response=>response.json())
    .then(data=>{
        if(data.success){
            fetch("http://localhost:5000/getAll")
            .then(response=>response.json())
            .then(data=>LoadHTMLTable(data['data']));
        }
    })
    update_input.value="";
}

const search_btn=document.querySelector("#search-button");
search_btn.onclick=(event)=>{
    event.preventDefault();

    search_input=document.querySelector('#search-input').value;

    console.log(search_input);
    fetch(`http://localhost:5000/search/`+ search_input)
    .then(response=>response.json())
    .then(data=>LoadHTMLTable(data['data']));
    // .then(data=>console.log(data['data']));
}

const LoadHTMLTable=(data)=>{
    const table=document.querySelector('table tbody');
    
    if(data.length==0){
        table.innerHTML=`<tr><td class='no_data' colspan='5'>No-Data</td></tr>`
        return;
    }
    let tableHTML="";
    data.forEach(({id,name,Added_date}) => {
        tableHTML+=`<tr>
        <td>${id}</td>
        <td>${name}</td>
        <td>${new Date(Added_date).toLocaleString()}</td>
        <td><button class="delete-row-button" data-id=${id}>Delete</button></td>
        <td><button class="edit-row-button" data-id=${id}>Edit</button></td>
        </tr>`;
    });
    table.innerHTML=tableHTML;
}