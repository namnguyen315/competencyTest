document.addEventListener("DOMContentLoaded", (event) => {
  const widgets = document.querySelectorAll(".widget");
  const dashboard = document.querySelector(".dashboard");
  const resetButton = document.getElementById("reset");

  const gridSize = 100;
  initStyle();

  const cellWidth = gridSize;
  const cellHeight = gridSize;

  console.log(cellWidth, cellHeight);

  widgets.forEach((widget) => {
    widget.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", event.target.id);

      const cursorCoorOnWidget = {
        idWidget: event.target.id,
        width: event.target.clientWidth,
        height: event.target.clientHeight,
        x:
          Math.floor(
            (event.clientX - widget.getBoundingClientRect().left) / cellWidth
          ) + 1,
        y:
          Math.floor(
            (event.clientY - widget.getBoundingClientRect().top) / cellHeight
          ) + 1,
      };

      console.log(cursorCoorOnWidget);

      event.dataTransfer.setData(
        "cursorCoorOnWidget",
        JSON.stringify(cursorCoorOnWidget)
      );
    });
  });

  dashboard.addEventListener("dragover", dragOver);
  dashboard.addEventListener("drop", drop);

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
      layoutInfo: {
        cellWidth,
        cellHeight,
      },
      x: Math.floor(e.clientX / cellWidth) + 1,
      y: Math.floor(e.clientY / cellHeight) + 1,
      xMax: dashboard.clientWidth / cellWidth,
      yMax: dashboard.clientHeight / cellHeight,
    };
    console.log(e.clientX, e.clientY);

    console.log(cursorCoorOnLayout);
    console.log(dashboard.getBoundingClientRect().top);
    console.log(dashboard.clientHeight);

    const isCanPutIn =
      isDropInSide(cursorCoorOnWidget, cursorCoorOnLayout) &&
      isFreeSpace(cursorCoorOnLayout, cursorCoorOnWidget);

    const widgetWidth = draggableElement.clientWidth / cellWidth;
    const widgetHeight = draggableElement.clientHeight / cellHeight;

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

  function isDropInSide(cursorCoorOnWidget, cursorCoorOnLayout) {
    const totalWidthAfterDrop =
      cursorCoorOnLayout.x +
      (cursorCoorOnWidget.width / cursorCoorOnLayout.layoutInfo.cellWidth -
        cursorCoorOnWidget.x);

    const totalHeightAfterDrop =
      cursorCoorOnLayout.y +
      (cursorCoorOnWidget.height / cursorCoorOnLayout.layoutInfo.cellHeight -
        cursorCoorOnWidget.y);

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
          cursorCoorOnWidget.width / cursorCoorOnLayout.layoutInfo.cellWidth;

        const minPositionY = cursorCoorOnLayout.y - cursorCoorOnWidget.y + 1;
        const maxPositionY =
          cursorCoorOnLayout.y -
          cursorCoorOnWidget.y +
          cursorCoorOnWidget.height / cursorCoorOnLayout.layoutInfo.cellHeight;

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

  function initStyle() {
    dashboard.style.width =
      Math.floor(dashboard.clientWidth / gridSize) * gridSize + "px";

    dashboard.style.height =
      Math.floor(dashboard.clientHeight / gridSize) * gridSize + "px";

    dashboard.style.gridTemplateColumns = `repeat(${Math.floor(
      dashboard.clientHeight / gridSize
    )}, 1fr)`;
    dashboard.style.gridTemplateRows = `repeat(${Math.floor(
      dashboard.clientWidth / gridSize
    )}, 1fr)`;
  }

  resetButton.addEventListener("click", resetLayout);

  loadLayout();
});
