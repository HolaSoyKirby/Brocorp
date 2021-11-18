// LEAFLET CONF
var southWest = L.latLng(21.036307, -101.8),
    northEast = L.latLng(21.227214, -101.551241),
    bounds = L.latLngBounds(southWest, northEast);

var mymap = L.map("map", {
    maxBounds: bounds,
    maxBoundsViscosity: 1.0,
    minZoom: 13
}).setView(
    [21.152364203854884, -101.71115227036523],
    16
);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(mymap);

let concesionarias = [];
let renderCards = [];
let numOfChilds = 3;

getConcesionarias = async () => {
    let snapshot = await firebase.firestore().collection("Concesionarias").get();
    snapshot.forEach((doc) => {
        concesionarias.push({
            id: doc.id,
            Nombre: doc.data().Nombre,
            Direccion: doc.data().Direccion,
            Imagen: doc.data().Imagen,
            Latitud: doc.data().Latitud,
            Longitud: doc.data().Longitud,
            Contacto: doc.data().Contacto
        });
    });
    console.log(concesionarias);
    fillRenderCards();
    fillList();
    fillMapMarkers();
}

fillMapMarkers = () => {
    concesionarias.forEach(e => {
        let marker = L.marker([e.Latitud, e.Longitud]).addTo(mymap);
        marker.bindPopup('<img src="' + e.Imagen + '" style="height: 80px; object-fit: cover; align-content: center;"><h6>' + e.Nombre + '</h6><btn onclick="goDetails(' + e.id + ')" class="btn btn-primary">Ver Detalles</btn>')
    });
}

fillRenderCards = () => {
    concesionarias.forEach(e => {
        renderCards.push(
            '<div class="col-12 col-md-6 col-lg-4">' +
            '<div class="card mb-3">' +
            '<img src="' + e.Imagen + '" class="card-img-top" alt="..." style="height: 200px; object-fit: cover;">' +
            '<div class="card-body">' +
            '<h5 class="card-title">' + e.Nombre + '</h5>' +
            '<p class="card-text" id="idP3">' +
            'Horario: ' + e.Contacto.Horario + '<br>' +
            'Página web: <a href="' + e.Contacto.PaginaWeb + '">' + e.Contacto.PaginaWeb + '</a><br>' +
            'Teléfono: ' + e.Contacto.Telefono +
            '</p>' +
            '<a onclick="goDetails(' + e.id + ')" class="btn btn-primary">Ver Detalles</a>' +
            '</div>' +
            '</div>' +
            '</div>'
        );
    })
}

fillList = () => {
    $("#CardContainer").empty();
    console.log(window.innerWidth);
    if (window.innerWidth < 740) {
        numOfChilds = 1;
    } else if (window.innerWidth >= 740 && window.innerWidth < 1000) {
        numOfChilds = 2;
    } else {
        numOfChilds = 3;
    }

    let counter = 0;
    let finalRender = '<div class="carousel-item active"><div class="container"><div class="row">';

    for (counter; counter < numOfChilds; counter++) {
        finalRender += renderCards[counter]
    }

    console.log('Counter' + counter);

    finalRender += '</div></div></div>';

    for (counter; counter < renderCards.length; counter++) {
        finalRender +=
            '<div class="carousel-item"><div class="container"><div class="row">';

        if (numOfChilds > 1) {
            let innerCounter = 0;
            for (innerCounter; innerCounter < numOfChilds; innerCounter++) {
                if (counter >= renderCards.length)
                    break;
                finalRender += renderCards[counter];
                counter ++;
            }
        } else {
            finalRender += renderCards[counter];
        }

        finalRender += '</div></div></div>';
    }
    $("#CardContainer").append(finalRender);
}

window.addEventListener("resize", function (event) {
    console.log(window.innerWidth);
    if ((window.innerWidth < 740 && numOfChilds != 1) || (window.innerWidth >= 740 && window.innerWidth < 1000 && numOfChilds != 2) || (window.innerWidth >= 1000 && numOfChilds != 3)) {
        fillList();
    }
})