let emailListener = document.getElementById("emailListener");
let emailInput = document.getElementById("emailIn");
let passInput = document.getElementById("passIn");
let backButton = document.getElementById("backButton");
let verifyListener = document.getElementById("verify");
let verificationInput = document.getElementById("verificationIn");
let resendListener = document.getElementById("resendList");
let createAccount = document.getElementById("createAcc");
let roots = document.querySelectorAll(".root");
let loadingImages = document.querySelectorAll(".loading");

function showPage(index) {
    roots.forEach(root => {
        root.classList.add("invis");
    });
    roots[index].classList.remove("invis");
}
export {showPage};
showPage(0);
addEventListener('load', () => {
    if (document.URL == "https://api-tester.ieatyourshushi.repl.co/#p2") {
        showPage(1);
    }
})
function Options(email) {
    this.method = 'POST',
        this.headers = { 'Content-Type': 'applications/json' },
        this.body = JSON.stringify(email);
}
function verifyEmail(options) {
    return new Promise((resolve, reject) => {
        fetch('https://mail-verification.ieatyourshushi.repl.co/verificationCode/send', options)
            .then(response => response.json()).then((data) => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
    })
}
createAccount.addEventListener('click', () => {
    showPage(1);
})
function characterInString(string, character) {
    for (let i = 0; i < string.length; i++) {
        if (string[i] === character) {
            return true;
        }
    }
    return false;
}
let createdPassword = '';
passInput.addEventListener('change', () => {
    createdPassword = passInput.value;
})
//________________________________________________________
function verifiedUser(email, pass) {
    this.method = 'POST',
        this.headers = { 'Content-Type': 'applications/json' },
        this.body = JSON.stringify({ email: email, password: pass });
}
function storeEmailInDatabase(email, password) {
    return new Promise((resolve, reject) => {
        try {
            fetch('https://mail-verification.ieatyourshushi.repl.co/LoginDB', new verifiedUser(email, password))
                .then((data) => data.json()).then((data) => {
                    console.log(data)
                    resolve(true);
                }).catch(err => console.log(err));
        } catch (err) {
            console.log(err);
            reject(false);
        }
    })
}
function checkForEmailDuplicates(email) {
    return new Promise((resolve, reject) => {
        try {
            fetch('https://mail-verification.ieatyourshushi.repl.co/checkForDuplicatesInDB', new Options(email))
                .then((data) => data.json())
                .then(data => {
                    resolve(data);
                })
        } catch (err) {
            console.log(err);
            reject(false);
        }
    })
}
import { regexSets } from '/passChecker.js';
import visualConditional from '/passChecker.js';
let emailVerified = false;
function isVerifiedUpdate(data) {
    setInterval(function(data) {

        if (verificationInput.value == data.verificationCode && !emailVerified) {
            verifyListener.innerHTML = '✔';
        } else {
            verifyListener.innerHTML = 'Verify';
        }

        //document.getElementById("codeChecker").innerHTML = `Verification Code: [${visualConditional(verificationInput.value == data.verificationCode && !emailVerified)}]`;
    }, 50, data);
}
loadingImages[0].style.visibility = "hidden";
loadingImages[1].style.visibility = "hidden";
const storedEmailStatus = document.getElementById('emailDatabaseStatus');
emailListener.addEventListener('click', () => {
    storedEmailStatus.innerText = '';
    if (document.getElementById('readPrivacy').checked && regexSets.integers.test(passInput.value) && regexSets.specialCharacters.test(passInput.value) && regexSets.letters.test(passInput.value) && passInput.value.length >= 8 && emailInput.value != '' && emailInput.value != null && characterInString(emailInput.value, "@")) {
        checkForEmailDuplicates(emailIn.value).then(data => {
            console.log(data)
            //if email already exists than 
            if (data.emailNotStored) {
                storedEmailStatus.innerText = '';
                loadingImages[0].style.visibility = "visible";
                verifyEmail(new Options(emailInput.value)).then(data => {
                    loadingImages[0].style.visibility = "hidden";
                    isVerifiedUpdate(data);
                    if (data.email !== false) {
                        let countDown = 120;
                        setInterval(() => { countDown = countDown - 1 }, 1000)
                        showPage(2);
                        let veriText = document.querySelector(".veriText");
                        veriText.innerHTML = `A 6-digit verification code has been sent to <span style="font-weight:bold"> ${data.email}. </span> This code will expire in 2 minutes`;
                        verifyListener.addEventListener('click', () => {
                            if (verificationInput.value == data.verificationCode && countDown > 0 && !emailVerified) {

                                console.log(countDown);
                                //do what log says
                                //console.log({email: data.email,password: createdPassword});
                                storeEmailInDatabase(data.email, createdPassword).then((isStored) => {
                                    //switch to false if error occurs 
                                    emailVerified = isStored;
                                    console.log("Email Adress Verified, store in sql db aswell as pass");
                                }).catch(err => { console.log(err); emailVerified = false });
                                if (!emailVerified) {
                                    emailVerified = true;
                                    console.log("Email Adress Verified, both email and password stored in database.");
                                    showPage(3);
                                }

                            } else {
                                if (countDown <= 0) {
                                    console.log("code expired");
                                    veriText.innerHTML = `A 6-digit verification code has been sent to <span style="font-weight:bold"> ${data.email}. </span> This code has expired.`;
                                    verifyListener.innerHTML = 'Verify';
                                }
                                else {
                                    console.log(countDown + " try again");
                                }
                            }
                        })
                        let resendCooldown = 0;
                        let intervalID = null;
                        resendListener.addEventListener('click', () => {
                            if (emailVerified)
                                return;
                            console.log(emailVerified);
                            console.log(resendCooldown <= 0);
                            if (resendCooldown <= 0) {
                                resendCooldown = 30;
                                loadingImages[1].style.visibility = "visible";
                                verifyEmail(new Options(data.email)).then(rData => {
                                    countDown = 120;
                                    veriText.innerHTML = `A 6-digit verification code has been sent to <span style="font-weight:bold"> ${data.email}. </span> This code will expire in 2 minutes`;
                                    loadingImages[1].style.visibility = "hidden";
                                    data.verificationCode = rData.verificationCode;
                                    if (intervalID !== null) {
                                        clearInterval(intervalID);
                                    }
                                    intervalID = setInterval(() => {
                                        resendCooldown--;
                                        resendListener.innerHTML = resendCooldown;
                                        if (resendCooldown <= 0) {
                                            clearInterval(intervalID);
                                            intervalID = null;
                                            resendListener.innerHTML = "Re-send";
                                        }
                                    }, 1000)
                                })
                            }
                        })
                    }
                    else {
                        passInput.value = "";
                        emailInput.value = "";
                    }
                })
            } else {
                storedEmailStatus.innerText = 'Email already exists';
                console.log('Email already exists');
            }
        });

    } else {
        passInput.value = "";
        emailInput.value = "";
    }
})
//promise function that checks of countdown is successful
function countedDown(seconds) {
    return new Promise((resolve, reject) => {
        var countdownTimer = setInterval(function() {
            seconds--;
            if (seconds > 0) {
                console.log(seconds);
            } else {
                clearInterval(countdownTimer);
                resolve(true);
            }
        }, 1000);
    }).catch(err => { console.log(err); reject(false) });
}
backButton.addEventListener('click', () => {
    location.href = 'https://api-tester.ieatyourshushi.repl.co/#p2';
    location.reload();
})
document.getElementById('exit').addEventListener('click', () => {
    location.href = 'https://api-tester.ieatyourshushi.repl.co';
})

