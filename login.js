
const emailSignIn = document.getElementById('emailDB');
const passwordSignIn = document.getElementById('passDB');
const loginStatus = document.getElementById('userMatchingStatus');
const databaseURL = 'https://mail-verification.ieatyourshushi.repl.co/checkForDuplicatesInDB';
let signInButton = document.getElementById('sign-in');
const loading = document.querySelector('.load');
let roots = document.querySelectorAll('.root');
class User {
    constructor(email, password) {
        this.method = 'POST';
        this.body = JSON.stringify({ email: email, password: password }),
        this.headers = { 'Content-Type': 'applications/json' }
        this.email = email;
        this.pass = password;
    }
}
function showPage(index) {
    roots.forEach(root => {
        root.classList.add("invis");
    });
    roots[index].classList.remove("invis");
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
                    let loginUser = new UserPageInstance(new User(emailSignIn.value, passwordSignIn.value));
                    loginUser.createUserPage();
                    roots = document.querySelectorAll('.root');
                    showPage(document.querySelectorAll(".root").length -1);
                } else {
                    loginStatus.style.color = 'red';
                    loginStatus.innerText = 'Email or Passowrd incorrect';
                }
            }).catch(err => console.log(err))
    }
})
class UserPageInstance {
    constructor(user) {
        this.userObj = user;
    }
    addPage() {
        let root = document.createElement('div');
        root.classList.add('root');
        root.classList.add('user-root');
        return root;
    }
    createUserPage() {
        const userPage = this.addPage();
        let username = document.createElement('h1');
        username.innerHTML = `Welcome, ${this.userObj.email}`;
        userPage.append(username);
        let changePass = document.createElement('button');
        changePass.innerHTML = 'change password'
        
        document.body.append(userPage);
    }
    
}
 