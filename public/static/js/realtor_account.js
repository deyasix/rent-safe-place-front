import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js';
let password = ''

const fileInput = document.getElementById('imageSrc');
const emailInput = document.getElementById("email");

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

fileInput.addEventListener('change', function(event) {
    event.preventDefault()
    const file = event.target.files[0];
    const storageRef = ref(storage, 'images');
    const imageRef = ref(storageRef, 'realtor' + emailInput.value);
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

function updateContent() {
    document.getElementById("footer").textContent = i18next.t("footer")
    document.getElementById("logoutButton").textContent = i18next.t("header_logout")
    document.getElementById("textBuildings").textContent =i18next.t("header_buildings")
    document.getElementById("textCabinet").textContent = i18next.t("header_cabinet")
    document.getElementById("textTitle").textContent = i18next.t("realtor_account_title")
    document.getElementById("title").textContent = i18next.t("realtor_account_title")
    document.getElementById("textEmail").textContent = i18next.t("email")
    document.getElementById("textName").textContent = i18next.t("name")
    document.getElementById("textPhone").textContent = i18next.t("phone")
    document.getElementById("saveButton").textContent = i18next.t("save")
    document.getElementById("changePasswordBtn").textContent = i18next.t("change_password")
    document.getElementById("changePasswordTitle").textContent = i18next.t("change_password_title")
    document.getElementById("savePasswordBtn").textContent = i18next.t("save")
    document.getElementById("textCompanyEmail").textContent = i18next.t("email")
    document.getElementById("textImage").textContent = i18next.t("image")
    document.getElementById("textCompanyName").textContent = i18next.t("name_title")
    document.getElementById("textOldPassword").textContent = i18next.t("old_password")
    document.getElementById("textNewPassword").textContent = i18next.t("new_password")
    document.getElementById("textRepeatPassword").textContent = i18next.t("repeat_password")
    document.getElementById("textCompany").textContent = i18next.t("your_company")
}
const language = localStorage.getItem("selectedLanguage") === null ? 'uk' : localStorage.getItem("selectedLanguage")

document.addEventListener("DOMContentLoaded", function() {

    i18next.init({
        lng: language,
        resources: {
            en: {
                translation: {}
            },
            uk: {
                translation: {}
            }
        }
    }, function (err, t) {
        updateContent();
    });

    const toggleSwitch = document.getElementById('toggleSwitch');
    toggleSwitch.checked = language !== 'uk';
    toggleSwitch.addEventListener('change', function() {
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
    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const editForm = document.getElementById("editForm");
    const changePasswordBtn = document.getElementById("changePasswordBtn");
    const changePasswordForm = document.getElementById("changePasswordForm");
    const savePasswordBtn = document.getElementById("savePasswordBtn");
    const companyName = document.getElementById("companyName")
    const companyEmail = document.getElementById("companyEmail")
    const image = document.getElementById("image")
    const authToken = localStorage.getItem('auth');

    fetch("http://127.0.0.1:8088/realtors/info", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": authToken
        }
    })
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error();
            }
        })
        .then(function(data) {
            const realtorData = {
                email: data.email,
                name: data.name,
                password: data.password,
                phone: data.phone,
                company: {
                    name: data.company.name,
                    email: data.company.email
                }
            };
            emailInput.value = realtorData.email;
            nameInput.value = realtorData.name;
            phoneInput.value = realtorData.phone
            password = realtorData.password
            companyEmail.textContent = realtorData.company.email
            companyName.textContent = realtorData.company.name
            image.src = data.photo === "" || data.photo === null ? "https://firebasestorage.googleapis.com/v0/b/rent-safe-place.appspot.com/o/images%2Fno-user-image-icon-27.jpg?alt=media&token=4de8c976-97da-4fa4-8799-96ae82c20803&_gl=1*10ehvyr*_ga*MTk0NjM2ODY5Ni4xNjg2NjExMzYz*_ga_CW55HF8NVT*MTY4NjYzMjU5MC4zLjEuMTY4NjYzMjYwMi4wLjAuMA.." : data.photo
        })
        .catch(function(error) {
            Swal.fire({
                icon: 'error',
                title: i18next.t("get_info_failure")
            });
        });

    editForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const newEmail = emailInput.value;
        const newName = nameInput.value;
        const newPhone = phoneInput.value;
        const newPhoto = fileInput.files[0] !== null ? image.src : null
        const data = {email: newEmail, name: newName, phone: newPhone, photo: newPhoto}
        fetch("http://127.0.0.1:8088/realtors/info", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": authToken
            },
            body: JSON.stringify(data)
        })
            .then(function(response) {
                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: i18next.t('save_success'),
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    throw new Error();
                }
            })
            .catch(function(error) {
                Swal.fire({
                    icon: 'error',
                    title: i18next.t('save_failure')
                });
            });
    });
    changePasswordBtn.addEventListener("click", function(event) {
        event.preventDefault();
        changePasswordForm.style.display = "block";
    });
    savePasswordBtn.addEventListener("click", function(event) {
        event.preventDefault();
        const oldPasswordInput = document.getElementById("oldPassword");
        const newPasswordInput = document.getElementById("newPassword");
        const confirmPasswordInput = document.getElementById("confirmNewPassword");
        const oldPassword = oldPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: i18next.t('repeat-password_failure')
            });
            return;
        }

        if (oldPassword !== password) {
            Swal.fire({
                icon: 'error',
                title: i18next.t('invalid_old_password')
            });
            return;
        }

        const data = {password: newPassword};
        fetch("http://127.0.0.1:8088/realtors/info", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": authToken
            },
            body: JSON.stringify(data)
        })
            .then(function(response) {
                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: i18next.t('change_password_success'),
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    throw new Error();
                }
            })
            .catch(function(error) {
                Swal.fire({
                    icon: 'error',
                    title: i18next.t('save_failure')
                });
            });
        changePasswordForm.style.display = "none";
        oldPasswordInput.value = "";
        newPasswordInput.value = "";
        confirmPasswordInput.value = "";
    });
});
