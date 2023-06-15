const logoutButton = document.getElementById("logoutButton")

logoutButton.addEventListener("click", function (event) {
    event.preventDefault()
    Swal.fire({
        title: i18next.t('logout_approve'),
        showCloseButton: true,
        focusConfirm: false,
        showDenyButton: true,
        confirmButtonText: i18next.t('yes'),
        denyButtonText: i18next.t('no')
    }).then((result) => {
        if (result.isConfirmed) {
            const authToken = localStorage.getItem("auth")
            fetch("http://127.0.0.1:8088/companies/logout", {
                headers: {
                    "Content-Type": "application/json", "Authorization": authToken
                }, method: "POST"
            })
                .then(function (response) {
                    if (response.ok) {
                        localStorage.removeItem("auth")
                        window.location.href = "index.html"
                    } else {
                        throw new Error();
                    }
                })
                .catch(function (error) {
                    Swal.fire({
                        icon: 'error', title: i18next.t('logout_failure')
                    });
                });
        }
    })
});