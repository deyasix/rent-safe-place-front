const loginButton = document.getElementById("loginButton")
const login = document.getElementById("login")
const password = document.getElementById("password")

loginButton.addEventListener("click", function (event) {
    event.preventDefault()
    const credentials = btoa(`${login.value}:${password.value}`);
    const authHeader = `Basic ${credentials}`;
    localStorage.setItem('adminAuth', authHeader);
    const authToken = localStorage.getItem("adminAuth")
    fetch("http://127.0.0.1:8088/companies", {
        headers: {
            "Content-Type": "application/json", "Authorization": authToken
        }
    })
        .then(function (response) {
            if (response.status !== 401) {
                return (response.json());
            } else {
                localStorage.removeItem("adminAuth")
                throw new Error("Unsuccessful authorization");
            }
        }).then(function (data) {
            window.location.href = "index.html"
    })

        .catch(function (error) {
            Swal.fire({
                icon: 'error', title: 'Unsuccessful authorization', text: 'Incorrect credentials!',
            });
        });
});