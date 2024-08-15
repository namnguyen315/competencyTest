let checkFlag = {
  firstName: false,
  lastName: false,
  company: false,
  phone: [],
  email: [],
  address: [],
};
let phoneCount = 0;
let emailCount = 0;
let addressCount = 0;

document.getElementById("uploadText").addEventListener("click", function () {
  document.getElementById("fileInput").click();
});

document.getElementById("fileInput").addEventListener("change", uploadAvatar);

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const company = document.getElementById("company");

firstName.addEventListener("input", () => {
  validateFirstName(firstName.value);
  checkCondition();
});
firstName.addEventListener("blur", () => {
  validateFirstName(firstName.value);
  checkCondition();
});
lastName.addEventListener("input", () => {
  validateLastName(lastName.value);
  checkCondition();
});
lastName.addEventListener("blur", () => {
  validateLastName(lastName.value);
  checkCondition();
});
company.addEventListener("input", () => {
  validateCompany(company.value);
  checkCondition();
});
company.addEventListener("blur", () => {
  validateCompany(company.value);
  checkCondition();
});

const btnAddPhone = document.getElementById("btnAddPhone");
const btnAddEmail = document.getElementById("btnAddEmail");
const btnAddAddress = document.getElementById("btnAddAddress");

const phoneContainer = document.getElementById("phoneContainer");
const emailContainer = document.getElementById("emailContainer");
const addressContainer = document.getElementById("addressContainer");
const phoneLabels = [
  "di động",
  "nhà",
  "công ty",
  "trường học",
  "chính",
  "fax nhà riêng",
  "fax công ty",
  "máy nhắn tin",
  "khác",
];

const emailLabels = ["nhà", "công ty", "trường học", "iCloud", "khác"];

const addressLabels = ["nhà", "công ty", "trường học", "khác"];

btnAddPhone.addEventListener("click", () => {
  phoneCount++;
  checkFlag.phone[phoneCount - 1] = false;
  checkCondition();

  addContainer(phoneLabels, "phoneContainer", phoneCount);
});

btnAddEmail.addEventListener("click", () => {
  emailCount++;
  checkFlag.email[emailCount - 1] = false;
  addContainer(emailLabels, "emailContainer", emailCount);
});
btnAddAddress.addEventListener("click", () => {
  addressCount++;
  checkFlag.address[emailCount - 1] = false;
  addContainer(addressLabels, "addressContainer", addressCount);
});

function addContainer(labels, idContainer, count) {
  // Lấy tất cả các select hiện tại
  const set = {
    phoneContainer: "Điện thoại",
    emailContainer: "Email",
    addressContainer: "Address",
  };
  const selects = document.querySelectorAll(`#${idContainer} select`);

  const usedLabels = Array.from(selects).map((select) => select.value);
  const availableLabels = labels.filter((label) => !usedLabels.includes(label));
  const defaultLabel =
    availableLabels.length > 0 ? availableLabels[0] : labels[0];

  // Tạo phần tử input mới
  const newInput = document.createElement("input");
  newInput.type = "text";
  newInput.placeholder = set[idContainer];

  // Tạo phần tử select mới
  const newSelect = document.createElement("select");
  labels.forEach((label) => {
    const option = document.createElement("option");
    option.value = label;
    option.textContent = label;
    if (label === defaultLabel) {
      option.selected = true;
    }
    newSelect.appendChild(option);
  });

  const iconContainer = document.createElement("div");
  iconContainer.className = "icon remove";
  iconContainer.innerText = "-";

  const errorMessageContainer = document.createElement("p");

  // Tạo container cho input và select
  const inputContainer = document.createElement("div");
  const inputGroup = document.createElement("div");

  inputContainer.className = "inputContainer";
  inputGroup.className = "input-group";
  inputGroup.appendChild(iconContainer);
  inputGroup.appendChild(newSelect);
  inputGroup.appendChild(newInput);

  inputContainer.appendChild(inputGroup);
  inputContainer.className = count;
  inputContainer.appendChild(errorMessageContainer);
  iconContainer.addEventListener("click", () => {
    idContainer == "phoneContainer"
      ? (checkFlag.phone[inputContainer.className - 1] = "remove")
      : idContainer == "emailContainer"
      ? (checkFlag.email[inputContainer.className - 1] = "remove")
      : idContainer == "addressContainer"
      ? (checkFlag.address[inputContainer.className - 1] = "remove")
      : null;
    checkCondition();
    inputContainer.remove();
  });

  newInput.addEventListener("blur", () => {
    const result =
      idContainer == "phoneContainer"
        ? validatePhone(newInput.value, count)
        : idContainer == "emailContainer"
        ? validateEmail(newInput.value, count)
        : idContainer == "addressContainer"
        ? validateAddress(newInput, count)
        : true;
    if (typeof result != "boolean") {
      checkCondition();
      errorMessageContainer.style.display = "block";
      errorMessageContainer.innerText = result;
    } else {
      checkCondition();
      errorMessageContainer.style.display = "none";
    }
  });

  newInput.addEventListener("input", () => {
    const result =
      idContainer == "phoneContainer"
        ? validatePhone(newInput.value, count)
        : idContainer == "emailContainer"
        ? validateEmail(newInput.value, count)
        : idContainer == "addressContainer"
        ? validateAddress(newInput, count)
        : true;
    if (typeof result != "boolean") {
      checkCondition();
      errorMessageContainer.style.display = "block";
      errorMessageContainer.innerText = result;
    } else {
      checkCondition();
      errorMessageContainer.style.display = "none";
    }
  });
  // Lấy container chứa các input
  const addContainer = document.getElementById(idContainer);

  // Chèn input mới vào trước button
  addContainer.insertBefore(inputContainer, addContainer.firstChild);
}

function uploadAvatar(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("avatar").src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function validateFirstName(value) {
  const firstNameError = document.getElementById("firstNameError");
  if (value.length === 0) {
    checkFlag.firstName = false;
    firstNameError.style.display = "block";
    firstNameError.textContent = "Please enter your first name";
    return false;
  } else {
    checkFlag.firstName = value;
    firstNameError.style.display = "none";
    return true;
  }
}

function validateLastName(value) {
  const lastNameError = document.getElementById("lastNameError");
  if (value.length === 0) {
    checkFlag.lastName = false;
    lastNameError.style.display = "block";
    lastNameError.textContent = "Please enter your last name";
    return false;
  } else {
    checkFlag.lastName = value;
    lastNameError.style.display = "none";
    return true;
  }
}

function validateCompany(value) {
  const companyError = document.getElementById("companyError");
  checkFlag.company = false;
  if (value.length === 0) {
    companyError.style.display = "block";
    companyError.textContent = "Please enter your company";
    return false;
  } else {
    checkFlag.company = value;
    companyError.style.display = "none";
    return true;
  }
}

function validatePhone(value, count) {
  const phoneNumberRegex = /^\+[1-9]\d{1,14}$/;
  if (value.length === 0) {
    checkFlag.phone[count - 1] = false;
    return "Please enter your phone number";
  } else if (!phoneNumberRegex.test(value)) {
    checkFlag.phone[count - 1] = false;
    return "Please enter a valid phone number format.";
  } else {
    checkFlag.phone[count - 1] = value;
    return true;
  }
}

function validateEmail(value, count) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (value.length === 0) {
    checkFlag.email[count - 1] = false;
    return "Please enter your email";
  } else if (!emailRegex.test(value)) {
    checkFlag.email[count - 1] = false;
    return "Please enter a valid emails";
  } else {
    checkFlag.email[count - 1] = value;
    return true;
  }
}

function validateAddress(value) {
  const addressRegex = /^\d+\s[A-Za-z0-9\s.,'-]+$/;

  if (value.length === 0) {
    checkFlag.address[count - 1] = false;
    return "Please enter your address";
  } else if (!addressRegex.test(value)) {
    checkFlag.address[count - 1] = false;
    return "Please enter a valid address";
  } else {
    checkFlag.address[count - 1] = value;
    return true;
  }
}

const form = document.getElementById("contactForm");
const submitContactFornm = document.getElementById("submitContactFornm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Succesful!");
});

function checkCondition() {
  if (
    checkFlag.firstName == false ||
    checkFlag.lastName == false ||
    checkFlag.company == false ||
    checkFlag.phone.includes(false) ||
    checkFlag.email.includes(false) ||
    checkFlag.address.includes(false)
  ) {
    submitContactFornm.disabled = true;
    submitContactFornm.style.color = "rgb(87, 87, 87)";
  } else {
    submitContactFornm.disabled = false;
    submitContactFornm.style.color = "#0379e8";
  }
}
