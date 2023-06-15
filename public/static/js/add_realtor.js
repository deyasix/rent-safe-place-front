const addRealtorButton = document.getElementById("addRealtorButton");
const email = document.getElementById("email")
const password = document.getElementById("password")
const phone = document.getElementById("phone")
const name = document.getElementById("name")
const confirmPassword = document.getElementById("confirmPassword")


addRealtorButton.addEventListener("click", function (event) {
    event.preventDefault()
    const authToken = localStorage.getItem('auth');
    if (confirmPassword.value !== password.value) {
        Swal.fire({
            icon: 'error',
            title: i18next.t('register_repeat_password_failure')
        });
        return;
    }
    fetch("http://127.0.0.1:8088/companies/realtors", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": authToken
        }, method: "POST", body: JSON.stringify({
            email: email.value,
            password: password.value,
            name: name.value,
            phone: phone.value
        })
    })
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error();
            }
        }).then(function(data) {
        console.log(data)
        Swal.fire({
            icon: 'success',
            title: i18next.t('add_realtor_success')
        }).then(function() {
            window.location.href = 'realtors_page.html';
        });
    })
        .catch(function(error) {
            Swal.fire({
                icon: 'error',
                title: i18next.t('save_failure')
            });
        }
    )
});