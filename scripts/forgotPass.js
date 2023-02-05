const forgotPassword = document.getElementById('forgot');
const _roots = document.querySelectorAll('.root');
const fEmailIn = document.getElementById('fEmailIn');
const emailSubmit = document.getElementById('fEmailSubmit');
const forgotVerify = document.getElementById('fVerify');
const forgotVerifyIn = document.getElementById('fVerificationIn');
const newPasswordInput= document.getElementById('newPasswordIn');
const newPasswordSubmit = document.getElementById('newPasswordSubmit');
const imgLoad = document.getElementById('forgotLoad');
const statusPar = document.getElementById('sd');

imgLoad.style.visibility = 'hidden';
/*
create react component based off email sent from the backend to re-create
password and destroy said component once the user successfully changes password.
First possible use of websockets
*/
function sendEmailCode(options) {
    return new Promise((resolve, reject) => {
        fetch('https://mail-verification.ieatyourshushi.repl.co/verificationCode/send', options)
            .then(response => response.json()).then((data) => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
    })
}
 
function showPage(index) {
    _roots.forEach(root => {
        root.classList.add("invis");
    });
    _roots[index].classList.remove("invis");
}
forgotPassword.addEventListener('click', function() {
    console.log(_roots);
    showPage(4);
})

let verificationCheckPoint = false;
emailSubmit.addEventListener('click', function() {
    if(fEmailIn.value != '') {
        imgLoad.style.visibility = 'visible';
        statusPar.innerText = '';
        emailInDB(fEmailIn.value.toLowerCase()).then(emailExists => {
            if(emailExists) {
                emailVerification(fEmailIn.value.toLowerCase()).then(code => {
                    showPage(5);
                    verificationChecker(code.verificationCode);
                    statusPar.innerText = "";
                })
            } else {
                //left off here
                statusPar.innerText = "Email not found";
            }
            imgLoad.style.visibility = 'hidden';
        })
         
    }
})
function verificationChecker(verification_code) {
    forgotVerify.addEventListener('click', function() {
        if(forgotVerifyIn.value === verification_code && !verificationCheckPoint) {
            console.log("change ur password checkpoint");
            verificationCheckPoint = true;
            showPage(6);
            activateChangePassword();
        }
    });
    setInterval(function() {
        if(forgotVerifyIn.value === verification_code && !verificationCheckPoint) {
            forgotVerify.innerHTML = "✓";
        } else {
            forgotVerify.innerHTML = "verify";
        }
    }, 100)
}
function activateChangePassword() {
    newPasswordSubmit.addEventListener('click', function() {
        if(newPasswordInput.value != '' && newPasswordInput.value.length >= 8) {
            changeUserPassword(new newPass(fEmailIn.value.toLowerCase(), newPasswordInput.value)).then(status => {
                console.log(status);
                if(status) {
                    showPage(7);
                } else {
 
                }
            });
        }
    })
}
function changeUserPassword(passwordObj) {
    return new Promise((resolve, reject) => {
        fetch('https://Mail-verification.ieatyourshushi.repl.co/changePassword', passwordObj)
        .then(status => status.json())
        .then(status => {
            //if status is successful
            resolve(status);
        }).catch(err => console.log(err))
    })
}
async function emailInDB(email) {
    return new Promise((resolve, reject) => {
        fetch('https://Mail-Verification.ieatyourshushi.repl.co/checkForDuplicatesInDB', new Options(email))
        .then(data => data.json())
        .then(data => {console.log(!data); resolve(!data.emailNotStored)})
        .catch(err => reject(err));
    })
}
async function emailVerification(email) {
    return new Promise((resolve, reject) => {
        fetch('https://Mail-Verification.ieatyourshushi.repl.co/verificationCode/send', new Options(email))
        .then(data => data.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
}
function Options(email) {
    this.method = 'POST',
    this.headers = { 'Content-Type': 'applications/json' },
    this.body = JSON.stringify(email);
}
function newPass(email, pass) {
    this.method = 'POST',
    this.headers = {'Content-Type': 'applications/json'},
    this.body = JSON.stringify({email: email, new_password: pass})
}
document.getElementById('exit2').addEventListener('click', function() {
    showPage(0);
})