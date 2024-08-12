document.addEventListener("DOMContentLoaded", (event) => {
  const widgets = document.querySelectorAll(".widget");
  const dashboard = document.querySelector(".dashboard");
  const resetButton = document.getElementById("reset");
  const gridSize = 100;

  initStyle();
  addDragstartIntoWidget();
  dashboard.addEventListener("dragover", dragOver);
  dashboard.addEventListener("drop", drop);
  resetButton.addEventListener("click", resetLayout);
  loadLayout();

  function initStyle() {
    dashboard.style.width =
      Math.floor(dashboard.clientWidth / gridSize) * gridSize + "px";

    dashboard.style.height =
      Math.floor(dashboard.clientHeight / gridSize) * gridSize + "px";

    dashboard.style.gridTemplateColumns = `repeat(${Math.floor(
      dashboard.clientWidth / gridSize
    )}, 1fr)`;
    dashboard.style.gridTemplateRows = `repeat(${Math.floor(
      dashboard.clientHeight / gridSize
    )}, 1fr)`;
  }

  function addDragstartIntoWidget() {
    widgets.forEach((widget) => {
      widget.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", event.target.id);

        const cursorCoorOnWidget = {
          idWidget: event.target.id,
          width: event.target.clientWidth,
          height: event.target.clientHeight,
          x:
            Math.floor(
              (event.clientX - widget.getBoundingClientRect().left) / gridSize
            ) + 1,
          y:
            Math.floor(
              (event.clientY - widget.getBoundingClientRect().top) / gridSize
            ) + 1,
        };

        event.dataTransfer.setData(
          "cursorCoorOnWidget",
          JSON.stringify(cursorCoorOnWidget)
        );
      });
    });
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function drop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text");
    const draggableElement = document.getElementById(id);
    const cursorCoorOnWidget = JSON.parse(
      e.dataTransfer.getData("cursorCoorOnWidget")
    );
    const cursorCoorOnLayout = {
      x:
        Math.floor(
          (e.clientX - dashboard.getBoundingClientRect().left) / gridSize
        ) + 1,
      y:
        Math.floor(
          (e.clientY - dashboard.getBoundingClientRect().top) / gridSize
        ) + 1,
      xMax: dashboard.clientWidth / gridSize,
      yMax: dashboard.clientHeight / gridSize,
    };

    console.log(Math.floor(e.clientY));

    const isCanPutIn =
      isDropInSide(cursorCoorOnWidget, cursorCoorOnLayout) &&
      isFreeSpace(cursorCoorOnLayout, cursorCoorOnWidget);

    const widgetWidth = draggableElement.clientWidth / gridSize;
    const widgetHeight = draggableElement.clientHeight / gridSize;

    if (isCanPutIn) {
      putElementInLayout(
        cursorCoorOnWidget,
        cursorCoorOnLayout,
        widgetWidth,
        widgetHeight
      );

      saveLayout();
    }
  }

  function isDropInSide(cursorCoorOnWidget, cursorCoorOnLayout) {
    const totalWidthAfterDrop =
      cursorCoorOnLayout.x +
      (cursorCoorOnWidget.width / gridSize - cursorCoorOnWidget.x);

    const totalHeightAfterDrop =
      cursorCoorOnLayout.y +
      (cursorCoorOnWidget.height / gridSize - cursorCoorOnWidget.y);

    if (
      cursorCoorOnLayout.x < cursorCoorOnWidget.x ||
      cursorCoorOnLayout.y < cursorCoorOnWidget.y ||
      totalWidthAfterDrop > cursorCoorOnLayout.xMax ||
      totalHeightAfterDrop > cursorCoorOnLayout.yMax
    ) {
      return false;
    }
    return true;
  }

  function isFreeSpace(cursorCoorOnLayout, cursorCoorOnWidget) {
    const checkFlag = [];
    widgets.forEach((widget) => {
      if (widget.id === cursorCoorOnWidget.idWidget) {
        return;
      } else {
        const widgetArea = widget.style.gridArea
          .split("/")
          .map((item) =>
            item.includes("span")
              ? parseInt(item.split("span")[1].trim())
              : parseInt(item.trim())
          );

        const minRangeX = widgetArea[1] - 1;
        const maxRangeX = widgetArea[1] + widgetArea[3];
        const minRangeY = widgetArea[0] - 1;
        const maxRangeY = widgetArea[0] + widgetArea[2];

        const minPositionX = cursorCoorOnLayout.x - cursorCoorOnWidget.x + 1;
        const maxPositionX =
          cursorCoorOnLayout.x -
          cursorCoorOnWidget.x +
          cursorCoorOnWidget.width / gridSize;

        const minPositionY = cursorCoorOnLayout.y - cursorCoorOnWidget.y + 1;
        const maxPositionY =
          cursorCoorOnLayout.y -
          cursorCoorOnWidget.y +
          cursorCoorOnWidget.height / gridSize;

        const xPositionOutOfRange =
          minRangeX >= maxPositionX || minPositionX >= maxRangeX;
        const yPositionOutOfRange =
          minRangeY >= maxPositionY || minPositionY >= maxRangeY;

        if (!xPositionOutOfRange && !yPositionOutOfRange) {
          checkFlag.push(false);
        } else {
          checkFlag.push(true);
        }
      }
    });

    if (checkFlag.includes(false)) {
      return false;
    } else {
      return true;
    }
  }

  function putElementInLayout(
    cursorCoorOnWidget,
    cursorCoorOnLayout,
    widgetWidth,
    widgetHeight
  ) {
    console.log("putElementInLayout");
    const draggableElement = document.getElementById(
      cursorCoorOnWidget.idWidget
    );
    draggableElement.style.gridArea = `${
      cursorCoorOnLayout.y - cursorCoorOnWidget.y + 1
    } / ${
      cursorCoorOnLayout.x - cursorCoorOnWidget.x + 1
    } / span ${widgetHeight} / span ${widgetWidth}`;
  }

  function saveLayout() {
    const layout = [];
    widgets.forEach((widget) => {
      layout.push({
        id: widget.id,
        gridArea: widget.style.gridArea,
      });
    });
    localStorage.setItem("dashboardLayout", JSON.stringify(layout));
  }

  function loadLayout() {
    const layout = JSON.parse(localStorage.getItem("dashboardLayout"));
    if (layout) {
      layout.forEach((item) => {
        const widget = document.getElementById(item.id);
        widget.style.gridArea = item.gridArea;
        dashboard.appendChild(widget);
      });
    }
  }

  function resetLayout() {
    localStorage.removeItem("dashboardLayout");
    location.reload();
  }

  const calendarDays = document.getElementById("calendarDays");
  const monthYear = document.getElementById("monthYear");
  const prevMonth = document.getElementById("prevMonth");
  const nextMonth = document.getElementById("nextMonth");

  let currentDate = new Date();

  function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    monthYear.textContent = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    calendarDays.innerHTML = "";

    for (let i = 0; i < firstDay; i++) {
      calendarDays.innerHTML += "<div></div>";
    }

    for (let i = 1; i <= lastDate; i++) {
      calendarDays.innerHTML += `<div>${i}</div>`;
    }
  }

  prevMonth.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });

  nextMonth.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });

  renderCalendar(currentDate);

  const newsContainer = document.getElementById("newsContainer");

  // Dữ liệu tin tức mẫu
  const newsData = [
    {
      title: "Tin tức 1",
      description: "Mô tả ngắn gọn về tin tức 1.",
    },
    {
      title: "Tin tức 2",
      description: "Mô tả ngắn gọn về tin tức 2.",
    },
    {
      title: "Tin tức 3",
      description: "Mô tả ngắn gọn về tin tức 3.",
    },
  ];

  // Hàm hiển thị tin tức
  function displayNews(news) {
    newsContainer.innerHTML = "";
    news.forEach((item) => {
      const newsItem = document.createElement("div");
      newsItem.classList.add("news-item");
      newsItem.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            `;
      newsContainer.appendChild(newsItem);
    });
  }

  // Hiển thị tin tức mẫu
  displayNews(newsData);

  const apiKey = "684b77547c7b6534f56cf19151367908"; // Thay thế bằng API key của bạn
  const city = "Hanoi"; // Thay thế bằng tên thành phố của bạn
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=vi`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const location = document.getElementById("location");
      const temperature = document.getElementById("temperature");
      const description = document.getElementById("description");

      location.textContent = `Vị trí: ${data.name}, ${data.sys.country}`;
      temperature.textContent = `Nhiệt độ: ${data.main.temp}°C`;
      description.textContent = `Điều kiện: ${data.weather[0].description}`;
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });

  const addTaskButton = document.getElementById("addTask");
  const newTaskInput = document.getElementById("newTask");
  const taskList = document.getElementById("taskList");

  addTaskButton.addEventListener("click", addTask);
  newTaskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addTask();
    }
  });

  function addTask() {
    const taskText = newTaskInput.value.trim();
    if (taskText !== "") {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
                <span>${taskText}</span>
                <button onclick="removeTask(this)">Xóa</button>
            `;
      taskList.appendChild(listItem);
      newTaskInput.value = "";
    }
  }

  window.removeTask = function (button) {
    const listItem = button.parentElement;
    taskList.removeChild(listItem);
  };
});
