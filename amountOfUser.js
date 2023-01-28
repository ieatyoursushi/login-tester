const url = 'https://mail-verification.ieatyourshushi.repl.co';
function fetchUserAmount() {
    return new Promise((resolve, reject) => {
        fetch(url + "/amountOfUsers").then(data => data.json())
        .then(data => {
            resolve(data);
        }).catch(err => console.log(err));
    })
}
fetchUserAmount().then(data => {
    console.log(data);
    document.getElementById("number").innerText = "Amount of registered users: " + data.AmountOfUsers;
})