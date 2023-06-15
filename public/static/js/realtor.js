const email = document.getElementById("email")
const name = document.getElementById("name")
const phone = document.getElementById("phone")
const changePasswordButton = document.getElementById("changePasswordButton")
const authToken = localStorage.getItem('auth');
const realtorId = localStorage.getItem("realtorId")
const saveButton = document.getElementById("saveButton")
const savePasswordBtn = document.getElementById("savePasswordBtn")
const passwordForm = document.getElementById("changePasswordForm")
let passwordString

function updateContent() {
    document.getElementById("footer").textContent = i18next.t("footer")
    document.getElementById("logoutButton").textContent = i18next.t("header_logout")
    document.getElementById("textRealtors").textContent =i18next.t("header_realtors")
    document.getElementById("textCabinet").textContent = i18next.t("header_cabinet")
    document.getElementById("textSubscription").textContent = i18next.t("header_subscription")
    document.getElementById("title").textContent = i18next.t("editing_realtor")
    document.getElementById("textEmail").textContent = i18next.t("email")
    document.getElementById("textName").textContent = i18next.t("name")
    document.getElementById("textPhone").textContent = i18next.t("phone")
    document.getElementById("saveButton").textContent = i18next.t("save")
    document.getElementById("textOldPassword").textContent = i18next.t("old_password")
    document.getElementById("textNewPassword").textContent = i18next.t("new_password")
    document.getElementById("textRepeatPassword").textContent = i18next.t("repeat_password")
    document.getElementById("changePasswordButton").textContent = i18next.t("change_password")
    document.getElementById("savePasswordBtn").textContent = i18next.t("save")
    document.getElementById("textChangePassword").textContent = i18next.t("change_password_title")
}
const language = localStorage.getItem("selectedLanguage") === null ? 'uk' : localStorage.getItem("selectedLanguage")

document.addEventListener("DOMContentLoaded", function () {

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

    const realtorId = localStorage.getItem("realtorId")
    fetch("http://127.0.0.1:8088/companies/realtors/" + realtorId, {
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
        email.value = data.email
        name.value = data.name
        phone.value = data.phone
        passwordString = data.password
    })

        .catch(function (error) {
            Swal.fire({
                icon: 'error', title: i18next.t('get_info_failure')
            });
        });
});

saveButton.addEventListener("click", function (event) {
    event.preventDefault()
    fetch("http://127.0.0.1:8088/companies/realtors/" + realtorId, {
        headers: {
            "Content-Type": "application/json", "Authorization": authToken
        }, method: "PUT", body: JSON.stringify({
            email: email.value, phone: phone.value, name: name.value
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

changePasswordButton.addEventListener("click", function (event) {
    event.preventDefault()
    passwordForm.style.display = 'block'
});

savePasswordBtn.addEventListener("click", function (event) {
    event.preventDefault()
    const oldPassword = document.getElementById("oldPassword")
    const newPassword = document.getElementById("newPassword")
    const confirmNewPassword = document.getElementById("confirmNewPassword")
    if (newPassword.value !== confirmNewPassword.value) {
        Swal.fire({
            icon: 'error', title: i18next.t("repeat_password_failure")

        });
        return;
    }
    if (passwordString !== oldPassword.value) {
        Swal.fire({
            icon: 'error', title: i18next.t('invalid_old_password')
        });
        return;
    }
    fetch("http://127.0.0.1:8088/companies/realtors/" + realtorId, {
        headers: {
            "Content-Type": "application/json", "Authorization": authToken
        }, method: "PUT", body: JSON.stringify({
            password: newPassword.value
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
            icon: 'success', title: i18next.t('change_password_success'), showConfirmButton: false, timer: 1500
        })
        passwordForm.style.display = 'none'
    })

        .catch(function (error) {
            Swal.fire({
                icon: 'error', title: i18next.t('save_failure')
            });
        });
});