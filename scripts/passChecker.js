let passwordChecker = document.getElementById("passwordChecker");
let passwordInput = document.getElementById("passIn");

function visualConditional(conditional) {
    if (conditional) {
        return '✔️';
    } else {
        return '❌';
    }
}

const regexSets = {
    specialCharacters: new RegExp('[^a-zA-Z0-9]'),
    lowercase: new RegExp('[a-z]'),
    uppercase: new RegExp('[A-Z]'),
    integers: new RegExp('[0-9]'),
    letters: new RegExp('[a-zA-z]')
}
let passwordInterval
passwordInput.addEventListener('focusin', () => {
    passwordInterval = setInterval(() => {
        passwordChecker.innerHTML = `8 Characters [${visualConditional(passwordInput.value.length >= 8)}]   Special character: [${visualConditional(regexSets.specialCharacters.test(passwordInput.value))}] Contains letter: [${visualConditional(regexSets.letters.test(passwordInput.value))}] Contains number: [${visualConditional(regexSets.integers.test(passwordInput.value))}]`
    }, 50)
})
passwordInput.addEventListener('focusout', () => {
    if (passwordInterval !== null) {
        clearInterval(passwordInterval);
        passwordChecker.innerHTML = '';
    }
})
export {regexSets };
export default visualConditional;