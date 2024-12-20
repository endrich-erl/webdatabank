// Select elements
const incidentDate = document.getElementById('incident-date');
const incidentName = document.getElementById('incident-name');
const incidentCase = document.getElementById('incident-case');
const otherInfo = document.getElementById('other-info');
const saveBtn = document.getElementById('save-btn');
const incidentTbody = document.getElementById('incident-tbody');
const emptyText = document.getElementById('empty-text');

// Load incidents from localStorage
const loadIncidents = () => {
    const incidents = JSON.parse(localStorage.getItem('incidents')) || [];
    incidents.forEach((incident, index) => {
        addIncidentToTable(incident, index);
    });
    toggleEmptyText(incidents.length);
};

// Save incident
const saveIncident = () => {
    const date = incidentDate.value;
    const name = incidentName.value;
    const caseInfo = incidentCase.value;
    const info = otherInfo.value;

    if (!date || !name || !caseInfo) {
        alert('Please fill in all required fields.');
        return;
    }

    const incident = { date, name, caseInfo, info };

    // Save to localStorage
    const incidents = JSON.parse(localStorage.getItem('incidents')) || [];
    incidents.push(incident);
    localStorage.setItem('incidents', JSON.stringify(incidents));

    // Add to table
    addIncidentToTable(incident, incidents.length - 1);

    // Clear form
    incidentDate.value = '';
    incidentName.value = '';
    incidentCase.value = '';
    otherInfo.value = '';

    toggleEmptyText(incidents.length);
};

// Add incident to table
const addIncidentToTable = (incident, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${incident.date}</td>
        <td>${incident.name}</td>
        <td>${incident.caseInfo}</td>
        <td>${incident.info}</td>
        <td><button class="btn btn-danger btn-sm" onclick="deleteIncident(${index})">Delete</button></td>
    `;
    incidentTbody.appendChild(row);
};
 
// Delete incident
const deleteIncident = (index) => {
    const incidents = JSON.parse(localStorage.getItem('incidents')) || [];
    incidents.splice(index, 1);
    localStorage.setItem('incidents', JSON.stringify(incidents));

    // Refresh table
    incidentTbody.innerHTML = '';
    loadIncidents();
};

// Toggle empty text visibility
const toggleEmptyText = (count) => {
    emptyText.style.display = count === 0 ? '' : 'none';
};

// Event listeners
saveBtn.addEventListener('click', saveIncident);

// Initial load
loadIncidents();
