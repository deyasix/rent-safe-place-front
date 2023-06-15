import {initializeApp} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
    getStorage, ref, uploadBytes, getDownloadURL
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js';

const image = document.getElementById("image")
const name = document.getElementById("name")
const description = document.getElementById("description")
const type = document.getElementById("type")
const category = document.getElementById("category")
const price = document.getElementById("price")
const city = document.getElementById("city")
const address = document.getElementById("address")
const isPetAllowed = document.getElementById('petsAllowed')
const square = document.getElementById('area')
const authToken = localStorage.getItem("auth")
const saveButton = document.getElementById("saveButton")
const buildingId = localStorage.getItem("buildingId")
const tenant = document.getElementById("tenant")
const fileInput = document.getElementById('imageSrc');
const noImage = "https://firebasestorage.googleapis.com/v0/b/rent-safe-place.appspot.com/o/images%2Fistockphoto-887464786-612x612.jpg?alt=media&token=d621cee8-506f-493c-9294-1e755c3e09ca&_gl=1*95oq22*_ga*MTk0NjM2ODY5Ni4xNjg2NjExMzYz*_ga_CW55HF8NVT*MTY4NjYxOTA2Ny4yLjEuMTY4NjYyMTI4Ny4wLjAuMA.."

const firebaseConfig = {
    apiKey: "AIzaSyAAO3Q0WnhGVeR5WQugtPavKdTu1LOlWXo",
    authDomain: "rent-safe-place.firebaseapp.com",
    projectId: "rent-safe-place",
    storageBucket: "rent-safe-place.appspot.com",
    messagingSenderId: "1097114450037",
    appId: "1:1097114450037:web:6dcd9813e5c3d46eece03c",
    measurementId: "G-8LBTCBRET6"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

fileInput.addEventListener('change', function (event) {
    event.preventDefault()
    const file = event.target.files[0];
    const storageRef = ref(storage, 'images');
    const imageRef = ref(storageRef, 'building' + buildingId);
    uploadBytes(imageRef, file)
        .then(snapshot => {
            getDownloadURL(snapshot.ref)
                .then(downloadURL => {
                    image.src = downloadURL
                })
                .catch(error => {
                    console.error('Помилка отримання посилання на зображення:', error);
                });
        })
        .catch(error => {
            console.error('Помилка завантаження зображення:', error);
        });
});

document.addEventListener("DOMContentLoaded", function () {
    const language = localStorage.getItem("selectedLanguage") === null ? 'uk' : localStorage.getItem("selectedLanguage")
    i18next.init({
        lng: language, resources: {
            en: {
                translation: {}
            }, uk: {
                translation: {}
            }
        }
    }, function (err, t) {
        updateContent();
    });

    const toggleSwitch = document.getElementById('toggleSwitch');
    toggleSwitch.checked = language !== 'uk';
    toggleSwitch.addEventListener('change', function () {
        const slider = this.nextElementSibling;
        let value;
        if (this.checked) {
            slider.setAttribute('data-text', 'EN');
            value = 'en'
        } else {
            slider.setAttribute('data-text', 'УКР');
            value = 'uk'
        }
        localStorage.setItem("selectedLanguage", value);
        i18next.changeLanguage(value, updateContent);
    });

    fetch('../../en.json')
        .then(response => response.json())
        .then(data => {
            i18next.addResourceBundle('en', 'translation', data);
            updateContent();
        });

    fetch('../../uk.json')
        .then(response => response.json())
        .then(data => {
            i18next.addResourceBundle('uk', 'translation', data);
            updateContent();
        });

    fetch("http://127.0.0.1:8088/realtors/buildings/" + buildingId, {
        headers: {
            "Content-Type": "application/json", "Authorization": authToken
        }
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error();
            }
        }).then(function (data) {
        name.value = data.name
        description.value = data.description
        type.value = data.type
        category.value = data.category
        price.value = data.price
        city.value = data.city
        address.value = data.address
        isPetAllowed.checked = data.isPetAllowed
        square.value = data.square
        image.src = data.photo === "" ? noImage : data.photo
        if (data.tenant !== null) tenant.value = data.tenant.id
    })

        .catch(function (error) {
            Swal.fire({
                icon: 'error', title: i18next.t('get_building_failure')
            });
        });
});

saveButton.addEventListener("click", function (event) {
    event.preventDefault()
    const tenantQ = tenant.value === "" ? null : {id: tenant.value}
    const photoQ = image.src === noImage ? null : image.src
    fetch("http://127.0.0.1:8088/realtors/buildings/" + buildingId, {
        headers: {
            "Content-Type": "application/json", "Authorization": authToken
        }, method: "PUT", body: JSON.stringify({
            name: name.value,
            description: description.value,
            type: type.value,
            category: category.value,
            price: price.value,
            city: city.value,
            address: address.value,
            square: square.value,
            isPetAllowed: isPetAllowed.checked,
            photo: photoQ,
            tenant: tenantQ
        })
    })
        .then(function (response) {
            if (response.ok) {
                return (response.json());
            } else {
                throw new Error();
            }
        }).then(function (data) {
        Swal.fire({
            icon: 'success', title: i18next.t('save_success'), showConfirmButton: false, timer: 1500
        })
    })

        .catch(function (error) {
            Swal.fire({
                icon: 'error', title: i18next.t('save_failure')
            });
        });
});

function updateContent() {
    document.getElementById("title").textContent = i18next.t("building_title")
    document.getElementById("logoutButton").textContent = i18next.t("header_logout")
    document.getElementById("textBuildings").textContent = i18next.t("header_buildings")
    document.getElementById("textCabinet").textContent = i18next.t("header_cabinet")
    document.getElementById("textTitle").textContent = i18next.t("building_title")
    document.getElementById("textImage").textContent = i18next.t("image")
    document.getElementById("textName").textContent = i18next.t("name_title")
    document.getElementById("textDescription").textContent = i18next.t("description")
    document.getElementById("textType").textContent = i18next.t("type")
    document.getElementById("textCategory").textContent = i18next.t("category")
    document.getElementById("textPrice").textContent = i18next.t("price")
    document.getElementById("textCity").textContent = i18next.t("city")
    document.getElementById("textAddress").textContent = i18next.t("address")
    document.getElementById("textPets").textContent = i18next.t("pets_allowed")
    document.getElementById("textArea").textContent = i18next.t("area")
    document.getElementById("saveButton").textContent = i18next.t("save")
    document.getElementById("textTenant").textContent = i18next.t("tenant")
    document.getElementById("footer").textContent = i18next.t("footer")
}
