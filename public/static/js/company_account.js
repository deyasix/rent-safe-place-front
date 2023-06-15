let password = ''
const deleteAccountBtn = document.getElementById("deleteAccountBtn")

function updateContent() {
    document.getElementById("footer").textContent = i18next.t("footer")
    document.getElementById("logoutButton").textContent = i18next.t("header_logout")
    document.getElementById("textRealtors").textContent =i18next.t("header_realtors")
    document.getElementById("textCabinet").textContent = i18next.t("header_cabinet")
    document.getElementById("textSubscription").textContent = i18next.t("header_subscription")
    document.getElementById("textTitle").textContent = i18next.t("company_account_title")
    document.getElementById("title").textContent = i18next.t("company_account_title")
    document.getElementById("textEmail").textContent = i18next.t("email")
    document.getElementById("textName").textContent = i18next.t("name")
    document.getElementById("changePasswordBtn").textContent = i18next.t("change_password")
    document.getElementById("textSave").textContent = i18next.t("save")
    document.getElementById("deleteAccountBtn").textContent = i18next.t("delete_account")
    document.getElementById("textChangePassword").textContent = i18next.t("change_password_title")
    document.getElementById("savePasswordBtn").textContent = i18next.t("save")
    document.getElementById("textOldPassword").textContent = i18next.t("old_password")
    document.getElementById("textNewPassword").textContent = i18next.t("new_password")
    document.getElementById("textRepeatPassword").textContent = i18next.t("repeat_password")
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

    const emailInput = document.getElementById("email");
    const nameInput = document.getElementById("name");
    const editForm = document.getElementById("editForm");
    const changePasswordBtn = document.getElementById("changePasswordBtn");
    const changePasswordForm = document.getElementById("changePasswordForm");
    const savePasswordBtn = document.getElementById("savePasswordBtn");
    const authToken = localStorage.getItem('auth');
    fetch("http://127.0.0.1:8088/companies/info", {
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
            const companyData = {
                email: data.email,
                name: data.name,
                password: data.password
            };

            emailInput.value = companyData.email;
            nameInput.value = companyData.name;
            password = companyData.password
        })
        .catch(function(error) {
            Swal.fire({
                icon: 'error',
                title: i18next.t('get_info_failure')
            });
        });

    editForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const newEmail = emailInput.value;
        const newName = nameInput.value;

        const data = {email: newEmail, name: newName}
        fetch("http://127.0.0.1:8088/companies/info", {
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
                title: 'Помилка',
                text: i18next.t('repeat_password_failure')
            });
            return;
        }

        if (oldPassword !== password) {
            Swal.fire({
                icon: 'error',
                title: 'Помилка',
                text: i18next.t('inavlid_old_password')
            });
            return;
        }

        const data = {password: newPassword};
        fetch("http://127.0.0.1:8088/companies/info", {
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

deleteAccountBtn.addEventListener("click", function (event) {
    event.preventDefault()
    Swal.fire({
        title: i18next.t('delete_account_approve'),
        showCloseButton: true,
        focusConfirm: false,
        showDenyButton: true,
        confirmButtonText: i18next.t('yes'),
        denyButtonText : i18next.t('no')
    }).then((result) => {
        if (result.isConfirmed) {
            const authToken = localStorage.getItem("auth")
            fetch("http://127.0.0.1:8088/companies/info", {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authToken
                }
            })
                .then(function(response) {
                    if (response.ok) {
                        localStorage.removeItem("auth")
                        window.location.href = "index.html"
                    } else {
                        throw new Error();
                    }
                })
                .catch(function(error) {
                    Swal.fire({
                        icon: 'error',
                        title: i18next.t('delete_account_approve')
                    });
                });
        }
    })
});