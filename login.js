const emailSignIn = document.getElementById('emailDB');
const passwordSignIn = document.getElementById('passDB');
const loginStatus = document.getElementById('userMatchingStatus');
const databaseURL = 'https://mail-verification.ieatyourshushi.repl.co/checkForDuplicatesInDB';
let signInButton = document.getElementById('sign-in');
const loading = document.querySelector('.load');
class User {
    constructor(email, password) {
        this.method = 'POST';
        this.body = JSON.stringify({ email: email, password: password }),
        this.headers = { 'Content-Type': 'applications/json' }
    }
}
loading.style.visibility = 'hidden';
signInButton.addEventListener('click', function() {
    loginStatus.innerText = '';
 
    if (emailSignIn.value != '' && passwordSignIn != '') {
        loading.style.visibility = 'visible';
        console.log(this.id);
        fetch('https://mail-verification.ieatyourshushi.repl.co/checkForSignIn', new User(emailSignIn.value, passwordSignIn.value))
            .then(data => data.json())
            .then(data => {
                console.log(data);
                loading.style.visibility = 'hidden';
                if(data) {
                    loginStatus.style.color = 'green';
                    loginStatus.innerText = 'User Exists';
                } else {
                    loginStatus.style.color = 'red';
                    loginStatus.innerText = 'Email or Passowrd incorrect';
                }
            }).catch(err => console.log(err))
    }
})
