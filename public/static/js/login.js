function updateContent() {
    document.getElementById("footer").textContent = i18next.t("footer")
    document.getElementById("textLoginRealtor").textContent = i18next.t("login_realtor")
    document.getElementById("textLoginCompany").textContent = i18next.t("login_company")
    document.getElementById("textRegister").textContent = i18next.t("register_company")
    document.getElementById("textEmail").textContent = i18next.t("email")
    document.getElementById("textPassword").textContent = i18next.t("password")
    document.getElementById("textLogin").textContent = i18next.t("login")
    document.getElementById("textTitle").textContent = i18next.t("login_title")
    document.getElementById("title").textContent = i18next.t("login_title")
}
const language = localStorage.getItem("selectedLanguage") === null ? 'uk' : localStorage.getItem("selectedLanguage")
document.addEventListener('DOMContentLoaded', function() {
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
});