const emailSignIn = document.getElementById('emailDB');
const passwordSignIn = document.getElementById('passDB');
const loginStatus = document.getElementById('userMatchingStatus');

const databaseURL =  `https://12d0099a-1529-4de2-9468-c224649003b1-00-187mkm0yvrntp.janeway.replit.dev:3000/checkForDuplicatesInDB`;
let signInButton = document.getElementById('sign-in');
const loading = document.querySelector('.load');
let roots = document.querySelectorAll('.root');
class User {
    constructor(email, password, username) {
        this.method = 'POST';
        this.body = JSON.stringify({ email: email, password: password }),
        this.headers = { 'Content-Type': 'applications/json' }
        this.email = email;
        this.pass = password;
        this.username = username;
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
        //console.log(this.id);
        fetch('https://12d0099a-1529-4de2-9468-c224649003b1-00-187mkm0yvrntp.janeway.replit.dev:3000/checkForSignIn', new User(emailSignIn.value.toLowerCase(), passwordSignIn.value))
            .then(data => data.json())
            .then(data => {
                //console.log(data);
                loading.style.visibility = 'hidden';
                if (data.matchStatus) {
                    loginStatus.style.color = 'green';
                    loginStatus.innerText = 'User Exists';
                    let loginUser = new UserPageInstance(new User(emailSignIn.value.toLowerCase(), passwordSignIn.value, data.username));
                    loginUser.createUserPage();
                    roots = document.querySelectorAll('.root');
                    showPage(document.querySelectorAll(".root").length - 1);
                    loginUser.getMailingListValue(document.getElementById("onEmailingList"));
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
        this.state = {
            loggedIn: true,
            loggedOut: false,
        }
    }
    userPage() {
        const divStyle = {
            display: 'flex',
            alignItems: 'center',
        };
        const settingStyle = {
            marginRight: '10px',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
        }
        const inputStyle = {
            display: 'flex',
            marginBottom: '20px',
            
        }
        return (
            <div className="sroot user-root">
                <div className="interface-main">
                    <header style={divStyle} >
                        <h1 id="usernameTitle">Welcome, {this.userObj.username}</h1>
                        <button style={{ marginLeft: '10px' }} onClick={this.destroyUserPage} id="log-out"> Log Out </button>
                    </header>
                    <h2> Create/Update Username: </h2>
                    <div style={inputStyle}>
                        <input type="text" id="createUsername" />
                        <button id="usernameSubmit" onClick={() => this.updateUsername(document.getElementById("createUsername").value)}> update </button>
                    </div>
                    <p className="usernameChangeStatus invis"> </p>
                    <div style={{display: 'flex', marginBotton: '20px', alignItems: 'center',}}>
                        <p> Want to be on our mailing list? (projects updates and such, coming soon): </p>
                        <input type="checkbox" id="onEmailingList" onChange={() => this.updateMailingList(document.getElementById("createUsername").value, document.getElementById("onEmailingList").checked )} />
                    </div>


                </div>

            </div>
        );
    }
    sendUsernameToBackend(_username, email) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: _username, email: this.userObj.email }),
        }
        return new Promise((resolve, reject) => {
            fetch('https://12d0099a-1529-4de2-9468-c224649003b1-00-187mkm0yvrntp.janeway.replit.dev:3000/updateUsername', options)
                .then(data => data.json())
                .then(data => resolve(data))
                .catch(err => console.log(err));
        })

    }
    getMailingListValue(input) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'applications/json',
            },
            body: JSON.stringify({onMailingList: null, email: this.userObj.email, type:'get'})
        }  
        fetch('https://12d0099a-1529-4de2-9468-c224649003b1-00-187mkm0yvrntp.janeway.replit.dev:3000/updateMailingList', options)
                .then(data => data.json())
                .then(data => {
                    input.checked = data;  
                }).catch(err => console.log(err));
        
    }
    updateMailingList(email, toggle) {
        console.log(toggle);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'applications/json',
            },
            body: JSON.stringify({onMailingList: toggle, email: this.userObj.email, type:'post'})
        }
        
        return new Promise((resolve, reject) => {
            fetch('https://12d0099a-1529-4de2-9468-c224649003b1-00-187mkm0yvrntp.janeway.replit.dev:3000/updateMailingList', options)
                .then(data => data.json())
                .then(data => resolve(data))
                .catch(err => console.log(err));
        })
    }
    updateUsername(_username) {
        let usernameStatus = document.querySelector(".usernameChangeStatus");
        usernameStatus.classList.add("invis");
        let username = _username.replace(/\s/g, '');
        if (username.length >= 4 && username.length <= 30) {
            this.sendUsernameToBackend(username).then(status => {
                if (status) {
                    document.getElementById("usernameTitle").innerHTML = "Welcome, " + username.toLowerCase();
                    usernameStatus.classList.remove("invis");
                    usernameStatus.style.color = "green";
                    usernameStatus.innerHTML = "username successfully changed";
                } else {
                    console.log("username already exists");
                    usernameStatus.classList.remove("invis");
                    usernameStatus.innerHTML = "username already exists";
                    usernameStatus.style.color = "red";
                }
            })
        } else {
            if (username.length < 4) {
                usernameStatus.classList.remove("invis");
                usernameStatus.innerHTML = "Username too short (4 characters min)";
                usernameStatus.style.color = "red";
            } else if (username.length > 30) {
                usernameStatus.classList.remove("invis");
                usernameStatus.innerHTML = "Userame too long (30 characters max)";
                usernameStatus.style.color = "red";
            } else {
                usernameStatus.classList.remove("invis");
                usernameStatus.innerHTML = "Somethig went wrong";
                usernameStatus.style.color = "red";
            }
        }
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