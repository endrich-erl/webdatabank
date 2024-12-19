 // Elements
        const tableBody = document.getElementById('progress-tbody');
        const form = document.getElementById('form');
        const saveBtn = document.getElementById('save-btn');
        const emptyText = document.getElementById('empty-text');

        // Load data from localStorage
        const loadData = () => {
            const data = JSON.parse(localStorage.getItem('progressData')) || [];
            data.forEach((item, index) => addRowToTable(item, index + 1));
            toggleEmptyText(data.length === 0);
        };

        // Save data to localStorage
        const saveData = (data) => {
            localStorage.setItem('progressData', JSON.stringify(data));
        };

        // Add a row to the table
        const addRowToTable = (item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index}</td>
                <td>${item.projectName}</td>
                <td>${item.projectStatus}</td>
                <td>${item.projectDate}</td>
                <td>${item.teamName}</td>
                <td><button class="btn btn-danger btn-sm delete-btn">Delete</button></td>
            `;

            // Attach delete event
            row.querySelector('.delete-btn').addEventListener('click', () => {
                deleteRow(index - 1);
            });

            tableBody.appendChild(row);
        };

        // Toggle empty text visibility
        const toggleEmptyText = (isEmpty) => {
            emptyText.style.display = isEmpty ? 'table-row' : 'none';
        };

        // Delete a row
        const deleteRow = (index) => {
            const data = JSON.parse(localStorage.getItem('progressData')) || [];
            data.splice(index, 1);
            saveData(data);
            refreshTable();
        };

        // Refresh table
        const refreshTable = () => {
            tableBody.innerHTML = '';
            loadData();
        };

        // Save button handler
        saveBtn.addEventListener('click', () => {
            const projectName = document.getElementById('project-name').value;
            const projectStatus = document.getElementById('project-status').value;
            const projectDate = document.getElementById('project-date').value;
            const teamName = document.getElementById('team-name').value;

            if (projectName && projectStatus && projectDate && teamName) {
                const newData = {
                    projectName,
                    projectStatus,
                    projectDate,
                    teamName,
                };

                const data = JSON.parse(localStorage.getItem('progressData')) || [];
                data.push(newData);
                saveData(data);
                refreshTable();

                // Reset form
                form.reset();
            }
        });

        // Initialize table on load
        window.onload = loadData;