let fieldCount = 0;

function addField() {
  fieldCount++;
  const newField = document.createElement("div");
  newField.innerHTML = `
    <label for="additionalField${fieldCount}">Thông tin thêm ${fieldCount}:</label>
    <input type="text" id="additionalField${fieldCount}" name="additionalField${fieldCount}">
    <button type="button" onclick="removeField(this)">Xóa</button>
  `;
  document.getElementById("additionalFields").appendChild(newField);
}

function removeField(button) {
  button.parentElement.remove();
}

document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;

    if (!emailPattern.test(email)) {
      alert("Email không hợp lệ");
      event.preventDefault();
    }

    if (!phonePattern.test(phone)) {
      alert("Số điện thoại không hợp lệ");
      event.preventDefault();
    }
  });

document.getElementById("email").addEventListener("input", function () {
  const email = this.value;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    this.setCustomValidity("Email không hợp lệ");
  } else {
    this.setCustomValidity("");
  }
});

document.getElementById("phone").addEventListener("input", function () {
  const phone = this.value;
  const phonePattern = /^\d{10}$/;
  if (!phonePattern.test(phone)) {
    this.setCustomValidity("Số điện thoại không hợp lệ");
  } else {
    this.setCustomValidity("");
  }
});

document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    const form = this;
    if (!form.checkValidity()) {
      event.preventDefault();
      alert("Vui lòng điền đầy đủ và chính xác thông tin.");
    }
  });
