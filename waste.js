document.addEventListener("DOMContentLoaded", function () {
    const addGarbageButton = document.getElementById("addGarbage");
    const resultTableBody = document.getElementById("resultTableBody");
    const garbageChartElement = document.getElementById("garbageChart");

    let garbageChart;
    let entryCount = 0;

    // Load saved data from localStorage on page load
    loadTableData();
    updateChart();

    // Event listener for the "Add Garbage" button
    addGarbageButton.addEventListener("click", function () {
        const garbageTypeInput = document.getElementById("garbageType");
        const amountInput = document.getElementById("amount");

        const garbageType = garbageTypeInput.value.trim();
        const amount = parseFloat(amountInput.value.trim());

        if (garbageType && amount && !isNaN(amount) && amount > 0) {
            entryCount++;

            // Create a new entry object
            const entry = {
                id: Date.now(), // Unique ID for the entry
                garbageType,
                amount,
            };

            // Add entry to the table and save to localStorage
            addTableRow(entry);
            saveEntryToLocalStorage(entry);

            // Clear the input fields
            garbageTypeInput.value = "";
            amountInput.value = "";

            // Update the chart
            updateChart();
        } else {
            alert("Please enter valid garbage details.");
        }
    });

    // Function to add a row to the table
    function addTableRow(entry) {
        const row = document.createElement("tr");
        row.dataset.id = entry.id;

        row.innerHTML = `
            <td>${++entryCount}</td>
            <td>${entry.garbageType}</td>
            <td>${entry.amount}</td>
            <td>
                <button class="btn btn-danger btn-sm remove-button">Remove</button>
            </td>
        `;

        // Append the row to the table
        resultTableBody.appendChild(row);

        // Add functionality to the remove button
        row.querySelector(".remove-button").addEventListener("click", function () {
            removeTableRow(entry.id, row);
        });
    }

    // Function to remove a row from the table
    function removeTableRow(entryId, rowElement) {
        rowElement.remove();
        removeEntryFromLocalStorage(entryId);
        updateEntryNumbers();
        updateChart();
    }

    // Function to update entry numbers
    function updateEntryNumbers() {
        const rows = resultTableBody.querySelectorAll("tr");
        entryCount = 0;
        rows.forEach((row) => {
            entryCount++;
            row.querySelector("td:first-child").textContent = entryCount;
        });
    }

    // Function to save an entry to localStorage
    function saveEntryToLocalStorage(entry) {
        const entries = JSON.parse(localStorage.getItem("garbageData")) || [];
        entries.push(entry);
        localStorage.setItem("garbageData", JSON.stringify(entries));
    }

    // Function to remove an entry from localStorage
    function removeEntryFromLocalStorage(entryId) {
        let entries = JSON.parse(localStorage.getItem("garbageData")) || [];
        entries = entries.filter((entry) => entry.id !== entryId);
        localStorage.setItem("garbageData", JSON.stringify(entries));
    }

    // Function to load table data from localStorage
    function loadTableData() {
        const entries = JSON.parse(localStorage.getItem("garbageData")) || [];
        entries.forEach((entry) => {
            addTableRow(entry);
        });
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

        // Create the pie chart
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
                },
            },
        });
    }
});
