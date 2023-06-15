document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:8088/realtors/login", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.responseText !== "") {
                const response = JSON.parse(xhr.responseText);
                const credentials = btoa(`${response.email}:${response.password}`);
                const authHeader = `Basic ${credentials}`;
                localStorage.setItem('auth', authHeader);
                Swal.fire({
                    icon: 'success',
                    title: i18next.t('login_success')
                }).then(function() {
                    window.location.href = 'home_realtor.html';
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: i18next.t('login_failure')
                })
            }
        }
    };
    xhr.send(JSON.stringify({
        email: email,
        password: password
    }));
});
