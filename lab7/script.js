document.addEventListener("DOMContentLoaded", () => {
  const coinSelect = document.getElementById("coinSelect");
  const daysSelect = document.getElementById("daysSelect");
  const updateButton = document.getElementById("updateButton");
  const chartContainer = document.getElementById("chart");
  const tooltip = document.getElementById("tooltip");

  async function fetchData(coin, days) {
    const apiUrl = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=${days}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);
    return data;
  }

  function prepareData(data) {
    return data.prices.map((price) => ({
      date: new Date(price[0]),
      value: price[1],
    }));
  }

  function averageSample(data, interval) {
    const sampledData = [];
    for (let i = 0; i < data.length; i += interval) {
      const chunk = data.slice(i, i + interval);
      const avgValue =
        chunk.reduce((sum, d) => sum + d.value, 0) / chunk.length;
      sampledData.push({ date: chunk[0].date, value: avgValue });
    }
    return sampledData;
  }

  function drawChart(data) {
    chartContainer.innerHTML = ""; // Xóa biểu đồ cũ

    const margin = { top: 20, right: 30, bottom: 30, left: 60 };
    const width = 1000 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, width]);

    const yMin = d3.min(data, (d) => d.value);
    const yMax = d3.max(data, (d) => d.value);
    const yMid = (yMin + yMax) / 2;

    const y = d3
      .scaleLinear()
      .domain([yMin - (yMid - yMin), yMax])
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.value));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#77E4C8")
      .attr("stroke-width", 3)
      .attr("d", line);

    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.date))
      .attr("cy", (d) => y(d.value))
      .attr("r", 5)
      .attr("fill", "#77E4C8")
      .on("mouseover", (event, d) => {
        tooltip.style.opacity = 1;
        tooltip.innerHTML = `<p>Date: <span>${d.date.toLocaleDateString()}</span></p>
        <p>Value: <span>$${d.value.toFixed(2)}</span></p>`;
        tooltip.style.left = `${event.pageX + 5}px`;
        tooltip.style.top = `${event.pageY - 28}px`;
      })
      .on("mouseout", () => {
        tooltip.style.opacity = 0;
      });
  }

  async function updateChart() {
    const coin = coinSelect.value;
    const days = daysSelect.value;
    const data = await fetchData(coin, days);
    const preparedData = prepareData(data);
    const sampledData = averageSample(preparedData, 10); // Lấy mẫu trung bình mỗi 10 điểm
    drawChart(sampledData);
  }

  updateButton.addEventListener("click", updateChart);

  // Hiển thị biểu đồ ban đầu
  updateChart();
});
