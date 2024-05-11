const url = 'https://12d0099a-1529-4de2-9468-c224649003b1-00-187mkm0yvrntp.janeway.replit.dev:3000';
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
    document.getElementById("number").innerText = "Registered Users: " + data.AmountOfUsers;
})
