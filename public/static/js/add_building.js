import {initializeApp} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
    getStorage, ref, uploadBytes, getDownloadURL
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js';
const image = document.getElementById("image")
const authToken = localStorage.getItem("auth")
const addButton = document.getElementById("addButton")
const fileInput = document.getElementById('imageSrc');
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
image.src = "https://firebasestorage.googleapis.com/v0/b/rent-safe-place.appspot.com/o/images%2Fistockphoto-887464786-612x612.jpg?alt=media&token=d621cee8-506f-493c-9294-1e755c3e09ca&_gl=1*95oq22*_ga*MTk0NjM2ODY5Ni4xNjg2NjExMzYz*_ga_CW55HF8NVT*MTY4NjYxOTA2Ny4yLjEuMTY4NjYyMTI4Ny4wLjAuMA.."
fileInput.addEventListener('change', function (event) {
    event.preventDefault()
    const file = event.target.files[0];
    const storageRef = ref(storage, 'images');
    const imageRef = ref(storageRef, 'building' + file.name);
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

addButton.addEventListener("click", function (event) {
    event.preventDefault()
    fetch("http://127.0.0.1:8088/realtors/buildings", {
        headers: {
            "Content-Type": "application/json", "Authorization": authToken
        }, method: "POST", body: JSON.stringify({
            name: document.getElementById("name").value,
            description: document.getElementById("description").value,
            type: document.getElementById("type").value,
            category: document.getElementById("category").value,
            price: document.getElementById("price").value,
            city: document.getElementById("city").value,
            address: document.getElementById("address").value,
            square: document.getElementById('area').value,
            isPetAllowed: document.getElementById('petsAllowed').checked,
            photo: image.src,
            isLeased: false
        })
    })
        .then(function (response) {
            if (response.ok) {
                Swal.fire({
                    icon: 'success', title: i18next.t('add_building_success'), showConfirmButton: false, timer: 1500
                }).then(() => {
                    window.location.href = "building_list.html"
                })

            } else {
                throw new Error();
            }
        })
        .catch(function (error) {
            Swal.fire({
                icon: 'error', title: i18next.t('add_building_failure')
            });
        });
});

function updateContent() {
    document.getElementById("title").textContent = i18next.t("add_building_title")
    document.getElementById("logoutButton").textContent = i18next.t("header_logout")
    document.getElementById("textBuildings").textContent = i18next.t("header_buildings")
    document.getElementById("textCabinet").textContent = i18next.t("header_cabinet")
    document.getElementById("textTitle").textContent = i18next.t("add_building_title")
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
    document.getElementById("addButton").textContent = i18next.t("add")
    document.getElementById("footer").textContent = i18next.t("footer")
}

const language = localStorage.getItem("selectedLanguage") === null ? 'uk' : localStorage.getItem("selectedLanguage")
document.addEventListener('DOMContentLoaded', function () {
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
});