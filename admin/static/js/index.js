import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js';

const tabButtons = document.querySelectorAll('.tab-button');
const addCompanyButton = document.getElementById("addCompanyButton")
const addCompanyLabel = document.getElementById("addCompanyLabel")
const addRealtorButton = document.getElementById("addRealtorButton")
const addRealtorLabel = document.getElementById("addRealtorLabel")
const authToken = localStorage.getItem("adminAuth");
const realtorPhoto = document.getElementById("realtorImageSrc")
const realtorImage = document.getElementById("realtorImage")
const addTenantButton = document.getElementById("addTenantButton")
const addTenantLabel = document.getElementById("addTenantLabel")
const tenantPhoto = document.getElementById("tenantImageSrc")
const tenantImage = document.getElementById("tenantImage")
const addBuildingButton = document.getElementById("addBuildingButton")
const addBuildingLabel = document.getElementById("addBuildingLabel")
const buildingPhoto = document.getElementById("buildingImageSrc")
const buildingImage = document.getElementById("buildingImage")
const addSubscriptionTypeButton = document.getElementById("addSubscriptionTypeButton")
const addSubscriptionTypeLabel = document.getElementById("addSubscriptionTypeLabel")
const addSubscriptionButton = document.getElementById("addSubscriptionButton")
const addSubscriptionLabel = document.getElementById("addSubscriptionLabel")
const addWarningButton = document.getElementById("addWarningButton")
const addWarningLabel = document.getElementById("addWarningLabel")


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
function createCompanyRow(data) {


    const row = document.createElement('tr');

    const idCell = document.createElement('td');
    idCell.textContent = data.id;

    const emailCell = document.createElement('td');
    emailCell.textContent = data.email;

    const nameCell = document.createElement('td');
    nameCell.textContent = data.name;

    const passwordCell = document.createElement('td');
    passwordCell.textContent = data.password;

    const editButtonCell = document.createElement('td');
    editButtonCell.innerHTML = '<button>Редагувати</button>'
    editButtonCell.addEventListener("click",  function(event) {
        event.preventDefault();

        const companyTable = document.getElementById("companyTable")
        companyTable.style.display = 'none'

        const editCompanyForm = document.getElementById("editCompanyForm")
        editCompanyForm.style.display = 'block'

        const companyLabel = document.getElementById("companyLabel")
        companyLabel.innerHTML = '<button id="backButton">Назад</button> <h3>Редагування компанії</h3>'
        const editCompanyId = document.getElementById("editCompanyId")
        editCompanyId.textContent = "id: " + data.id
        const backButton = document.getElementById("backButton")
        const addCompanyLabel = document.getElementById("addCompanyLabel")
        addCompanyLabel.style.display = 'none'
        const editCompanyEmail = document.getElementById("editCompanyEmail")
        const editCompanyName = document.getElementById("editCompanyName")
        const editCompanyPassword = document.getElementById("editCompanyPassword")
        editCompanyEmail.value = data.email
        editCompanyPassword.value = data.password
        editCompanyName.value = data.name
        const editCompanyButton = document.getElementById("editCompanyButton")
        const editEvent = function(event2) {
            event2.preventDefault()
            fetch("http://127.0.0.1:8088/companies/" + data.id, {
                headers: {
                    "Content-Type": "application/json", "Authorization": authToken
                }, method: "PUT", body: JSON.stringify({
                    email: editCompanyEmail.value,
                    password: editCompanyPassword.value,
                    name: editCompanyName.value
                })
            })
                .then(function (response) {
                    if (response.ok) {
                        Swal.fire({
                            icon: 'success', title: 'Компанію було відредаговано', showConfirmButton: false, timer: 1500
                        })
                        const backButton = document.getElementById("backButton")
                        const event = new Event('click');
                        backButton.dispatchEvent(event)
                        fetchDataAndPopulateTable("http://127.0.0.1:8088/companies", "tab1")
                    } else {
                        throw new Error();
                    }
                })

                .catch(function (error) {
                    Swal.fire({
                        icon: 'error', title: 'Unsuccessful authorization'
                    });
                });
        }
        editCompanyButton.addEventListener("click", editEvent)
        backButton.addEventListener("click", function(event2) {
            event2.preventDefault()
            companyTable.style.display = "block"
            editCompanyForm.style.display = "none"
            companyLabel.innerHTML = '<h3>Компанії</h3>'
            event.target.style.display = 'block'
            addCompanyLabel.style.display = 'block'
            editCompanyButton.removeEventListener("click", editEvent)
        })

    })

    const deleteButtonCell = document.createElement('td');
    deleteButtonCell.innerHTML = '<button id="deleteButton">Видалити</button>'
    deleteButtonCell.addEventListener("click", function(event) {
        event.preventDefault()
        Swal.fire({
            title: 'Ви дійсно хочете видалити компанію?',
            showCloseButton: true,
            focusConfirm: false,
            showDenyButton: true,
            confirmButtonText:
                'Так',
            denyButtonText : 'Ні'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch("http://127.0.0.1:8088/companies/" + data.id, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": authToken
                    }, method: 'DELETE'
                })
                    .then(function(response) {
                        if (response.ok) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Компанію було видалено'
                            });
                            fetchDataAndPopulateTable('http://127.0.0.1:8088/companies', 'tab1')
                        } else {
                            throw new Error("Unsuccessful authorization");
                        }
                    })
                    .catch(function(error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Unsuccessful authorization'
                        });
                    });
            }
        })
    })
    row.append(idCell, emailCell, nameCell, passwordCell, editButtonCell, deleteButtonCell)

    return row;
}

function fetchDataAndPopulateTable(url, tabId) {
    fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": authToken
        }
    })
        .then(function (response) {
            if (response.status !== 401) {
                return response.json();
            } else {
                throw new Error("Unsuccessful authorization");
            }
        })
        .then(function (data) {
            populateTable(tabId, data);
        })
        .catch(function (error) {
            Swal.fire({
                icon: 'error',
                title: error
            });
        });
}

function createRealtorRow(data) {
    const row = document.createElement('tr');

    const idCell = document.createElement('td');
    idCell.textContent = data.id;
    const companyIdCell = document.createElement('td');
    companyIdCell.textContent = data.company.id;

    const emailCell = document.createElement('td');
    emailCell.textContent = data.email;

    const passwordCell = document.createElement('td');
    passwordCell.textContent = data.password;

    const nameCell = document.createElement('td');
    nameCell.textContent = data.name;

    const phoneCell = document.createElement('td');
    phoneCell.textContent = data.phone;

    const photoCell = document.createElement('td');
    photoCell.textContent = data.photo;

    const editButtonCell = document.createElement('td');
    editButtonCell.innerHTML = '<button>Редагувати</button>'
    editButtonCell.addEventListener("click", function(event) {
        event.preventDefault()
        const realtorTable = document.getElementById("realtorTable")
        realtorTable.style.display = 'none'

        const editRealtorForm = document.getElementById("editRealtorForm")
        editRealtorForm.style.display = 'block'

        const realtorLabel = document.getElementById("realtorLabel")
        realtorLabel.innerHTML = '<button id="backButton">Назад</button> <h3>Редагування рієлтора</h3>'
        const editRealtorId = document.getElementById("editRealtorId")
        editRealtorId.textContent = "id: " + data.id
        const backButton = document.getElementById("backButton")
        const addRealtorLabel = document.getElementById("addRealtorLabel")
        addRealtorLabel.style.display = 'none'
        const editRealtorEmail = document.getElementById("editRealtorEmail")
        const editRealtorName = document.getElementById("editRealtorName")
        const editRealtorPassword = document.getElementById("editRealtorPassword")
        const editRealtorPhone = document.getElementById("editRealtorPhone")
        const editRealtorCompanyId = document.getElementById("editRealtorCompanyId")
        const editRealtorImage = document.getElementById("editRealtorImage")
        editRealtorEmail.value = data.email
        editRealtorPassword.value = data.password
        editRealtorName.value = data.name
        editRealtorPhone.value = data.phone
        editRealtorCompanyId.value = data.company.id
        editRealtorImage.src = (data.photo !== "" && data.photo !== null) ? data.photo : ""
        const editRealtorPhoto = document.getElementById("editRealtorImageSrc")
        const editEvent = function(event2) {
            event2.preventDefault()
            const photoFile = editRealtorPhoto.files[0];
            const photoValue = (photoFile !== null && photoFile !== undefined) ? editRealtorImage.src : data.photo;
            const email = editRealtorEmail.value === data.email ? null : editRealtorEmail.value
            fetch("http://127.0.0.1:8088/realtors/" + data.id, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authToken
                },
                method: "PUT",
                body: JSON.stringify({
                    email: email,
                    password: editRealtorPassword.value,
                    name: editRealtorName.value,
                    phone: editRealtorPhone.value,
                    photo: photoValue,
                    company: {
                        id: editRealtorCompanyId.value
                    }
                })
            })
                .then(function(response) {
                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Рієлтора було відредаговано',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        const backButton = document.getElementById("backButton")
                        const event = new Event('click');
                        backButton.dispatchEvent(event)
                        fetchDataAndPopulateTable("http://127.0.0.1:8088/realtors", "tab2")
                    } else {
                        throw new Error("Unsuccessful authorization");
                    }
                })
                .catch(function(error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Unsuccessful authorization',
                        text: 'Incorrect credentials!',
                    });
                });
        }
        const photoEvent = function(event2) {
            event2.preventDefault()
            // Отримати вибраний файл
            const file = event2.target.files[0];
            const storageRef = ref(storage, 'images');
            const imageRef = ref(storageRef, 'realtor' + file.name);
            uploadBytes(imageRef, file)
                .then(snapshot => {
                    // Отримайте посилання на завантажене зображення
                    getDownloadURL(snapshot.ref)
                        .then(downloadURL => {
                            editRealtorImage.src = downloadURL
                        })
                        .catch(error => {
                            console.error('Помилка отримання посилання на зображення:', error);
                        });
                })
                .catch(error => {
                    console.error('Помилка завантаження зображення:', error);
                });
        }
        const editRealtorButton = document.getElementById("editRealtorButton")
        editRealtorButton.addEventListener("click", editEvent)
        backButton.addEventListener("click", function(event2) {
            event2.preventDefault()
            realtorTable.style.display = "block"
            editRealtorForm.style.display = "none"
            realtorLabel.innerHTML = '<h3>Рієлтори</h3>'
            event.target.style.display = 'block'
            editRealtorImage.src = ""
            editRealtorPhoto.value = ""
            addRealtorLabel.style.display = 'block'
            editRealtorButton.removeEventListener("click", editEvent)
            editRealtorPhoto.removeEventListener("change", photoEvent)
        })
        editRealtorPhoto.addEventListener('change', photoEvent);

    })

    const deleteButtonCell = document.createElement('td');
    deleteButtonCell.innerHTML = '<button id="deleteButton">Видалити</button>'
    deleteButtonCell.addEventListener("click", function(event) {
        event.preventDefault()
        Swal.fire({
            title: 'Ви дійсно хочете видалити рієлтора?',
            showCloseButton: true,
            focusConfirm: false,
            showDenyButton: true,
            confirmButtonText:
                'Так',
            denyButtonText : 'Ні'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch("http://127.0.0.1:8088/realtors/" + data.id, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": authToken
                    }, method: 'DELETE'
                })
                    .then(function(response) {
                        if (response.ok) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Рієлтора було видалено'
                            });
                            fetchDataAndPopulateTable('http://127.0.0.1:8088/realtors', 'tab2')
                        } else {
                            throw new Error("Unsuccessful authorization");
                        }
                    })
                    .catch(function(error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Unsuccessful authorization',
                            text: 'Incorrect credentials!',
                        });
                    });
            }
        })
    })
    row.append(idCell, companyIdCell, emailCell, passwordCell, nameCell, phoneCell, photoCell, editButtonCell, deleteButtonCell)
    return row;
}

function createTenantRow(data) {
    const row = document.createElement('tr');

    const idCell = document.createElement('td');
    idCell.textContent = data.id;

    const emailCell = document.createElement('td');
    emailCell.textContent = data.email;

    const passwordCell = document.createElement('td');
    passwordCell.textContent = data.password;

    const nameCell = document.createElement('td');
    nameCell.textContent = data.name;

    const phoneCell = document.createElement('td');
    phoneCell.textContent = data.phone;

    const photoCell = document.createElement('td');
    photoCell.textContent = data.photo

    const editButtonCell = document.createElement('td');
    editButtonCell.innerHTML = '<button>Редагувати</button>'
    editButtonCell.addEventListener("click", function(event) {
        event.preventDefault()
        const tenantTable = document.getElementById("tenantTable")
        tenantTable.style.display = 'none'

        const editTenantForm = document.getElementById("editTenantForm")
        editTenantForm.style.display = 'block'

        const tenantLabel = document.getElementById("tenantLabel")
        tenantLabel.innerHTML = '<button id="backButton">Назад</button> <h3>Редагування орендаря</h3>'
        const editTenantId = document.getElementById("editTenantId")
        editTenantId.textContent = "id: " + data.id
        const backButton = document.getElementById("backButton")
        const addTenantLabel = document.getElementById("addTenantLabel")
        addTenantLabel.style.display = 'none'
        const editTenantEmail = document.getElementById("editTenantEmail")
        const editTenantName = document.getElementById("editTenantName")
        const editTenantPassword = document.getElementById("editTenantPassword")
        const editTenantPhone = document.getElementById("editTenantPhone")
        const editTenantImage = document.getElementById("editTenantImage")
        editTenantEmail.value = data.email
        editTenantPassword.value = data.password
        editTenantName.value = data.name
        editTenantPhone.value = data.phone
        editTenantImage.src = (data.photo !== "" && data.photo !== null) ? data.photo : ""
        const editTenantPhoto = document.getElementById("editTenantImageSrc")
        const editEvent = function(event2) {
            event2.preventDefault()
            const photoFile = editTenantPhoto.files[0];
            const photoValue = (photoFile !== null && photoFile !== undefined) ? editTenantImage.src : data.photo;
            const email = editTenantEmail.value === data.email ? null : editTenantEmail.value
            fetch("http://127.0.0.1:8088/tenants/" + data.id, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authToken
                },
                method: "PUT",
                body: JSON.stringify({
                    email: email,
                    password: editTenantPassword.value,
                    name: editTenantName.value,
                    phone: editTenantPhone.value,
                    photo: photoValue,
                })
            })
                .then(function(response) {
                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Орендаря було відредаговано',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        const backButton = document.getElementById("backButton")
                        const event = new Event('click');
                        backButton.dispatchEvent(event)
                        fetchDataAndPopulateTable("http://127.0.0.1:8088/tenants", "tab3")
                    } else {
                        throw new Error("Unsuccessful authorization");
                    }
                })
                .catch(function(error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Unsuccessful authorization',
                        text: 'Incorrect credentials!',
                    });
                });
        }
        const photoEvent = function(event2) {
            event2.preventDefault()
            // Отримати вибраний файл
            const file = event2.target.files[0];
            const storageRef = ref(storage, 'images');
            const imageRef = ref(storageRef, 'tenant' + file.name);
            uploadBytes(imageRef, file)
                .then(snapshot => {
                    // Отримайте посилання на завантажене зображення
                    getDownloadURL(snapshot.ref)
                        .then(downloadURL => {
                            editTenantImage.src = downloadURL
                        })
                        .catch(error => {
                            console.error('Помилка отримання посилання на зображення:', error);
                        });
                })
                .catch(error => {
                    console.error('Помилка завантаження зображення:', error);
                });
        }
        const editTenantButton = document.getElementById("editTenantButton")
        editTenantButton.addEventListener("click", editEvent)
        backButton.addEventListener("click", function(event2) {
            event2.preventDefault()
            tenantTable.style.display = "block"
            editTenantForm.style.display = "none"
            tenantLabel.innerHTML = '<h3>Рієлтори</h3>'
            event.target.style.display = 'block'
            editTenantImage.src = ""
            editTenantPhoto.value = ""
            addTenantLabel.style.display = 'block'
            editTenantButton.removeEventListener("click", editEvent)
            editTenantPhoto.removeEventListener("change", photoEvent)
        })
        editTenantPhoto.addEventListener('change', photoEvent);

    })

    const deleteButtonCell = document.createElement('td');
    deleteButtonCell.innerHTML = '<button id="deleteButton">Видалити</button>'
    deleteButtonCell.addEventListener("click", function(event) {
        event.preventDefault()
        Swal.fire({
            title: 'Ви дійсно хочете видалити орендаря?',
            showCloseButton: true,
            focusConfirm: false,
            showDenyButton: true,
            confirmButtonText:
                'Так',
            denyButtonText : 'Ні'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch("http://127.0.0.1:8088/tenants/" + data.id, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": authToken
                    }, method: 'DELETE'
                })
                    .then(function(response) {
                        if (response.ok) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Орендаря було видалено'
                            });
                            fetchDataAndPopulateTable('http://127.0.0.1:8088/tenants', 'tab3')
                        } else {
                            throw new Error("Unsuccessful authorization");
                        }
                    })
                    .catch(function(error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Unsuccessful authorization',
                            text: 'Incorrect credentials!',
                        });
                    });
            }
        })
    })
    row.append(idCell, emailCell, passwordCell, nameCell, phoneCell, photoCell, editButtonCell, deleteButtonCell)
    return row;
}

function createBuildingRow(data) {
    const row = document.createElement('tr');

    const idCell = document.createElement('td');
    idCell.textContent = data.id;

    const realtorIdCell = document.createElement('td');
    realtorIdCell.textContent = data.realtor.id;

    const tenantIdCell = document.createElement('td');
    tenantIdCell.textContent = data.tenant !== null ? data.tenant.id : null

    const typeCell = document.createElement('td');
    typeCell.textContent = data.type

    const squareCell = document.createElement('td');
    squareCell.textContent = data.square;

    const nameCell = document.createElement('td');
    nameCell.textContent = data.name

    const priceCell = document.createElement('td');
    priceCell.textContent = data.price

    const isPetAllowedCell = document.createElement('td');
    isPetAllowedCell.textContent = data.isPetAllowed

    const photoCell = document.createElement('td');
    photoCell.textContent = data.photo

    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = data.description

    const categoryCell = document.createElement('td');
    categoryCell.textContent = data.category

    const cityCell = document.createElement('td');
    cityCell.textContent = data.city

    const addressCell = document.createElement('td');
    addressCell.textContent = data.address

    const editButtonCell = document.createElement('td');
    editButtonCell.innerHTML = '<button>Редагувати</button>'
    editButtonCell.addEventListener("click", function(event) {
        event.preventDefault()
        const buildingTable = document.getElementById("buildingTable")
        buildingTable.style.display = 'none'

        const editBuildingForm = document.getElementById("editBuildingForm")
        editBuildingForm.style.display = 'block'

        const buildingLabel = document.getElementById("buildingLabel")
        buildingLabel.innerHTML = '<button id="backButton">Назад</button> <h3>Редагування приміщення</h3>'
        const editBuildingId = document.getElementById("editBuildingId")
        editBuildingId.textContent = "id: " + data.id
        const backButton = document.getElementById("backButton")
        const addBuildingLabel = document.getElementById("addBuildingLabel")
        addBuildingLabel.style.display = 'none'
        const editBuildingRealtorId = document.getElementById("editBuildingRealtorId")
        const editBuildingTenantId = document.getElementById("editBuildingTenantId")
        const editBuildingType = document.getElementById("editBuildingType")
        const editBuildingSquare = document.getElementById("editBuildingSquare")
        const editBuildingName = document.getElementById("editBuildingName")
        const editBuildingPrice = document.getElementById("editBuildingPrice")
        const editBuildingIsPetAllowed = document.getElementById("editBuildingIsPetAllowed")
        const editBuildingDescription = document.getElementById("editBuildingDescription")
        const editBuildingCategory = document.getElementById("editBuildingCategory")
        const editBuildingCity = document.getElementById("editBuildingCity")
        const editBuildingAddress = document.getElementById("editBuildingAddress")
        const editBuildingImage = document.getElementById("editBuildingImage")
        editBuildingRealtorId.value = data.realtor.id
        editBuildingTenantId.value = data.tenant !== null ? data.tenant.id : ""
        editBuildingType.value = data.type
        editBuildingSquare.value = data.square
        editBuildingName.value = data.name
        editBuildingPrice.value = data.price
        editBuildingIsPetAllowed.value = data.isPetAllowed
        editBuildingDescription.value = data.description
        editBuildingCategory.value = data.category
        editBuildingCity.value = data.city
        editBuildingAddress.value = data.address
        editBuildingImage.src = (data.photo !== "" && data.photo !== null) ? data.photo : ""
        const editBuildingPhoto = document.getElementById("editBuildingImageSrc")
        const editEvent = function(event2) {
            event2.preventDefault()
            const photoFile = editBuildingPhoto.files[0];
            const photoValue = (photoFile !== null && photoFile !== undefined) ? editBuildingImage.src : data.photo;
            const tenant = editBuildingTenantId.value === "" ? null : editBuildingTenantId.value
            fetch("http://127.0.0.1:8088/buildings/" + data.id, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authToken
                },
                method: "PUT",
                body: JSON.stringify({
                    photo: photoValue,
                    realtor: {
                        id: editBuildingRealtorId.value
                    },
                    tenant: {
                        id: editBuildingTenantId.value
                    },
                    type: editBuildingType.value,
                    square: editBuildingSquare.value,
                    name: editBuildingName.value,
                    price: editBuildingPrice.value,
                    isPetAllowed: editBuildingIsPetAllowed.value,
                    description: editBuildingDescription.value,
                    isLeased: tenant !== null,
                    category: editBuildingCategory.value,
                    city: editBuildingCity.value,
                    address: editBuildingAddress.value
                })
            })
                .then(function(response) {
                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Приміщення було відредаговано',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        const backButton = document.getElementById("backButton")
                        const event = new Event('click');
                        backButton.dispatchEvent(event)
                        fetchDataAndPopulateTable("http://127.0.0.1:8088/buildings", "tab4")
                    } else {
                        throw new Error("Unsuccessful authorization");
                    }
                })
                .catch(function(error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Unsuccessful authorization',
                        text: 'Incorrect credentials!',
                    });
                });
        }
        const photoEvent = function(event2) {
            event2.preventDefault()
            // Отримати вибраний файл
            const file = event2.target.files[0];
            const storageRef = ref(storage, 'images');
            const imageRef = ref(storageRef, 'building' + file.name);
            uploadBytes(imageRef, file)
                .then(snapshot => {
                    // Отримайте посилання на завантажене зображення
                    getDownloadURL(snapshot.ref)
                        .then(downloadURL => {
                            editBuildingImage.src = downloadURL
                        })
                        .catch(error => {
                            console.error('Помилка отримання посилання на зображення:', error);
                        });
                })
                .catch(error => {
                    console.error('Помилка завантаження зображення:', error);
                });
        }
        const editBuildingButton = document.getElementById("editBuildingButton")
        editBuildingButton.addEventListener("click", editEvent)
        backButton.addEventListener("click", function(event2) {
            event2.preventDefault()
            buildingTable.style.display = "block"
            editBuildingForm.style.display = "none"
            buildingLabel.innerHTML = '<h3>Приміщення</h3>'
            event.target.style.display = 'block'
            editBuildingImage.src = ""
            editBuildingPhoto.value = ""
            addBuildingLabel.style.display = 'block'
            editBuildingButton.removeEventListener("click", editEvent)
            editBuildingPhoto.removeEventListener("change", photoEvent)
        })
        editBuildingPhoto.addEventListener('change', photoEvent);

    })

    const deleteButtonCell = document.createElement('td');
    deleteButtonCell.innerHTML = '<button id="deleteButton">Видалити</button>'
    deleteButtonCell.addEventListener("click", function(event) {
        event.preventDefault()
        Swal.fire({
            title: 'Ви дійсно хочете видалити приміщення?',
            showCloseButton: true,
            focusConfirm: false,
            showDenyButton: true,
            confirmButtonText:
                'Так',
            denyButtonText : 'Ні'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch("http://127.0.0.1:8088/buildings/" + data.id, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": authToken
                    }, method: 'DELETE'
                })
                    .then(function(response) {
                        if (response.ok) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Приміщення було видалено'
                            });
                            fetchDataAndPopulateTable('http://127.0.0.1:8088/buildings', 'tab4')
                        } else {
                            throw new Error("Unsuccessful authorization");
                        }
                    })
                    .catch(function(error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Unsuccessful authorization',
                            text: 'Incorrect credentials!',
                        });
                    });
            }
        })
    })
    row.append(idCell, realtorIdCell, tenantIdCell, typeCell, squareCell, nameCell, priceCell, isPetAllowedCell, photoCell,
        descriptionCell, categoryCell, cityCell, addressCell, editButtonCell, deleteButtonCell)
    return row;
}

function createSubscriptionTypeRow(data) {
    const row = document.createElement('tr');

    const idCell = document.createElement('td');
    idCell.textContent = data.id;

    const nameCell = document.createElement('td');
    nameCell.textContent = data.name;

    const priceCell = document.createElement('td');
    priceCell.textContent = data.price

    const termCell = document.createElement('td');
    termCell.textContent = data.term

    const editButtonCell = document.createElement('td');
    editButtonCell.innerHTML = '<button>Редагувати</button>'
    editButtonCell.addEventListener("click", function(event) {
        event.preventDefault()
        const subscriptionTypeTable = document.getElementById("subscriptionTypeTable")
        subscriptionTypeTable.style.display = 'none'

        const editSubscriptionTypeForm = document.getElementById("editSubscriptionTypeForm")
        editSubscriptionTypeForm.style.display = 'block'

        const subscriptionTypeLabel = document.getElementById("subscriptionTypeLabel")
        subscriptionTypeLabel.innerHTML = '<button id="backButton">Назад</button> <h3>Редагування типу підписки</h3>'
        const editSubscriptionTypeId = document.getElementById("editSubscriptionTypeId")
        editSubscriptionTypeId.textContent = "id: " + data.id
        const backButton = document.getElementById("backButton")
        const addSubscriptionTypeLabel = document.getElementById("addSubscriptionTypeLabel")
        addSubscriptionTypeLabel.style.display = 'none'
        const editSubscriptionTypeName = document.getElementById("editSubscriptionTypeName")
        const editSubscriptionTypePrice = document.getElementById("editSubscriptionTypePrice")
        const editSubscriptionTypeTerm = document.getElementById("editSubscriptionTypeTerm")
        editSubscriptionTypeName.value = data.name
        editSubscriptionTypePrice.value = data.price
        editSubscriptionTypeTerm.value = data.term
        const editEvent = function(event2) {
            event2.preventDefault()
            fetch("http://127.0.0.1:8088/subscriptionTypes/" + data.id, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authToken
                },
                method: "PUT",
                body: JSON.stringify({
                    name: editSubscriptionTypeName.value,
                    price: editSubscriptionTypePrice.value,
                    term: editSubscriptionTypeTerm.value
                })
            })
                .then(function(response) {
                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Тип підписки було відредаговано',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        const backButton = document.getElementById("backButton")
                        const event = new Event('click');
                        backButton.dispatchEvent(event)
                        fetchDataAndPopulateTable("http://127.0.0.1:8088/subscriptionTypes", "tab5")
                    } else {
                        throw new Error("Unsuccessful authorization");
                    }
                })
                .catch(function(error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Unsuccessful authorization',
                        text: 'Incorrect credentials!',
                    });
                });
        }

        const editSubscriptionTypeButton = document.getElementById("editSubscriptionTypeButton")
        editSubscriptionTypeButton.addEventListener("click", editEvent)
        backButton.addEventListener("click", function(event2) {
            event2.preventDefault()
            subscriptionTypeTable.style.display = "block"
            editSubscriptionTypeForm.style.display = "none"
            subscriptionTypeLabel.innerHTML = '<h3>Типи підписок</h3>'
            event.target.style.display = 'block'
            addSubscriptionTypeLabel.style.display = 'block'
            editSubscriptionTypeButton.removeEventListener("click", editEvent)
        })
    })

    const deleteButtonCell = document.createElement('td');
    deleteButtonCell.innerHTML = '<button id="deleteButton">Видалити</button>'
    deleteButtonCell.addEventListener("click", function(event) {
        event.preventDefault()
        Swal.fire({
            title: 'Ви дійсно хочете видалити тип підписки?',
            showCloseButton: true,
            focusConfirm: false,
            showDenyButton: true,
            confirmButtonText:
                'Так',
            denyButtonText : 'Ні'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch("http://127.0.0.1:8088/subscriptionTypes/" + data.id, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": authToken
                    }, method: 'DELETE'
                })
                    .then(function(response) {
                        if (response.ok) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Тип підписки було видалено'
                            });
                            fetchDataAndPopulateTable('http://127.0.0.1:8088/subscriptionTypes', 'tab5')
                        } else {
                            throw new Error("Unsuccessful authorization");
                        }
                    })
                    .catch(function(error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Unsuccessful authorization',
                            text: 'Incorrect credentials!',
                        });
                    });
            }
        })
    })
    row.append(idCell, nameCell, priceCell, termCell, editButtonCell, deleteButtonCell)
    return row;
}

function createSubscriptionRow(data) {
    const row = document.createElement('tr');

    const idCell = document.createElement('td');
    idCell.textContent = data.id;

    const companyIdCell = document.createElement('td');
    companyIdCell.textContent = data.company.id;

    const subscriptionTypeIdCell = document.createElement('td');
    subscriptionTypeIdCell.textContent = data.subscriptionType.id

    const startDateCell = document.createElement('td');
    startDateCell.textContent = data.startDate

    const endDateCell = document.createElement('td');
    endDateCell.textContent = data.endDate

    const editButtonCell = document.createElement('td');
    editButtonCell.innerHTML = '<button>Редагувати</button>'
    editButtonCell.addEventListener("click", function(event) {
        event.preventDefault()
        const subscriptionTable = document.getElementById("subscriptionTable")
        subscriptionTable.style.display = 'none'

        const editSubscriptionForm = document.getElementById("editSubscriptionForm")
        editSubscriptionForm.style.display = 'block'

        const subscriptionLabel = document.getElementById("subscriptionLabel")
        subscriptionLabel.innerHTML = '<button id="backButton">Назад</button> <h3>Редагування підписки</h3>'
        const editSubscriptionId = document.getElementById("editSubscriptionId")
        editSubscriptionId.textContent = "id: " + data.id
        const backButton = document.getElementById("backButton")
        const addSubscriptionLabel = document.getElementById("addSubscriptionLabel")
        addSubscriptionLabel.style.display = 'none'
        const editSubscriptionCompanyId = document.getElementById("editSubscriptionCompanyId")
        const editSubscriptionSubscriptionTypeId = document.getElementById("editSubscriptionSubscriptionTypeId")
        const editSubscriptionStartDate = document.getElementById("editSubscriptionStartDate")
        const editSubscriptionEndDate = document.getElementById("editSubscriptionEndDate")
        editSubscriptionCompanyId.value = data.company.id
        editSubscriptionSubscriptionTypeId.value = data.subscriptionType.id
        editSubscriptionStartDate.value = data.startDate
        editSubscriptionEndDate.value = data.endDate
        const editEvent = function(event2) {
            event2.preventDefault()
            fetch("http://127.0.0.1:8088/subscriptions/" + data.id, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authToken
                },
                method: "PUT",
                body: JSON.stringify({
                    company: {
                        id: editSubscriptionCompanyId.value
                    },
                    subscriptionType: {
                        id: editSubscriptionSubscriptionTypeId.value
                    },
                    startDate: editSubscriptionStartDate.value,
                    endDate: editSubscriptionEndDate.value
                })
            })
                .then(function(response) {
                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Підписку було відредаговано',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        const backButton = document.getElementById("backButton")
                        const event = new Event('click');
                        backButton.dispatchEvent(event)
                        fetchDataAndPopulateTable("http://127.0.0.1:8088/subscriptions", "tab6")
                    } else {
                        throw new Error("Unsuccessful authorization");
                    }
                })
                .catch(function(error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Unsuccessful authorization',
                        text: 'Incorrect credentials!',
                    });
                });
        }

        const editSubscriptionButton = document.getElementById("editSubscriptionButton")
        editSubscriptionButton.addEventListener("click", editEvent)
        backButton.addEventListener("click", function(event2) {
            event2.preventDefault()
            subscriptionTable.style.display = "block"
            editSubscriptionForm.style.display = "none"
            subscriptionLabel.innerHTML = '<h3>Підписки</h3>'
            event.target.style.display = 'block'
            addSubscriptionLabel.style.display = 'block'
            editSubscriptionButton.removeEventListener("click", editEvent)
        })
    })

    const deleteButtonCell = document.createElement('td');
    deleteButtonCell.innerHTML = '<button id="deleteButton">Видалити</button>'
    deleteButtonCell.addEventListener("click", function(event) {
        event.preventDefault()
        Swal.fire({
            title: 'Ви дійсно хочете видалити підписку?',
            showCloseButton: true,
            focusConfirm: false,
            showDenyButton: true,
            confirmButtonText:
                'Так',
            denyButtonText : 'Ні'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch("http://127.0.0.1:8088/subscriptions/" + data.id, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": authToken
                    }, method: 'DELETE'
                })
                    .then(function(response) {
                        if (response.ok) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Підписку було видалено'
                            });
                            fetchDataAndPopulateTable('http://127.0.0.1:8088/subscriptions', 'tab6')
                        } else {
                            throw new Error("Unsuccessful authorization");
                        }
                    })
                    .catch(function(error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Unsuccessful authorization',
                            text: 'Incorrect credentials!',
                        });
                    });
            }
        })
    })
    row.append(idCell, companyIdCell, subscriptionTypeIdCell, startDateCell, endDateCell, editButtonCell, deleteButtonCell)
    return row;
}

function createWarningRow(data) {
    const row = document.createElement('tr');

    const idCell = document.createElement('td');
    idCell.textContent = data.id;

    const buildingIdCell = document.createElement('td');
    buildingIdCell.textContent = data.building.id;

    const messageCell = document.createElement('td');
    messageCell.textContent = data.message

    const timeCell = document.createElement('td');
    timeCell.textContent = data.time

    const typeCell = document.createElement('td');
    typeCell.textContent = data.type

    const editButtonCell = document.createElement('td');
    editButtonCell.innerHTML = '<button>Редагувати</button>'
    editButtonCell.addEventListener("click", function(event) {
        event.preventDefault()
        const warningTable = document.getElementById("warningTable")
        warningTable.style.display = 'none'

        const editWarningForm = document.getElementById("editWarningForm")
        editWarningForm.style.display = 'block'

        const warningLabel = document.getElementById("warningLabel")
        warningLabel.innerHTML = '<button id="backButton">Назад</button> <h3>Редагування попередження</h3>'
        const editWarningId = document.getElementById("editWarningId")
        editWarningId.textContent = "id: " + data.id
        const backButton = document.getElementById("backButton")
        const addWarningLabel = document.getElementById("addWarningLabel")
        addWarningLabel.style.display = 'none'
        const editWarningBuildingId = document.getElementById("editWarningBuildingId")
        const editWarningMessage = document.getElementById("editWarningMessage")
        const editWarningTime = document.getElementById("editWarningTime")
        const editWarningType = document.getElementById("editWarningType")
        editWarningBuildingId.value = data.building.id
        editWarningMessage.value = data.message
        editWarningTime.value = data.time
        editWarningType.value = data.type
        const editEvent = function(event2) {
            event2.preventDefault()
            fetch("http://127.0.0.1:8088/warnings/" + data.id, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authToken
                },
                method: "PUT",
                body: JSON.stringify({
                    message: editWarningMessage.value,
                    building: {
                        id: editWarningBuildingId.value
                    },
                    time: editWarningTime.value,
                    type: editWarningType.value
                })
            })
                .then(function(response) {
                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Попередження було відредаговано',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        const backButton = document.getElementById("backButton")
                        const event = new Event('click');
                        backButton.dispatchEvent(event)
                        fetchDataAndPopulateTable("http://127.0.0.1:8088/warnings", "tab7")
                    } else {
                        throw new Error("Unsuccessful authorization");
                    }
                })
                .catch(function(error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Unsuccessful authorization',
                        text: 'Incorrect credentials!',
                    });
                });
        }

        const editWarningButton = document.getElementById("editWarningButton")
        editWarningButton.addEventListener("click", editEvent)
        backButton.addEventListener("click", function(event2) {
            event2.preventDefault()
            warningTable.style.display = "block"
            editWarningForm.style.display = "none"
            warningLabel.innerHTML = '<h3>Попередження</h3>'
            event.target.style.display = 'block'
            addWarningLabel.style.display = 'block'
            editWarningButton.removeEventListener("click", editEvent)
        })
    })

    const deleteButtonCell = document.createElement('td');
    deleteButtonCell.innerHTML = '<button id="deleteButton">Видалити</button>'
    deleteButtonCell.addEventListener("click", function(event) {
        event.preventDefault()
        Swal.fire({
            title: 'Ви дійсно хочете видалити попередження?',
            showCloseButton: true,
            focusConfirm: false,
            showDenyButton: true,
            confirmButtonText:
                'Так',
            denyButtonText : 'Ні'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch("http://127.0.0.1:8088/warnings/" + data.id, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": authToken
                    }, method: 'DELETE'
                })
                    .then(function(response) {
                        if (response.ok) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Попередження було видалено'
                            });
                            fetchDataAndPopulateTable('http://127.0.0.1:8088/warnings', 'tab7')
                        } else {
                            throw new Error("Unsuccessful authorization");
                        }
                    })
                    .catch(function(error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Unsuccessful authorization',
                            text: 'Incorrect credentials!',
                        });
                    });
            }
        })
    })
    row.append(idCell, buildingIdCell, messageCell, timeCell, typeCell, editButtonCell, deleteButtonCell)
    return row;
}

function populateTable(tabId, data) {
    const tableBody = document.querySelector('#' + tabId + ' table tbody');
    tableBody.innerHTML = '';
    data.forEach(function (item) {
        let row ;
        switch (tabId) {
            case 'tab1':
                row = createCompanyRow(item);
                break;
            case 'tab2':
                row = createRealtorRow(item);
                break;
            case 'tab3':
                row = createTenantRow(item);
                break;
            case 'tab4':
                row = createBuildingRow(item);
                break;
            case 'tab5':
                row = createSubscriptionTypeRow(item)
                break;
            case 'tab6':
                row = createSubscriptionRow(item)
                break;
            case 'tab7':
                row = createWarningRow(item)
                break;
        }
        tableBody.appendChild(row);
    });
}

function openTab(tabId) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(function(content) {
        content.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';

    tabButtons.forEach(function(button) {
        button.classList.remove('active');
    });
    document.querySelector('[data-tab="' + tabId + '"]').classList.add('active');
}


document.addEventListener("DOMContentLoaded", function () {
    tabButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');
            let url;
            switch (tabId) {
                case 'tab1':
                    url = 'http://127.0.0.1:8088/companies';
                    break;
                case 'tab2':
                    url = 'http://127.0.0.1:8088/realtors';
                    break;
                case 'tab3':
                    url = 'http://127.0.0.1:8088/tenants';
                    break;
                case 'tab4':
                    url = 'http://127.0.0.1:8088/buildings';
                    break;
                case 'tab5':
                    url = 'http://127.0.0.1:8088/subscriptionTypes';
                    break;
                case 'tab6':
                    url = 'http://127.0.0.1:8088/subscriptions';
                    break;
                case 'tab7':
                    url = 'http://127.0.0.1:8088/warnings';
                    break;
            }

            fetchDataAndPopulateTable(url, tabId);
            openTab(tabId);
        });
    });
    const event = new Event('click');
    tabButtons[0].dispatchEvent(event);
    // Відкрити першу вкладку за замовчуванням
    openTab('tab1');
});

addCompanyButton.addEventListener("click", function (event) {
    const companyEmail = document.getElementById("companyEmail")
    const companyName = document.getElementById("companyName")
    const companyPassword = document.getElementById("companyPassword")
    event.preventDefault()
    fetch("http://127.0.0.1:8088/companies", {
        headers: {
            "Content-Type": "application/json", "Authorization": authToken
        }, method: "POST", body: JSON.stringify({
            email: companyEmail.value,
            name: companyName.value,
            password: companyPassword.value
        })
    })
        .then(function (response) {
            if (response.ok) {
                Swal.fire({
                    icon: 'success', title: 'Компанія була успішно додана', showConfirmButton: false, timer: 1500
                })
                const backButton = document.getElementById("backButton")
                const event = new Event('click');
                backButton.dispatchEvent(event)
                fetchDataAndPopulateTable("http://127.0.0.1:8088/companies", "tab1")

            } else {
                throw new Error("Unsuccessful authorization");
            }
        })

        .catch(function (error) {
            Swal.fire({
                icon: 'error', title: 'Unsuccessful authorization', text: 'Incorrect credentials!',
            });
        });
});

addCompanyLabel.addEventListener("click", function (event) {
    event.preventDefault()
    const companyTable = document.getElementById("companyTable")
    companyTable.style.display = 'none'

    const addCompanyForm = document.getElementById("addCompanyForm")
    addCompanyForm.style.display = 'block'

    const companyLabel = document.getElementById("companyLabel")
    companyLabel.innerHTML = '<button id="backButton">Назад</button> <h3>Додавання нової компанії</h3>'
    const backButton = document.getElementById("backButton")
    backButton.addEventListener("click", function(event2) {
        event2.preventDefault()
        companyTable.style.display = "block"
        addCompanyForm.style.display = "none"
        companyLabel.innerHTML = '<h3>Компанії</h3>'
        event.target.style.display = 'block'
    })
    event.target.style.display = 'none'
});

addRealtorButton.addEventListener("click", function (event) {
    const realtorEmail = document.getElementById("realtorEmail")
    const realtorName = document.getElementById("realtorName")
    const realtorPassword = document.getElementById("realtorPassword")
    const realtorCompanyId = document.getElementById("realtorCompanyId")
    const realtorPhone = document.getElementById("realtorPhone")
    event.preventDefault()
    fetch("http://127.0.0.1:8088/realtors", {
        headers: {
            "Content-Type": "application/json", "Authorization": authToken
        }, method: "POST", body: JSON.stringify({
            email: realtorEmail.value,
            name: realtorName.value,
            password: realtorPassword.value,
            company: {
                id: realtorCompanyId.value
            },
            phone: realtorPhone.value,
            photo: realtorImage.src
        })
    })
        .then(function (response) {
            if (response.ok) {
                Swal.fire({
                    icon: 'success', title: 'Рієлтор був успішно доданий', showConfirmButton: false, timer: 1500
                })
                const backButton = document.getElementById("backButton")
                const event = new Event('click');
                backButton.dispatchEvent(event)
                fetchDataAndPopulateTable("http://127.0.0.1:8088/realtors", "tab2")
            } else {
                throw new Error("Unsuccessful authorization");
            }
        })

        .catch(function (error) {
            Swal.fire({
                icon: 'error', title: 'Unsuccessful authorization', text: 'Incorrect credentials!',
            });
        });
});

addRealtorLabel.addEventListener("click", function (event) {
    event.preventDefault()
    const realtorTable = document.getElementById("realtorTable")
    realtorTable.style.display = 'none'

    const addRealtorForm = document.getElementById("addRealtorForm")
    addRealtorForm.style.display = 'block'

    const realtorLabel = document.getElementById("realtorLabel")
    realtorLabel.innerHTML = '<button id="backButton">Назад</button> <h3>Додавання нового рієлтора</h3>'
    const backButton = document.getElementById("backButton")
    event.target.style.display = 'none'
    backButton.addEventListener("click", function(event2) {
        event2.preventDefault()
        realtorTable.style.display = "block"
        addRealtorForm.style.display = "none"
        realtorLabel.innerHTML = '<h3>Рієлтори</h3>'
        event.target.style.display = 'block'
        realtorImage.style.display = 'none'
        realtorPhoto.value = ""
    })

});

realtorPhoto.addEventListener('change', function(event) {
    event.preventDefault()
    const file = event.target.files[0];
    const storageRef = ref(storage, 'images');
    const imageRef = ref(storageRef, 'realtor' + file.name);
    uploadBytes(imageRef, file)
        .then(snapshot => {
            getDownloadURL(snapshot.ref)
                .then(downloadURL => {
                    realtorImage.src = downloadURL
                })
                .catch(error => {
                    console.error('Помилка отримання посилання на зображення:', error);
                });
        })
        .catch(error => {
            console.error('Помилка завантаження зображення:', error);
        });
});

addTenantButton.addEventListener("click", function (event) {
    const tenantEmail = document.getElementById("tenantEmail")
    const tenantName = document.getElementById("tenantName")
    const tenantPassword = document.getElementById("tenantPassword")
    const tenantPhone = document.getElementById("tenantPhone")
    event.preventDefault()
    fetch("http://127.0.0.1:8088/tenants", {
        headers: {
            "Content-Type": "application/json", "Authorization": authToken
        }, method: "POST", body: JSON.stringify({
            email: tenantEmail.value,
            name: tenantName.value,
            password: tenantPassword.value,
            phone: tenantPhone.value,
            photo: tenantImage.src
        })
    })
        .then(function (response) {
            if (response.ok) {
                Swal.fire({
                    icon: 'success', title: 'Орендар був успішно доданий', showConfirmButton: false, timer: 1500
                })
                const backButton = document.getElementById("backButton")
                const event = new Event('click');
                backButton.dispatchEvent(event)
                fetchDataAndPopulateTable("http://127.0.0.1:8088/tenants", "tab3")
            } else {
                throw new Error("Unsuccessful authorization");
            }
        })

        .catch(function (error) {
            Swal.fire({
                icon: 'error', title: 'Unsuccessful authorization', text: 'Incorrect credentials!',
            });
        });
});

addTenantLabel.addEventListener("click", function (event) {
    event.preventDefault()
    const tenantTable = document.getElementById("tenantTable")
    tenantTable.style.display = 'none'

    const addTenantForm = document.getElementById("addTenantForm")
    addTenantForm.style.display = 'block'

    const tenantLabel = document.getElementById("tenantLabel")
    tenantLabel.innerHTML = '<button id="backButton">Назад</button> <h3>Додавання нового рієлтора</h3>'
    const backButton = document.getElementById("backButton")
    event.target.style.display = 'none'
    backButton.addEventListener("click", function(event2) {
        event2.preventDefault()
        tenantTable.style.display = "block"
        addTenantForm.style.display = "none"
        tenantLabel.innerHTML = '<h3>Орендарі</h3>'
        event.target.style.display = 'block'
        tenantImage.style.display = 'none'
        tenantPhoto.value = ""
    })

});

tenantPhoto.addEventListener('change', function(event) {
    event.preventDefault()
    const file = event.target.files[0];
    const storageRef = ref(storage, 'images');
    const imageRef = ref(storageRef, 'tenant' + file.name);
    uploadBytes(imageRef, file)
        .then(snapshot => {
            getDownloadURL(snapshot.ref)
                .then(downloadURL => {
                    tenantImage.src = downloadURL
                })
                .catch(error => {
                    console.error('Помилка отримання посилання на зображення:', error);
                });
        })
        .catch(error => {
            console.error('Помилка завантаження зображення:', error);
        });
});

addBuildingButton.addEventListener("click", function (event) {
    const buildingRealtorId = document.getElementById("buildingRealtorId")
    const buildingTenantId = document.getElementById("buildingTenantId")
    const buildingType = document.getElementById("buildingType")
    const buildingSquare = document.getElementById("buildingSquare")
    const buildingName = document.getElementById("buildingName")
    const buildingPrice = document.getElementById("buildingPrice")
    const buildingIsPetAllowed = document.getElementById("buildingIsPetAllowed")
    const buildingDescription = document.getElementById("buildingDescription")
    const buildingCategory = document.getElementById("buildingCategory")
    const buildingCity = document.getElementById("buildingCity")
    const buildingAddress = document.getElementById("buildingAddress")
    event.preventDefault()
    const tenant = buildingTenantId.value === "" ? null : {id: buildingTenantId.value}
    const isLeased = tenant !== null
    fetch("http://127.0.0.1:8088/buildings", {
        headers: {
            "Content-Type": "application/json", "Authorization": authToken
        }, method: "POST", body: JSON.stringify({
            realtor: {
                id: buildingRealtorId.value
            },
            tenant : tenant,
            type: buildingType.value,
            square: buildingSquare.value,
            name: buildingName.value,
            price: buildingPrice.value,
            isPetAllowed: buildingIsPetAllowed.checked,
            photo: buildingImage.src,
            description: buildingDescription.value,
            isLeased : isLeased,
            category: buildingCategory.value,
            city: buildingCity.value,
            address: buildingAddress.value
        })
    })
        .then(function (response) {
            if (response.ok) {
                Swal.fire({
                    icon: 'success', title: 'Приміщення було успішно додано', showConfirmButton: false, timer: 1500
                })
                const backButton = document.getElementById("backButton")
                const event = new Event('click');
                backButton.dispatchEvent(event)
                fetchDataAndPopulateTable("http://127.0.0.1:8088/buildings", "tab4")
            } else {
                throw new Error("Unsuccessful authorization");
            }
        })

        .catch(function (error) {
            Swal.fire({
                icon: 'error', title: 'Unsuccessful authorization', text: 'Incorrect credentials!',
            });
        });
});

addBuildingLabel.addEventListener("click", function (event) {
    event.preventDefault()
    const buildingTable = document.getElementById("buildingTable")
    buildingTable.style.display = 'none'

    const addBuildingForm = document.getElementById("addBuildingForm")
    addBuildingForm.style.display = 'block'

    const buildingLabel = document.getElementById("buildingLabel")
    buildingLabel.innerHTML = '<button id="backButton">Назад</button> <h3>Додавання нового приміщення</h3>'
    const backButton = document.getElementById("backButton")
    event.target.style.display = 'none'
    backButton.addEventListener("click", function(event2) {
        event2.preventDefault()
        buildingTable.style.display = "block"
        addBuildingForm.style.display = "none"
        buildingLabel.innerHTML = '<h3>Приміщення</h3>'
        event.target.style.display = 'block'
        buildingImage.style.display = 'none'
        buildingPhoto.value = ""
    })

});

buildingPhoto.addEventListener('change', function(event) {
    event.preventDefault()
    // Отримати вибраний файл
    const file = event.target.files[0];
    const storageRef = ref(storage, 'images');
    const imageRef = ref(storageRef, 'building' + file.name);
    uploadBytes(imageRef, file)
        .then(snapshot => {
            // Отримайте посилання на завантажене зображення
            getDownloadURL(snapshot.ref)
                .then(downloadURL => {
                    buildingImage.src = downloadURL
                })
                .catch(error => {
                    console.error('Помилка отримання посилання на зображення:', error);
                });
        })
        .catch(error => {
            console.error('Помилка завантаження зображення:', error);
        });
});

addSubscriptionTypeButton.addEventListener("click", function (event) {
    const subscriptionTypeName = document.getElementById("subscriptionTypeName")
    const subscriptionTypePrice = document.getElementById("subscriptionTypePrice")
    const subscriptionTypeTerm = document.getElementById("subscriptionTypeTerm")
    event.preventDefault()
    fetch("http://127.0.0.1:8088/subscriptionTypes", {
        headers: {
            "Content-Type": "application/json", "Authorization": authToken
        }, method: "POST", body: JSON.stringify({
            name: subscriptionTypeName.value,
            price: subscriptionTypePrice.value,
            term: subscriptionTypeTerm.value
        })
    })
        .then(function (response) {
            if (response.ok) {
                Swal.fire({
                    icon: 'success', title: 'Новий тип підписки було успішно додано', showConfirmButton: false, timer: 1500
                })
                const backButton = document.getElementById("backButton")
                const event = new Event('click');
                backButton.dispatchEvent(event)
                fetchDataAndPopulateTable("http://127.0.0.1:8088/subscriptionTypes", "tab5")
            } else {
                throw new Error("Unsuccessful authorization");
            }
        })

        .catch(function (error) {
            Swal.fire({
                icon: 'error', title: 'Unsuccessful authorization', text: 'Incorrect credentials!',
            });
        });
});

addSubscriptionTypeLabel.addEventListener("click", function (event) {
    event.preventDefault()
    const subscriptionTypeTable = document.getElementById("subscriptionTypeTable")
    subscriptionTypeTable.style.display = 'none'

    const addSubscriptionTypeForm = document.getElementById("addSubscriptionTypeForm")
    addSubscriptionTypeForm.style.display = 'block'

    const subscriptionTypeLabel = document.getElementById("subscriptionTypeLabel")
    subscriptionTypeLabel.innerHTML = '<button id="backButton">Назад</button> <h3>Додавання нового типу підписки</h3>'
    const backButton = document.getElementById("backButton")
    event.target.style.display = 'none'
    backButton.addEventListener("click", function(event2) {
        event2.preventDefault()
        subscriptionTypeTable.style.display = "block"
        addSubscriptionTypeForm.style.display = "none"
        subscriptionTypeLabel.innerHTML = '<h3>Типи підписок</h3>'
        event.target.style.display = 'block'
    })
});

addSubscriptionButton.addEventListener("click", function (event) {
    const subscriptionCompanyId = document.getElementById("subscriptionCompanyId")
    const subscriptionStartDate = document.getElementById("subscriptionStartDate")
    const subscriptionEndDate = document.getElementById("subscriptionEndDate")
    const subscriptionSubscriptionTypeId = document.getElementById("subscriptionSubscriptionTypeId")
    event.preventDefault()
    fetch("http://127.0.0.1:8088/subscriptions", {
        headers: {
            "Content-Type": "application/json", "Authorization": authToken
        }, method: "POST", body: JSON.stringify({
            company: {
                id: subscriptionCompanyId.value
            },
            subscriptionType: {
                id: subscriptionSubscriptionTypeId.value
            },
            startDate: subscriptionStartDate.value,
            endDate: subscriptionEndDate.value
        })
    })
        .then(function (response) {
            if (response.ok) {
                Swal.fire({
                    icon: 'success', title: 'Нову підписку було успішно додано', showConfirmButton: false, timer: 1500
                })
                const backButton = document.getElementById("backButton")
                const event = new Event('click');
                backButton.dispatchEvent(event)
                fetchDataAndPopulateTable("http://127.0.0.1:8088/subscriptions", "tab6")
            } else {
                throw new Error("Unsuccessful authorization");
            }
        })

        .catch(function (error) {
            Swal.fire({
                icon: 'error', title: 'Unsuccessful authorization', text: 'Incorrect credentials!',
            });
        });
});

addSubscriptionLabel.addEventListener("click", function (event) {
    event.preventDefault()
    const subscriptionTable = document.getElementById("subscriptionTable")
    subscriptionTable.style.display = 'none'

    const addSubscriptionForm = document.getElementById("addSubscriptionForm")
    addSubscriptionForm.style.display = 'block'

    const subscriptionLabel = document.getElementById("subscriptionLabel")
    subscriptionLabel.innerHTML = '<button id="backButton">Назад</button> <h3>Додавання нової підписки</h3>'
    const backButton = document.getElementById("backButton")
    event.target.style.display = 'none'
    backButton.addEventListener("click", function(event2) {
        event2.preventDefault()
        subscriptionTable.style.display = "block"
        addSubscriptionForm.style.display = "none"
        subscriptionLabel.innerHTML = '<h3>Підписки</h3>'
        event.target.style.display = 'block'
    })
});

addWarningButton.addEventListener("click", function (event) {
    const warningBuildingId = document.getElementById("warningBuildingId")
    const warningMessage = document.getElementById("warningMessage")
    const warningTime = document.getElementById("warningTime")
    const warningType = document.getElementById("warningType")
    event.preventDefault()
    fetch("http://127.0.0.1:8088/warnings", {
        headers: {
            "Content-Type": "application/json", "Authorization": authToken
        }, method: "POST", body: JSON.stringify({
            building: {
                id: warningBuildingId.value
            },
            message: warningMessage.value,
            time: warningTime.value,
            type: warningType.value
        })
    })
        .then(function (response) {
            if (response.ok) {
                Swal.fire({
                    icon: 'success', title: 'Нову підписку було успішно додано', showConfirmButton: false, timer: 1500
                })
                const backButton = document.getElementById("backButton")
                const event = new Event('click');
                backButton.dispatchEvent(event)
                fetchDataAndPopulateTable("http://127.0.0.1:8088/warnings", "tab7")
            } else {
                throw new Error("Unsuccessful authorization");
            }
        })

        .catch(function (error) {
            Swal.fire({
                icon: 'error', title: 'Unsuccessful authorization', text: 'Incorrect credentials!',
            });
        });
});

addWarningLabel.addEventListener("click", function (event) {
    event.preventDefault()
    const warningTable = document.getElementById("warningTable")
    warningTable.style.display = 'none'

    const addWarningForm = document.getElementById("addWarningForm")
    addWarningForm.style.display = 'block'

    const warningLabel = document.getElementById("warningLabel")
    warningLabel.innerHTML = '<button id="backButton">Назад</button> <h3>Додавання нового попередження</h3>'
    const backButton = document.getElementById("backButton")
    event.target.style.display = 'none'
    backButton.addEventListener("click", function(event2) {
        event2.preventDefault()
        warningTable.style.display = "block"
        addWarningForm.style.display = "none"
        warningLabel.innerHTML = '<h3>Попередження</h3>'
        event.target.style.display = 'block'
    })
});