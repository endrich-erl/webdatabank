// Grab DOM Elements
const garbageForm = document.getElementById("wasteForm");
const garbageTypeInput = document.getElementById("garbageType");
const amountInput = document.getElementById("amount");
const resultTableBody = document.getElementById("resultTableBody");
const garbageChartElement = document.getElementById("garbageChart");

// Variables
let garbageChart;

// Event Listeners
document.getElementById("addGarbage").addEventListener("click", addGarbage);
document.addEventListener("DOMContentLoaded", () => {
    renderTable();
    updateChart();
});

// Function to add garbage entry
function addGarbage() {
    const garbageType = garbageTypeInput.value.trim();
    const amount = parseFloat(amountInput.value);

    if (!garbageType || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid garbage type and amount.");
        return;
    }

    const entries = JSON.parse(localStorage.getItem("garbageData")) || [];
    entries.push({ garbageType, amount });
    localStorage.setItem("garbageData", JSON.stringify(entries));

    garbageTypeInput.value = "";
    amountInput.value = "";

    renderTable();
    updateChart();
}

// Function to render the table
function renderTable() {
    const entries = JSON.parse(localStorage.getItem("garbageData")) || [];

    resultTableBody.innerHTML = "";

    entries.forEach((entry, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.garbageType}</td>
            <td>${entry.amount.toFixed(2)}</td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteEntry(${index})">Delete</button></td>
        `;

        resultTableBody.appendChild(row);
    });
}

// Function to delete an entry
function deleteEntry(index) {
    const entries = JSON.parse(localStorage.getItem("garbageData")) || [];
    entries.splice(index, 1);
    localStorage.setItem("garbageData", JSON.stringify(entries));

    renderTable();
    updateChart();
}

// Function to update the pie chart
function updateChart() {
    const entries = JSON.parse(localStorage.getItem("garbageData")) || [];

    const labels = [];
    const data = [];

    // Aggregate data for the chart
    entries.forEach((entry) => {
        const index = labels.indexOf(entry.garbageType);
        if (index === -1) {
            labels.push(entry.garbageType);
            data.push(entry.amount);
        } else {
            data[index] += entry.amount;
        }
    });

    // Destroy the existing chart instance if it exists
    if (garbageChart) {
        garbageChart.destroy();
    }

    // Create the pie chart with datalabels
    garbageChart = new Chart(garbageChartElement, {
        type: "pie",
        data: {
            labels,
            datasets: [
                {
                    data,
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                        "#FF9F40",
                    ],
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
                datalabels: {
                    color: "#fff",
                    font: {
                        weight: "bold",
                        size: 14,
                    },
                    formatter: (value, ctx) => {
                        const total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1) + "%";
                        const label = ctx.chart.data.labels[ctx.dataIndex];
                        return `${label}: ${percentage}`; // Show name and percentage
                    },
                },
            },
        },
        plugins: [ChartDataLabels],
    });
}
 
// Initialize
renderTable();
updateChart();
