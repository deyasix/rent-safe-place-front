let hasSubscription;
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");
const subscriptionTypeSelect = document.getElementById('subscriptionTypeSelect');
const endDateSelect = document.getElementById('endDateSelect');
const startDateSelect = document.getElementById("startDateSelect");
const checkoutButton = document.getElementById("checkoutButton");

async function fetchSubscription() {
    try {
        const authToken = localStorage.getItem('auth');
        const response = await fetch('http://127.0.0.1:8088/companies/subscription', {
            headers: {
                "Content-Type": "application/json", "Authorization": authToken
            }
        });
        if (response.status === 200) {
            const result = await response.json()
            const subscription = {
                subscriptionType: result.subscriptionType.name, startDate: result.startDate, endDate: result.endDate
            };
            startDate.textContent = subscription.startDate // Встановлення значення дати
            const subscriptionTypes = document.getElementById("subscriptionType");
            endDate.textContent = subscription.endDate // Встановлення значення дати
            subscriptionTypes.textContent = subscription.subscriptionType
            console.log(subscription)
            hasSubscription = true

        } else if (response.status === 404) {
            hasSubscription = false
        }

    } catch (error) {
        Swal.fire({
            icon: 'error', title: i18next.t('get_info_failure')
        })
    }
}

function updateContent() {
    document.getElementById("footer").textContent = i18next.t("footer")
    document.getElementById("logoutButton").textContent = i18next.t("header_logout")
    document.getElementById("textRealtors").textContent = i18next.t("header_realtors")
    document.getElementById("textCabinet").textContent = i18next.t("header_cabinet")
    document.getElementById("textSubscription").textContent = i18next.t("header_subscription")
    document.getElementById("title").textContent = i18next.t("header_subscription")
    document.getElementById("textSubscriptionInfo").textContent = i18next.t("subscription_info")
    document.getElementById("textSubscriptionType").textContent = i18next.t("subscription_type")
    document.getElementById("textStartDate").textContent = i18next.t("start_date")
    document.getElementById("textEndDate").textContent = i18next.t("end_date")
    document.getElementById("cancelButton").textContent = i18next.t("cancel_subscription")
    document.getElementById("textSubscriptionAbsent").textContent = i18next.t("absent_subscription")
    document.getElementById("subscribeButton").textContent = i18next.t("subscribe")
    document.getElementById("textSubscribing").textContent = i18next.t("subscribing")
    document.getElementById("textSubscriptionType2").textContent = i18next.t("subscription_type")
    document.getElementById("textStartDate2").textContent = i18next.t("start_date")
    document.getElementById("textEndDate2").textContent = i18next.t("end_date")
    document.getElementById("checkoutButton").textContent = i18next.t("checkout_button")
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

    fetchSubscription().then(() => {
        const subscriptionContent = document.getElementById("subscriptionContent");
        const noSubscriptionContent = document.getElementById("noSubscriptionContent");
        const doSubscribeContent = document.getElementById("doSubscribeContent")
        if (hasSubscription) {
            subscriptionContent.style.display = "block";
            noSubscriptionContent.style.display = "none";
            doSubscribeContent.style.display = "none"
        } else {
            subscriptionContent.style.display = "none";
            noSubscriptionContent.style.display = "block";
            doSubscribeContent.style.display = "none"

        }
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        startDateSelect.textContent = `${year}-${month}-${day}`
    }).catch(error => {
        console.error('Помилка:', error);
    });
});
const cancelButton = document.getElementById('cancelButton');

cancelButton.addEventListener('click', function () {
    const authToken = localStorage.getItem('auth');

    Swal.fire({
        title: i18next.t('cancel_subscription_approve'),
        showCancelButton: true,
        confirmButtonText: i18next.t('yes'),
        denyButtonText: i18next.t('no'),
    }).then((result) => {
        if (result.isConfirmed) {
            fetch("http://127.0.0.1:8088/companies/subscription", {
                headers: {
                    "Content-Type": "application/json", "Authorization": authToken
                }, method: "DELETE"
            })
                .then(function (response) {
                    if (response.ok) {
                        Swal.fire({
                            icon: 'success', title: i18next.t('cancel_subscription_success')
                        }).then(function () {
                            window.location.href = 'subscription.html';
                        });
                    } else {
                        throw new Error();
                    }
                })
                .catch(function (error) {
                    Swal.fire({
                        icon: 'error', title: i18next.t('cancel_subscription_failure')
                    });
                });
        }
    })
});
const subscribeButton = document.getElementById('subscribeButton');

subscribeButton.addEventListener('click', function () {
    const noSubscriptionContent = document.getElementById('noSubscriptionContent');
    const doSubscribeContent = document.getElementById("doSubscribeContent")
    noSubscriptionContent.style.display = 'none';
    doSubscribeContent.style.display = 'block'
    const authToken = localStorage.getItem("auth")
    fetch("http://127.0.0.1:8088/subscriptionTypes", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": authToken
        }
    })
        .then(function (response) {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error();
            }
        }).then(data => {
        data.forEach(item => {
            const newOption = document.createElement('option');
            const value = {term: item.term, price: item.price, id: item.id}
            newOption.value = JSON.stringify(value);
            newOption.text = item.name + " (" + item.price + i18next.t('money') + ")";
            subscriptionTypeSelect.appendChild(newOption);
        })
        subscriptionTypeSelect.options[0].selected = true
        const event = new Event('change');
        subscriptionTypeSelect.dispatchEvent(event);

    })
        .catch(function (error) {
            Swal.fire({
                icon: 'error', title: i18next.t('get_info_failure')
            });
        });
});

checkoutButton.addEventListener('click', function () {
    const selectedOption = subscriptionTypeSelect.options[subscriptionTypeSelect.selectedIndex];
    localStorage.setItem("startDate", startDateSelect.textContent)
    localStorage.setItem("endDate", endDateSelect.textContent)
    localStorage.setItem("orderType", JSON.parse(selectedOption.value).id)
    window.location.href = 'checkout.html';
});


subscriptionTypeSelect.addEventListener('change', function () {
    const selectedOption = subscriptionTypeSelect.options[subscriptionTypeSelect.selectedIndex];
    localStorage.setItem("value", JSON.parse(selectedOption.value).price)
    const now = new Date();
    const numberOfMonths = parseInt(JSON.parse(selectedOption.value).term);
    const endDate = new Date(now.getFullYear(), now.getMonth() + numberOfMonths + 1, 0);
    const year = endDate.getFullYear();
    const month = String(endDate.getMonth() + 1).padStart(2, '0');
    const day = String(endDate.getDate()).padStart(2, '0');
    endDateSelect.textContent = `${year}-${month}-${day}`;
});
