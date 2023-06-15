const tenantId = localStorage.getItem("tenantId")
const authToken = localStorage.getItem("auth")

function updateContent() {
    document.getElementById("footer").textContent = i18next.t("footer")
    document.getElementById("logoutButton").textContent = i18next.t("header_logout")
    document.getElementById("textBuildings").textContent = i18next.t("header_buildings")
    document.getElementById("textCabinet").textContent = i18next.t("header_cabinet")
    document.getElementById("title").textContent = i18next.t("tenant_title")
    document.getElementById("textTitle").textContent = i18next.t("tenant_title")
    document.getElementById("textId").textContent = i18next.t("id")
    document.getElementById("textName").textContent = i18next.t("name")
    document.getElementById("textPhone").textContent = i18next.t("phone")
    document.getElementById("textEmail").textContent = i18next.t("email")
}

const language = localStorage.getItem("selectedLanguage") === null ? 'uk' : localStorage.getItem("selectedLanguage")

document.addEventListener("DOMContentLoaded", function () {

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

    fetch("http://127.0.0.1:8088/realtors/tenants/" + tenantId, {
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
        document.getElementById("id").textContent = data.id
        document.getElementById("name").textContent = data.name
        document.getElementById("email").textContent = data.email
        document.getElementById("phone").textContent = data.phone
        document.getElementById("image").src = data.photo === "" || data.photo === null ? "https://firebasestorage.googleapis.com/v0/b/rent-safe-place.appspot.com/o/images%2Fno-user-image-icon-27.jpg?alt=media&token=4de8c976-97da-4fa4-8799-96ae82c20803&_gl=1*10ehvyr*_ga*MTk0NjM2ODY5Ni4xNjg2NjExMzYz*_ga_CW55HF8NVT*MTY4NjYzMjU5MC4zLjEuMTY4NjYzMjYwMi4wLjAuMA.." : data.photo
    })
        .catch(function (error) {
            Swal.fire({
                icon: 'error', title: i18next.t('get_info_failure')
            });
        });
});