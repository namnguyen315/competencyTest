document.addEventListener("DOMContentLoaded", () => {
  const getUsernameForm = document.getElementById("getUsername");
  const usernameInput = document.getElementById("username");
  const usernameContainer = document.getElementById("usernameContainer");
  const windowChatContainer = document.getElementById("windowChatContainer");

  getUsernameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(usernameInput.value);
    if (usernameInput.value) {
      usernameContainer.style.display = "none";
      windowChatContainer.style.display = "flex";
      socket.emit("set username", usernameInput.value.trim());
      username.disabled = true;
    }
  });

  const socket = io();
  const form = document.getElementById("form");
  const input = document.getElementById("input");
  const messages = document.getElementById("messages");

  //   usernameInput.addEventListener("keypress", function (e) {
  //     if (e.key === "Enter" && usernameInput.value.trim() !== "") {
  //       socket.emit("set username", usernameInput.value.trim());
  //       usernameInput.disabled = true;
  //     }
  //   });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value) {
      socket.emit("chat message", input.value);
      input.value = "";
    }
  });

  socket.on("chat message", (data) => {
    const item = document.createElement("div");
    const message = document.createElement("p");
    item.appendChild(message);
    item.classList.add("messageContainer");
    message.classList.add("message");

    if (data.user == usernameInput.value.trim()) {
      item.classList.add("myMessage");
      message.textContent = `${data.msg}`;
    } else {
      message.innerHTML = `<p class="usernameClient">${data.user}</p> ${data.msg}`;
    }

    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  });

  socket.on("user connected", (username) => {
    const item = document.createElement("div");
    const connect = document.createElement("p");
    item.classList.add("connect");
    item.appendChild(connect);
    connect.classList.add("userConnected");
    connect.textContent = `${username} đã tham gia chat`;
    connect.style.fontStyle = "italic";
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  });

  socket.on("user disconnected", (username) => {
    const item = document.createElement("div");
    const connect = document.createElement("p");
    item.appendChild(connect);
    item.classList.add("connect");
    connect.classList.add("userDisconnected");
    connect.textContent = `${username} đã rời khỏi chat`;
    connect.style.fontStyle = "italic";
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  });
});
