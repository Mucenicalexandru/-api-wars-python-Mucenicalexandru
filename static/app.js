let columns = ['name', 'diameter', 'climate', 'terrain', 'surface_water', 'population', 'residents'];
let residentInfo = ['name', 'height', 'mass', 'hair_color', 'skin_color', 'eye_color', 'birth_year', 'gender'];
let nextData = '';
let previousData = '';
let signedIn = document.getElementsByTagName('h4')[0].innerHTML;



window.onload = function () {
    buildTable();
    populateList();
    nextPrevious();
    if (signedIn === "Signed in as:"){
        voteButton();
        voteClick();
    }
    clearTable();
}


// build only the body of the table. 10 rows, each with unique id from 1 to 10
function buildTable(){
    for (let i=1; i<=10; i++){
        let tableBody = document.getElementsByTagName('tbody')[0];
        let newRow = document.createElement('tr');

        for(let j=0; j<7; j++){
            let newCell = document.createElement('td')
            newCell.dataset.id = columns[j]
            newRow.appendChild(newCell);
        }

        newRow.setAttribute('class', 'table content');
        newRow.setAttribute('id', i)
        tableBody.appendChild(newRow);
    }
}


// i will use this function to increase the id's of <tr> by 10
function changeTableRowId(id){
    for (let i=1; i<11; i++){
        document.querySelectorAll('tr')[i].setAttribute('id', i+id);
    } 
}


//adding modal attributes to resident buttons
function residentsInfo(){
    let buttonList = document.querySelectorAll('td button');
    buttonList.forEach(function addAttribute(item){
        item.setAttribute("data-toggle", "modal")
        item.setAttribute("data-target", ".bd-example-modal-lg")
    })
}


function buildResidentsTable(length){
    for (let i=0; i<length; i++){
        let body = document.getElementsByTagName('tbody')[1];
        let row = document.createElement('tr');

        for(let j=0; j<8; j++){
            let cell = document.createElement('td')
            cell.dataset.residents = residentInfo[j]
            row.appendChild(cell);
        }

        row.setAttribute('class', 'residents content');
        row.setAttribute('id', `id${i}`)
        body.appendChild(row);
    }
}

//populating the table with residents info
function getResidentsInfo(planet_residents){

    planet_residents.forEach(myFunction);
  
    function myFunction(url, index){
        fetch(url)
        .then((response) => response.json())
        .then((resident) => {
            document.querySelectorAll('[data-residents~="name"]')[index].innerHTML = resident.name
            document.querySelectorAll('[data-residents~="height"]')[index].innerHTML = resident.height
            document.querySelectorAll('[data-residents~="mass"]')[index].innerHTML = resident.mass
            document.querySelectorAll('[data-residents~="hair_color"]')[index].innerHTML = resident.hair_color
            document.querySelectorAll('[data-residents~="skin_color"]')[index].innerHTML = resident.skin_color
            document.querySelectorAll('[data-residents~="eye_color"]')[index].innerHTML = resident.eye_color
            document.querySelectorAll('[data-residents~="birth_year"]')[index].innerHTML = resident.birth_year
            document.querySelectorAll('[data-residents~="gender"]')[index].innerHTML = resident.gender
        })
  }
  }


//clear table when closing the modal
function clearTable(){
    let closeModalButton = document.querySelectorAll('[data-dismiss~="modal"]')[0];
    closeModalButton.addEventListener('click', function(){
        document.getElementsByTagName('tbody')[1].innerHTML = ""
    })
    
}

// with click event we give the next url to the populateList() function
function nextPrevious(){
    document.getElementsByTagName('button')[0].addEventListener('click', function(){
        populateList(nextData)
    })
    document.getElementsByTagName('button')[1].addEventListener('click', function(){
        populateList(previousData)
    })
}


// populate table. initial with the first ten planets, after with click event we switch to next page
async function populateList(url='https://swapi.dev/api/planets/'){
    const res = await fetch(url);
    const data = await res.json();
    const initialData = data.results // list with 10 dictionaries (planets)

    nextData = data.next
    previousData = data.prevoius

    initialData.forEach(myFunction);
    function myFunction(item, index){
        document.getElementById(index+1).getElementsByTagName('td')[0].innerHTML = initialData[index].name
        document.getElementById(index+1).getElementsByTagName('td')[1].innerHTML = initialData[index].diameter + " km"
        document.getElementById(index+1).getElementsByTagName('td')[2].innerHTML = initialData[index].climate
        document.getElementById(index+1).getElementsByTagName('td')[3].innerHTML = initialData[index].terrain
        if (initialData[index].surface_water === 'unknown'){
            document.getElementById(index+1).getElementsByTagName('td')[4].innerHTML = initialData[index].surface_water
        } else {
            document.getElementById(index+1).getElementsByTagName('td')[4].innerHTML = initialData[index].surface_water + " %"
        }
        document.getElementById(index+1).getElementsByTagName('td')[5].innerHTML = initialData[index].population + " people"
        if (initialData[index].residents.length === 0) {
            document.getElementById(index+1).getElementsByTagName('td')[6].innerHTML = "No known residents"
        } else if (initialData[index].residents.length >= 1) {
            let button = document.createElement('button');
            button.innerHTML = initialData[index].residents.length + " resident";
            
            button.addEventListener('click', function(){
                
                document.getElementsByClassName('modal-residents')[0].innerHTML = "Residents of " + initialData[index].name;
                buildResidentsTable(initialData[index].residents.length);
                getResidentsInfo(initialData[index].residents);
            })
            document.getElementById(index+1).getElementsByTagName('td')[6].innerHTML = "";
            document.getElementById(index+1).getElementsByTagName('td')[6].appendChild(button);
            residentsInfo();
        }

    }
}

// // if user is connected : create a new column and append it to the thead

function voteButton(){
    let createColumn = document.createElement('th')
    createColumn.setAttribute("scope", "col")
    let tableHead = document.querySelector('tr');
    tableHead.appendChild(createColumn);
    
    // let voteCell = document.createElement('td');
    
    for(let i=1; i<11; i++){
        let voteCell = document.createElement('td');
        voteCell.dataset.vote_id = i
        document.getElementsByTagName("tr")[i].appendChild(voteCell);
        let btn = document.createElement('button');
        btn.innerHTML = "Vote"
        btn.dataset.button_id = i
        document.querySelectorAll(`[data-vote_id~="${i}"]`)[0].appendChild(btn);
    }

    document.querySelectorAll('[data-button_id~="1"]')[0].removeAttribute("data-target");
    document.querySelectorAll('[data-button_id~="1"]')[0].removeAttribute("data-toggle");
}



function voteClick(){
    for(let i=1; i<11; i++){
        document.querySelectorAll(`[data-button_id~="${i}"]`)[0].addEventListener('click', function(){
            document.querySelectorAll(`[data-button_id~="${i}"]`)[0].removeAttribute("data-target");
            document.querySelectorAll(`[data-button_id~="${i}"]`)[0].setAttribute("data-target", ".bd-example-modal-sm")
            let planetName = document.getElementById(i).getElementsByTagName('td')[0].innerHTML
            document.getElementsByTagName('h5')[0].innerHTML = `Voted on planet ${planetName} successfully`
           
        })
    }
}


