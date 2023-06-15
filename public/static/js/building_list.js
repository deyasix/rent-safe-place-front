const buildingList = document.querySelector('.building-list');
const language = localStorage.getItem("selectedLanguage") === null ? 'uk' : localStorage.getItem("selectedLanguage")
document.addEventListener("DOMContentLoaded", function() {
    getBuildings()
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

function createBuildingElement(building) {
    const listItem = document.createElement('li');
    listItem.classList.add('building-list-item');
    listItem.setAttribute('data-building-id', building.id);

    const image = document.createElement('img');
    image.src = building.photo === "" ? "https://firebasestorage.googleapis.com/v0/b/rent-safe-place.appspot.com/o/images%2Fistockphoto-887464786-612x612.jpg?alt=media&token=d621cee8-506f-493c-9294-1e755c3e09ca&_gl=1*95oq22*_ga*MTk0NjM2ODY5Ni4xNjg2NjExMzYz*_ga_CW55HF8NVT*MTY4NjYxOTA2Ny4yLjEuMTY4NjYyMTI4Ny4wLjAuMA.." : building.photo
    image.alt = building.name;
    image.style.width = '200px'
    image.style.height = 'auto'
    listItem.appendChild(image);

    const buildingInfo = document.createElement('div');
    buildingInfo.classList.add('building-info');

    const buildingName = document.createElement('h3');
    buildingName.textContent = building.name;
    buildingInfo.appendChild(buildingName);

    const buildingDescription = document.createElement('p');
    buildingDescription.textContent = building.description;
    buildingInfo.appendChild(buildingDescription);
    listItem.addEventListener("click", function () {
        showBuildingInfo(building);
    });

    listItem.appendChild(buildingInfo);

    return listItem
}

function showBuildingInfo(building) {
    console.log(building)
    const photo = building.photo === "" ? "https://firebasestorage.googleapis.com/v0/b/rent-safe-place.appspot.com/o/images%2Fistockphoto-887464786-612x612.jpg?alt=media&token=d621cee8-506f-493c-9294-1e755c3e09ca&_gl=1*95oq22*_ga*MTk0NjM2ODY5Ni4xNjg2NjExMzYz*_ga_CW55HF8NVT*MTY4NjYxOTA2Ny4yLjEuMTY4NjYyMTI4Ny4wLjAuMA.." : building.photo
    const width = building.photo === "" ? 150 : 1100
    if (building.tenant !== null) localStorage.setItem("tenantId", building.tenant.id)
        Swal.fire({
        title: i18next.t('building_info'),
        html:
            '<div class="building-info">\n' +
            '    <img class="building-photo" src="' + photo + '" width="' + width + '"/>\n' +
            '    <h1 class="building-name">' +  building.name + '</h1>\n' +
            '    <p class="building-type"> ' + i18next.t('type') + ' ' + building.type + '</p>\n' +
            '    <p class="building-category"> ' + i18next.t('category') + ' ' + building.category + '</p>\n' +
            '    <p class="building-square"> ' + i18next.t('square') + ' ' + building.square + '</p>\n' +
            '    <p class="building-price"> ' + i18next.t('price') + ' ' + building.price + i18next.t('money') + '</p>\n' +
            '    <p class="building-is-pet-allowed">  ' + i18next.t('pets_allowed') + ' ' + (building.isPetAllowed ? i18next.t('yes') : i18next.t('no')) + '</p>\n' +
            '    <p class="building-description"> ' + i18next.t('description') + ' ' + building.description + '</p>\n' +
            '    <p class="building-city"> ' + i18next.t('city') + ' ' + building.city + '</p>\n' +
            '    <p class="building-address"> ' + i18next.t('address') + ' ' + building.address + '</p>\n' +
            '    <p class="building-tenant"> ' + i18next.t('tenant') + ' ' + (building.tenant === null ? i18next.t('none') : '<a href="tenant.html">' + building.tenant.id + '</a>') + '</p>\n' +
            '  </div>',
        showCloseButton: true,
        width: 1200,
        focusConfirm: false,
        showCancelButton: true,
        showDenyButton: true,
        cancelButtonText: 'ОК',
        confirmButtonText:
            i18next.t('building_title'),
        denyButtonText : i18next.t('delete')
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.setItem("buildingId", building.id)
            window.location.href = "building.html"
        } else if (result.isDenied) {
            Swal.fire({
                title: i18next.t('delete_building_approve'),
                showCloseButton: true,
                focusConfirm: false,
                showDenyButton: true,
                confirmButtonText:
                    i18next.t('yes'),
                denyButtonText : i18next.t('no')
            }).then((result2) => {
                if (result2.isConfirmed) {
                    const authToken = localStorage.getItem("auth")
                    fetch("http://127.0.0.1:8088/realtors/buildings/" + building.id, {
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
                            title: i18next.t('delete_building_success')
                        });
                        getBuildings()
                    })
                        .catch(function(error) {
                            Swal.fire({
                                icon: 'error',
                                title: i18next.t('delete_building_failure')
                            });
                        });
                }
            })
        }
    })
}

function getBuildings() {
    const buildingElements = buildingList.querySelectorAll('li');
    buildingElements.forEach(function (building) {
        buildingList.removeChild(building);
    });
    const authToken = localStorage.getItem('auth');
    console.log(authToken)
    fetch("http://127.0.0.1:8088/realtors/buildings", {
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
        console.log(data)
        data.forEach(function (building) {
            const buildingElement = createBuildingElement(building);
            buildingList.appendChild(buildingElement);
        });
    })
        .catch(function(error) {
            Swal.fire({
                icon: 'error',
                title: i18next.t('get_info_failure')
            });
        });
}

function updateContent() {

    document.getElementById("footer").textContent = i18next.t("footer")
    document.getElementById("logoutButton").textContent = i18next.t("header_logout")
    document.getElementById("textBuildings").textContent = i18next.t("header_buildings")
    document.getElementById("textCabinet").textContent = i18next.t("header_cabinet")
    document.getElementById("textAddButton").textContent = i18next.t("add_building_title")
}