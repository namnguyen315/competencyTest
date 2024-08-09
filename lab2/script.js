const listInputElement = document.querySelectorAll("#registrationForm input");

const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

username.addEventListener("input", () => {
  validateUsername(username.value);
});
email.addEventListener("input", () => {
  validateEmail(email.value);
});
password.addEventListener("input", () => {
  validatePassword(password.value);
});
confirmPassword.addEventListener("input", () => {
  validateConfirmPassword(password.value, confirmPassword.value);
});

document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    if (isValidated()) {
      alert("Đăng ký thành công!");
    }
  });

const isValidated = () => {
  return (
    validateUsername(username.value) &&
    validateEmail(email.value) &&
    validatePassword(password.value) &&
    validateConfirmPassword(password.value, confirmPassword.value)
  );
};

const validateUsername = (value) => {
  if (value.length === 0) {
    document.getElementById("usernameError").textContent =
      "Tên đăng nhập không được để trống.";
    return false;
  } else if (value.length < 3) {
    document.getElementById("usernameError").textContent =
      "Tên phải có ít nhất 3 ký tự.";
    return false;
  } else {
    document.getElementById("usernameError").textContent = "";
    return true;
  }
};

const validateEmail = (value) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (value.length === 0) {
    document.getElementById("emailError").textContent =
      "Email không được để trống.";
    return false;
  } else if (regex.test(value)) {
    document.getElementById("emailError").textContent = "";
    return true;
  } else {
    document.getElementById("emailError").textContent = "Email không hợp lệ.";
    return false;
  }
};

const validatePassword = (value) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  if (value.length === 0) {
    document.getElementById("passwordError").textContent =
      "Mật khẩu không được để trống.";
    return false;
  } else if (!regex.test(value)) {
    document.getElementById("passwordError").textContent =
      "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.";
    return false;
  } else {
    document.getElementById("passwordError").textContent = "";
    return true;
  }
};

const validateConfirmPassword = (password, value) => {
  if (value.length === 0) {
    document.getElementById("confirmPasswordError").textContent =
      "Xác nhận mật khẩu không được để trống.";
    return false;
  } else if (value !== password) {
    document.getElementById("confirmPasswordError").textContent =
      "Mật khẩu không khớp.";
    return false;
  } else {
    document.getElementById("confirmPasswordError").textContent = "";
    return true;
  }
};
