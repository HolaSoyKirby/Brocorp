let autos = [];
let selectedFirst = 0,
    selectedSecond = 1;

getAutos = async () => {
    const snapshot = await firebase.firestore().collection('Autos').doc('xhbxbetttLpnsRutk9sM').get();
    autos = snapshot.data().Autos;
    console.log(autos);
    autos.sort((a, b) => (a.Modelo > b.Modelo ? 1 : -1));
    renderList();
    renderCards();
}

renderList = () => {
    let lista = '';
    autos.forEach((e, index) => {
        lista +=
            '<div onclick="select(' + index + ')" class="list-group-item list-group-item-action list-group-item-light p-3 list-element">' +
            '<div class="row"><div class="col-9">' +
            '<h5>' + e.Modelo + '</h5></div>' +
            '<div class="col-3">' +
            '<div id="check' + index + '" class="check"></div></div></div></div>'
    });
    $("#listAutos").append(lista);

    for (let i = 2; i < autos.length; i++) {
        let setBg = document.getElementById(`check${i}`)
        setBg.style.backgroundImage = "none";
    }
}

renderCards = () => {
    for (let i = 0; i < 3; i++) {
        document.getElementById(`img${i}Carousel0`).src = autos[selectedFirst].Imagenes[i];
        document.getElementById(`img${i}Carousel1`).src = autos[selectedSecond].Imagenes[i];
    }

        document.getElementById(`txtModelo0`).innerHTML = autos[selectedFirst].Modelo;
        document.getElementById(`txtModelo1`).innerHTML = autos[selectedSecond].Modelo;

        document.getElementById(`txtPrecio0`).innerHTML = autos[selectedFirst].Precio;
        document.getElementById(`txtPrecio1`).innerHTML = autos[selectedSecond].Precio;
        
        document.getElementById(`txtMotor0`).innerHTML = autos[selectedFirst].Detalles.Motor.Motor;
        document.getElementById(`txtMotor1`).innerHTML = autos[selectedSecond].Detalles.Motor.Motor;

        document.getElementById(`txtHP0`).innerHTML = autos[selectedFirst].Detalles.Motor.HP;
        document.getElementById(`txtHP1`).innerHTML = autos[selectedSecond].Detalles.Motor.HP;

        document.getElementById(`txtTorque0`).innerHTML = autos[selectedFirst].Detalles.Motor.Torque;
        document.getElementById(`txtTorque1`).innerHTML = autos[selectedSecond].Detalles.Motor.Torque;

        document.getElementById(`txtTransmision0`).innerHTML = autos[selectedFirst].Detalles.Transmision.Transmision;
        document.getElementById(`txtTransmision1`).innerHTML = autos[selectedSecond].Detalles.Transmision.Transmision;

        document.getElementById(`txtVelocidades0`).innerHTML = autos[selectedFirst].Detalles.Transmision.Velocidades;
        document.getElementById(`txtVelocidades1`).innerHTML = autos[selectedSecond].Detalles.Transmision.Velocidades;

        if(autos[selectedFirst].Detalles.Consumo.Combustion){
            document.getElementById(`imgCombustion0`).src = '../img/fuel-icon.png';
        }else{
            document.getElementById(`imgCombustion0`).src = '../img/power-icon.png';
        }

        if(autos[selectedSecond].Detalles.Consumo.Combustion){
            document.getElementById(`imgCombustion1`).src = '../img/fuel-icon.png';
        }else{
            document.getElementById(`imgCombustion1`).src = '../img/power-icon.png';
        }

        document.getElementById(`txtConsumo0`).innerHTML = autos[selectedFirst].Detalles.Consumo.Consumo;
        document.getElementById(`txtConsumo1`).innerHTML = autos[selectedSecond].Detalles.Consumo.Consumo;
}

select = (i) => {
    if (selectedFirst != i && selectedSecond != i) {
        document.getElementById(`check${selectedFirst}`).style.backgroundImage = "none";
        selectedFirst = selectedSecond;
        selectedSecond = i;
        let setBg = document.getElementById(`check${selectedSecond}`);
        setBg.style.backgroundImage = "url(../img/star.png)";
        renderCards();
    }
}