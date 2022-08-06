const typeCurrency = document.querySelector("#currencyType");
let myChart;

renderCurrency();
//Conection to API
async function getCurrency() {
    const res = await fetch("https://mindicador.cl/api/");
    const currencyType = await res.json();
    return currencyType;
}

//Get currency from API
async function renderCurrency() {
    const currency = await getCurrency();
    let template = "";

    try {
        Object.keys(currency).forEach(curr => {
            if (currency[curr]['codigo'] != undefined) {
                template += `<option value="${currency[curr]['codigo']}">${currency[curr]['codigo']} </option>`
            }

        })
    } catch (e) {
        alert("Api not available")
    }

    typeCurrency.innerHTML = template;
}




document.querySelector("#search").onclick = async () => {
    var res = 0;
    const currency = await getCurrency();
    var selection = document.querySelector("#currencyType").value;
    var amount = document.querySelector("#clpInput").value
    var result = document.querySelector("#result")
    try {
        Object.keys(currency).forEach(curr => {
            if (currency[curr]['codigo'] == selection) {
                res = Number(amount) / Number(currency[curr]['valor'])

            }
        })
        result.innerHTML = res;
        createDataToChart(selection)
    } catch (e) {
        alert("API no disponible")
    }

}



async function createDataToChart(id) {
    const jsonURL = "https://mindicador.cl/api/" + id;
    const data = await fetch(jsonURL);
    const status = await data.json();
    var info = "";
    Object.keys(status).forEach(iterator => {
        info = status['serie']
    })

    var values = '';
    info.forEach(curr => {
        values += `${Number(curr['valor'])},`
    })
    var dates = [];
    info.forEach(curr => {
        dates += `${curr['fecha']},`
    })
    let valores = values.split(',');
    let fechas = dates.split(',');
    const ctx = document.getElementById('myChart').getContext('2d');
    if (myChart) {
        myChart.destroy();
    } else {
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: fechas,
                datasets: [{
                    label: 'Changes in time',
                    data: valores,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}



