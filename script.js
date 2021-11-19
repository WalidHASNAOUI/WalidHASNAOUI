// -- 
let chartObj =  { 
    // layout type
    type: 'line',

    data: {
        // labeles ::> axe(x) values <array>
        labels: [],
        datasets: [{
            label: 'Confirmed',
            data: [],
            pointRadius: 1,
            borderDash: [55,0],
            borderColor: 'rgba(255, 99, 132, 1)',
            tension:0.5,
            backgroundColor:'rgba(255, 99, 132, 0.5)'

        },
        {
            label: 'Deaths',
            data: [],
            pointRadius: 1,
            borderDash: [55,0],
            borderColor: 'rgba(75, 192, 192, 0.5)',
            backgroundColor:'rgba(75, 192, 192, 0.5)'
        },
        {
            label: 'Recovered',
            data: [],
            pointRadius: 1,
            borderDash: [55,0],
            borderColor: 'rgba(54, 162, 235, 0.5)',
            backgroundColor:'rgba(54, 162, 235, 0.5)'
        },
        {
            label: 'Active',
            data: [],
            pointRadius: 1,
            borderDash: [55,0],
            borderColor: 'rgba(255, 159, 64, 0.5)',
            backgroundColor:'rgba(255, 159, 64, 0.5)'

        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
};
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx,chartObj);

let xjs = new XMLHttpRequest();
let arrCountry = [];
let arrCountryCaseDay = [];

//  --- set all countries into aside --
xjs.open("GET","https://api.covid19api.com/countries");
xjs.onreadystatechange = ()=>{
    if((xjs.readyState == 4) && (xjs.status == 200))
        arrCountry = JSON.parse(xjs.response);
    appendCountries();
}

xjs.send();


// -- set all Countries into aside element --
function appendCountries()
{
    let division;
    let txtNode;

    let arrCountrySorted = arrCountry.map(e=>e.Country).sort();
    
    for(let e of arrCountrySorted)
    {
        division = document.createElement("div");
        division.setAttribute("onclick", "divListener(this)");
        txtNode = document.createTextNode(e);
        division.appendChild(txtNode);
        document.getElementsByTagName("aside")[0].appendChild(division);
    }
}

// --> get country then return its slug <---
function itsSlug(ctr)
{
    for(let e of arrCountry)
    {
        if(e.Country == ctr)
            return e.ISO2;
    }
}

// --> add new labels <--
function addLabels()
{
    for(let e of arrCountryCaseDay)
        chartObj.data.labels.push((e.Date+'').substring(0,10));

    myChart.update();
}

function dropLabels()
{
    for(let e of arrCountryCaseDay)
        chartObj.data.labels.pop();
    myChart.update();
}

// --> add new data <--
function addData()
{
    for(let e of arrCountryCaseDay)
    {
        chartObj.data.datasets[0].data.push(e.Confirmed);
        chartObj.data.datasets[1].data.push(e.Deaths);
        chartObj.data.datasets[2].data.push(e.Recovered);
        chartObj.data.datasets[3].data.push(e.Active);
    }
    myChart.update();
}

// --> drop the lasted data <--
function dropData()
{
    for(let i=0 ; i<arrCountryCaseDay.length ; ++i)
    {
        chartObj.data.datasets[0].data.pop();
        chartObj.data.datasets[1].data.pop();
        chartObj.data.datasets[2].data.pop();
        chartObj.data.datasets[3].data.pop();
    }
    myChart.update();
}

// --- add Listener ---
function divListener(element)
{
    document.querySelector("#mainTitle").innerHTML = element.innerHTML;
    let xjs2 = new XMLHttpRequest();
    xjs2.open("GET","https://api.covid19api.com/total/dayone/country/" + itsSlug(element.innerHTML));
    xjs2.onreadystatechange = ()=>{
        if((xjs2.readyState == 4) && (xjs2.status == 200))
        {
            arrCountryCaseDay = JSON.parse(xjs2.response);
            dropLabels();
            dropData();
            addLabels();
            addData();
        }
    };
    xjs2.send();
}
