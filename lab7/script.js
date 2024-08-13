let chart;

function fetchData(crypto, days) {
  fetch(
    `https://api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=usd&days=${days}`
  )
    .then((response) => response.json())
    .then((data) => {
      const formattedData = data.prices.map((d) => ({
        x: new Date(d[0]).toLocaleDateString(),
        y: d[1],
      }));
      createChart(formattedData);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function createChart(data) {
  const ctx = document.getElementById("myChart").getContext("2d");
  if (chart) {
    chart.destroy();
  }
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((d) => d.x),
      datasets: [
        {
          label: "Giá USD",
          data: data.map((d) => d.y),
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: false,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return `$${context.raw}`;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Date",
          },
        },
        y: {
          title: {
            display: true,
            text: "Price (USD)",
          },
          beginAtZero: true,
        },
      },
    },
  });
}

document.getElementById("cryptoSelect").addEventListener("change", function () {
  const selectedCrypto = this.value;
  const selectedDays = document.getElementById("timeSelect").value;
  fetchData(selectedCrypto, selectedDays);
});

document.getElementById("timeSelect").addEventListener("change", function () {
  const selectedCrypto = document.getElementById("cryptoSelect").value;
  const selectedDays = this.value;
  fetchData(selectedCrypto, selectedDays);
});

// Lấy dữ liệu ban đầu cho Bitcoin trong 30 ngày
fetchData("bitcoin", 30);
