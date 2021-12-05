// LEAFLET CONF
let routingControl;
let mymap;


let concesionarias = [];
let renderCards = [];
let numOfChilds = 3;
let userCoords;
let concesionariaMarkers = [];
let userMarker;

// Init Map
initMap = () => {
    let southWest = L.latLng(21.036307, -101.8),
        northEast = L.latLng(21.227214, -101.551241),
        bounds = L.latLngBounds(southWest, northEast);

    mymap = L.map("map", {
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,
        minZoom: 13
    }).setView(
        [21.152364203854884, -101.71115227036523],
        14
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mymap);
}

// Get Concessionaire Records
getConcesionarias = async () => {
    initMap();
    let snapshot = await firebase.firestore().collection("Concesionarias").get();
    snapshot.forEach((doc) => {
        concesionarias.push({
            id: doc.id,
            Nombre: doc.data().Nombre,
            Direccion: doc.data().Direccion,
            Imagen: doc.data().Imagen,
            Latitud: doc.data().Latitud,
            Longitud: doc.data().Longitud,
            Contacto: doc.data().Contacto,
            Logo: doc.data().Logo
        });
    });
    console.log(concesionarias);
    fillRenderCards();
    fillList();
    fillMapMarkers();
    getCurrentLocation()
        .then(position => {
            this.getUserCoordinates(position);
            let group = new L.featureGroup([userMarker, ...concesionariaMarkers]);
            mymap.fitBounds(group.getBounds());
        })
        .catch(error => console.log(error));
}

// Get User Location
getCurrentLocation = () => {
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
    });
}

// Fill User Data: Put User Marker and Put Address in Screen
getUserCoordinates = (position) => {
    userCoords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }

    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${userCoords.latitude}&lon=${userCoords.longitude}`)
        .then(response => response.json())
        .then(data => document.getElementById('txtAddress').value = data.display_name)

    let greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    let greenMarker = L.marker([userCoords.latitude, userCoords.longitude], {
        icon: greenIcon
    }).addTo(mymap);

    greenMarker.bindPopup('<h6>Usted está aquí</h6>');
    userMarker = greenMarker;

    mymap.setView(L.latLng(userCoords.latitude, userCoords.longitude))
}

//Map Markers
fillMapMarkers = () => {
    concesionarias.forEach((e, i) => {
        let marker = L.marker([e.Latitud, e.Longitud]).addTo(mymap);
        marker.bindPopup('<h5><strong>' + e.Nombre + '</strong></h5><img src="' + e.Imagen + '" class="img-fluid""><div class="row mt-2">' +
        '<div class="col-6">' +
        '<button title="Ver Detalles" onclick="goDetails(' + i + ')" class="btn btn-primary" style="width: 100%;">' +
        '<i class="fas fa-car"></i></button></div>' +
        '<div class="col-6">' +
        '<button title="Trazar Ruta" onclick="traceRoute(' + e.Latitud + ',' + e.Longitud + ',' + i + ')" class="btn btn-primary" style="width: 100%;">' +
        '<i class="fas fa-map-marked-alt"></i></i></button>');
        
        concesionariaMarkers.push(marker);
    });
}

fillRenderCards = () => {
    concesionarias.forEach((e, i) => {
        renderCards.push(
            '<div class="col-12 col-md-6 col-lg-4">' +
            '<div class="card mb-3" onclick="focusMarker(' + e.Latitud + ', ' + e.Longitud + ', ' + i + ')">' +
            '<img src="' + e.Imagen + '" class="card-img-top" alt="..." style="height: 200px; object-fit: cover;">' +
            '<div class="card-body">' +
            '<h5 class="card-title">' + e.Nombre + '</h5>' +
            '<p class="card-text" id="idP3">' +
            '<strong>Horario: </strong>' + e.Contacto.Horario + '<br>' +
            '<strong>Página web: </strong><a href="' + e.Contacto.PaginaWeb + '">' + e.Contacto.PaginaWeb + '</a><br>' +
            '<strong>Teléfono: </strong>' + e.Contacto.Telefono +
            '</p>' +
            '<a onclick="goDetails(' + i + ')" class="btn btn-primary">Ver Detalles</a>' +
            '</div>' +
            '</div>' +
            '</div>'
        );
    })
}

// Fill Carousel with the Cards
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
                counter++;
            }
        } else {
            finalRender += renderCards[counter];
        }

        finalRender += '</div></div></div>';
    }
    $("#CardContainer").append(finalRender);
}

focusMarker = (lat, lng, index) => {
    mymap.setView([lat, lng]);
concesionariaMarkers[index].openPopup();
}

// Create Route
traceRoute = async (lat, lng, index) => {
    let allowed = true;
    if (userCoords == null) {
        await getCurrentLocation()
            .then(position => {
                this.getUserCoordinates(position);
            })
            .catch(error => {
                var myAlert = document.getElementById('liveToast'); //select id of toast
                var bsAlert = new bootstrap.Toast(myAlert); //inizialize it
                bsAlert.show(); //show it
                allowed = false;
            });
    }

    if (allowed) {
        if (routingControl != null) {
            mymap.removeControl(routingControl);
            routingControl = null;
        }

        routingControl = L.Routing.control({
            waypoints: [
                L.latLng(userCoords.latitude, userCoords.longitude),
                L.latLng(lat, lng)
            ],
            createMarker: function () {
                return null;
            }
        }).addTo(mymap);

        let group = new L.featureGroup([userMarker, concesionariaMarkers[index]]);
        mymap.fitBounds(group.getBounds());

        mymap.closePopup();
    }
}

goDetails = (i) => {
    data = {
        id: concesionarias[i].id,
        Nombre: concesionarias[i].Nombre,
        Contacto: concesionarias[i].Contacto,
        Logo: concesionarias[i].Logo
    }

    localStorage.setItem("data", JSON.stringify(data));
    document.location.href = "./pages/concesionaria.html";
}

window.addEventListener("resize", function (event) {
    if ((window.innerWidth < 740 && numOfChilds != 1) || (window.innerWidth >= 740 && window.innerWidth < 1000 && numOfChilds != 2) || (window.innerWidth >= 1000 && numOfChilds != 3)) {
        fillList();
    }
});