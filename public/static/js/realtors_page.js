const addRealtorButton = document.getElementById("addRealtorButton");
const realtorsList = document.getElementById("realtorsList");

function createRealtorElement(realtor) {
    const listItem = document.createElement("li");
    listItem.textContent = realtor.name;
    listItem.addEventListener("click", function () {
        showRealtorInfo(realtor);
    });
    return listItem;
}

function showRealtorInfo(realtor) {
    Swal.fire({
        title: 'Realtor Info',
        html:
            '<div class="realtor-info">\n' +
            '    <h1 class="realtor-name">' + i18next.t('name') + " " + realtor.name + '</h1>\n' +
            '    <p class="realtor-email">'+ i18next.t('email') + " " + realtor.email + '</p>\n' +
            '    <p class="realtor-phone">'+ i18next.t('phone') + " " + realtor.phone + '</p>\n' +
            '  </div>',
        showCloseButton: true,
        focusConfirm: false,
        showCancelButton: true,
        showDenyButton: true,
        cancelButtonText: 'ОК',
        confirmButtonText: i18next.t('edit_account'),
        denyButtonText : i18next.t('delete')
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.setItem("realtorId", realtor.id)
            window.location.href = "realtor.html"
        } else if (result.isDenied) {
            Swal.fire({
                title: i18next.t('delete_realtor_approve'),
                showCloseButton: true,
                focusConfirm: false,
                showDenyButton: true,
                confirmButtonText:
                    i18next.t('yes'),
                denyButtonText : i18next.t('no')
            }).then((result2) => {
                if (result2.isConfirmed) {
                    const authToken = localStorage.getItem("auth")
                    fetch("http://127.0.0.1:8088/companies/realtors/" + realtor.id, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": authToken
                        }, method: 'DELETE'
                    })
                        .then(function(response) {
                            if (response.ok) {
                                return response.json();
                            } else {
                                throw new Error();
                            }
                        }).then(function(data) {
                        Swal.fire({
                            icon: 'success',
                            title: i18next.t('delete_realtor_success')
                        });
                        getRealtors()
                    })
                        .catch(function(error) {
                            Swal.fire({
                                icon: 'error',
                                title: i18next.t('delete_realtor_failure')
                            });
                        });
                }
            })
        }
    })
}

addRealtorButton.addEventListener("click", function () {
    window.location.href = "add_realtor.html"
});

function updateContent() {
    document.getElementById("footer").textContent = i18next.t("footer")
    document.getElementById("logoutButton").textContent = i18next.t("header_logout")
    document.getElementById("textRealtors").textContent =i18next.t("header_realtors")
    document.getElementById("textCabinet").textContent = i18next.t("header_cabinet")
    document.getElementById("textSubscription").textContent = i18next.t("header_subscription")
    document.getElementById("textTitle").textContent = i18next.t("header_realtors")
    document.getElementById("title").textContent = i18next.t("header_realtors")
    document.getElementById("addRealtorButton").textContent = i18next.t("add_realtor")
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
    getRealtors()
});

function getRealtors() {
    const realtorElements = realtorsList.querySelectorAll('li');
    realtorElements.forEach(function (realtor) {
        realtorsList.removeChild(realtor);
    });
    const authToken = localStorage.getItem('auth');
    fetch("http://127.0.0.1:8088/companies/realtors", {
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
        }).then(function(data) {
        data.forEach(function (realtor) {
            const realtorElement = createRealtorElement(realtor);
            realtorsList.appendChild(realtorElement);
        });
    })
        .catch(function(error) {
            Swal.fire({
                icon: 'error',
                title: i18next.t('get_info_failure')
            });
        });
}