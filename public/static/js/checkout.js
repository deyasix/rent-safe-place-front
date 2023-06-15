const now = new Date()
const authToken = localStorage.getItem('auth');
const money = language === 'uk' ? "UAH" : "USD"
const json_string = JSON.stringify(
    {"public_key":"sandbox_i4044675928","version":"3","action":"pay","amount":localStorage.getItem("value"),"currency":money,"description":"subscription payment","order_id":now.getFullYear() + now.getMonth() + now.getDay() + now.getHours() + now.getMinutes() + now.getSeconds()}
);
const data = btoa(json_string);
const sign_string = "sandbox_8eNUsqt3svtd3kg6DuYd5PCjR0lKtBDqmNtzGJzU" + data + "sandbox_8eNUsqt3svtd3kg6DuYd5PCjR0lKtBDqmNtzGJzU";
const signature = (CryptoJS.SHA1(sign_string).toString(CryptoJS.enc.Base64));


window.LiqPayCheckoutCallback = function() {
    LiqPayCheckout.init({
        data: data,
        signature: signature,
        embedTo: "#liqpay_checkout",
        language: language,
        mode: "embed"
    }).on("liqpay.callback", function(data){
        if (data.status === "success") {
            fetch("http://127.0.0.1:8088/companies/subscription", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authToken
                }, method: "POST", body: JSON.stringify({
                    subscriptionType: {
                        id: localStorage.getItem("orderType")
                    },
                    startDate: localStorage.getItem("startDate"),
                    endDate: localStorage.getItem("endDate")
                })})
                .then(function(response) {
                    if (response.ok) {
                        return response.json()
                    } else {
                        throw new Error();
                    }
                }).then(function(data) {
                localStorage.removeItem("orderType")
                localStorage.removeItem("startDate")
                localStorage.removeItem("endDate")
                localStorage.removeItem("value")
            })
                .catch(function(error) {
                    Swal.fire({
                        icon: 'error',
                        title: i18next.t('subscribe_failure')
                    });
                });
        }

    }).on("liqpay.ready", function(data){
    }).on("liqpay.close", function(data){

    });
}