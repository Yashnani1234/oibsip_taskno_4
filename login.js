const users = {};

const registrationUsername = document.getElementById("registrationUsername");
const registrationPassword = document.getElementById("registrationPassword");

const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");

const loginPage = document.getElementById("loginPage");
const homePage = document.getElementById("homePage");
const registrationPage = document.getElementById("registrationPage");

function generateRandomSalt() {
  const randomBytes = new Uint8Array(16);
  window.crypto.getRandomValues(randomBytes);
  return btoa(String.fromCharCode.apply(null, randomBytes));
}

function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  return crypto.subtle.digest("SHA-256", data).then((buffer) => {
    const hashArray = Array.from(new Uint8Array(buffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
  });
}

function verifyPassword(password, hashedPassword, salt) {
  return hashPassword(password, salt)
    .then(hashed => hashed === hashedPassword);
}

function registerUser() {
  const username = registrationUsername.value;
  const password = registrationPassword.value;

  if (username in users) {
    alert("Username already exists. Please choose a different one.");
  } else {
    const salt = generateRandomSalt();
    hashPassword(password, salt)
      .then(hashedPassword => {
        users[username] = { hashedPassword, salt };
        alert("Registration successful!");
        console.log(users);
        showLogin();
      })
      .catch(error => {
        console.error(error);
      });

    registrationUsername.value = "";
    registrationPassword.value = "";
  }
}

function loginUser() {
  const username = loginUsername.value;
  const password = loginPassword.value;

  if (username in users) {
    const { hashedPassword, salt } = users[username];
    verifyPassword(password, hashedPassword, salt)
      .then(isValid => {
        if (isValid) {
          loginPage.style.display = "none";
          homePage.style.display = "block";
        } else {
          alert("Incorrect username or password. Please try again.");
        }
      })
      .catch(error => {
        console.error(error);
        alert("An error occurred during login.");
      });
  } else {
    alert("Incorrect username or password. Please try again.");
  }

  loginUsername.value = "";
  loginPassword.value = "";
}

function showLogin() {
  registrationPage.style.display = "none";
  loginPage.style.display = "block";
}

function showRegistration() {
  loginPage.style.display = "none";
  registrationPage.style.display = "block";
}

function logoutUser() {
  loginUsername.value = "";
  loginPassword.value = "";
  homePage.style.display = "none";
  loginPage.style.display = "block";
}
