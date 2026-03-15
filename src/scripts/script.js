

const inputPesos = document.querySelector("#pesos")
const selectMoneda = document.querySelector("#moneda")
const boton = document.querySelector("#convertir")
const resultado = document.querySelector("#resultado")
const error = document.querySelector("#error")
const contenedorGrafico = document.querySelector(".grafico")
let chart

boton.addEventListener("click", convertir)

async function convertir() {

    const pesos = inputPesos.value
    const moneda = selectMoneda.value

    error.innerHTML = ""

    try {

        const res = await fetch(`https://mindicador.cl/api/${moneda}`)
        const data = await res.json()

        const valorMoneda = data.serie[0].valor

        const conversion = pesos / valorMoneda

        resultado.innerHTML = `
        ${pesos} pesos = ${conversion.toFixed(2)} ${moneda}
        `
        contenedorGrafico.style.display = "block"
        generarGrafico(data.serie)

    } catch (err) {

        error.innerHTML = "Error al obtener los datos de la API"

    }
}


function generarGrafico(serie) {

    const ultimos10 = serie.slice(0, 10).reverse()

    const fechas = ultimos10.map(d => {
        return new Date(d.fecha).toLocaleDateString("es-CL")
    })

    const valores = ultimos10.map(d => d.valor)

    const config = {
        type: "line",
        data: {
            labels: fechas,
            datasets: [{
                label: "Historial últimos 10 días",
                data: valores
            }]
        }
    }

    const ctx = document.getElementById("grafico")

    if (chart) {
        chart.destroy()
    }

    chart = new Chart(ctx, config)
}