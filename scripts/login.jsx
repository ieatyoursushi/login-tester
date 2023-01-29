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
        fetch('https://mail-verification.ieatyourshushi.repl.co/checkForSignIn', new User(emailSignIn.value.toLowerCase(), passwordSignIn.value))
            .then(data => data.json())
            .then(data => {
                console.log(data);
                loading.style.visibility = 'hidden';
                if (data) {
                    loginStatus.style.color = 'green';
                    loginStatus.innerText = 'User Exists';
                    let loginUser = new UserPageInstance(new User(emailSignIn.value.toLowerCase(), passwordSignIn.value));
                    loginUser.createUserPage();
                    roots = document.querySelectorAll('.root');
                    showPage(document.querySelectorAll(".root").length - 1);
                } else {
                    loginStatus.style.color = 'red';
                    loginStatus.innerText = 'Email or Passowrd incorrect';
                }
            }).catch(err => console.log(err))
    }
})

class UserPageInstance{
    constructor(user) {
        this.userObj = user;
        this.state = {
            loggedIn: true,
            loggedOut: false,
        }        
    }
    userPage() {
        return (
            <div className="sroot user-root">
                <div className="interface-main">
                    <h1>Welcome, {this.userObj.email}</h1>
                    <button onClick={this.destroyUserPage} id="log-out"> Log Out </button>
                </div>

            </div>
        );
    }
    //left off
    createUserPage() {
        ReactDOM.render(this.userPage(), document.getElementById('user-interface'));
    }
    destroyUserPage() {
        showPage(0);
        ReactDOM.render(null, document.getElementById('user-interface'));
    }
    
}
class First extends React.Component {
    render() {
        return <h1>Hello, {this.props.title}</h1>;
    }
}
//ReactDOM.render(<First name="reaction" title="mytitle" /> , document.body);      