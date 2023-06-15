document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.getElementById("registerForm");
    const emailInput = document.getElementById("email");
    const nameInput = document.getElementById("name");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const email = emailInput.value;
        const name = nameInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (confirmPassword !== password) {
            Swal.fire({
                icon: 'error',
                title: i18next.t('register_repeat_password_failure')
            })
            return
        }

        const requestData = {
            email: email,
            name: name,
            password: password
        };

        fetch("http://127.0.0.1:8088/companies/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        })
            .then(function(response) {
                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: i18next.t('register_success')
                    }).then(function() {
                        window.location.href = 'login_company.html';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: i18next.t('register_failure')
                    })
                }
            })
    });
});
