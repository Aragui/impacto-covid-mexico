const body = document.querySelector('#body');
const controls = document.querySelectorAll('input.radio');

controls.forEach(control => control.addEventListener('change', e => {
    if(e.target.checked){
        drawRegionsMap(e.target.id);
    }
}))

google.charts.load('upcoming', {
    'packages': ['geochart']
});

google.charts.setOnLoadCallback(drawRegionsMap);

async function drawRegionsMap(file='may2020') {
    const res = await fetch(`./data/${file}.json`);
    const json = await res.json();
    const table = [[
        'Estado',
        'Casos'
    ]]
    body.innerHTML = "";
    json.sort((a,b) => b[1]-a[1]).forEach(row => {
        body.appendChild(createRow(row));
        table.push([`${row[0]}`, parseInt(row[1])]);
    });

    var data = google.visualization.arrayToDataTable(table);

    var options = {
        region: 'MX', // Mexico
        resolution: 'provinces',
        colorAxis: {
            values: colors(file),
            colors: ['green', 'yellow', 'orange', 'red']
        },
        backgroundColor: '#81d4fa',
        datalessRegionColor: '#eeeeee',
        defaultColor: '#f5f5f5',
    };

    var chart = new google.visualization.GeoChart(document.getElementById('map'));
    chart.draw(data, options);
};

function createRow(row){
    const tr = document.createElement('tr');
    const state = document.createElement('td');
    const number = document.createElement('td');

    state.innerText = row[0];
    number.innerText = row[1];

    tr.appendChild(state);
    tr.appendChild(number);

    return tr;
}

function colors(name){
    switch(name){
        case 'may2020':
            return [100, 200, 400, 600];
        case 'dic2020':
            return [8000, 20000, 40000, 65000];
        case 'may2021':
            return [8000, 16000, 35000, 65000];
    }
}