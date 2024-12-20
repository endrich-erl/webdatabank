document.addEventListener('DOMContentLoaded', function () {
    const eventForm = document.getElementById('eventForm');
    const participantForm = document.getElementById('participantForm');
    const eventListTable = document.getElementById('eventList').querySelector('tbody');
    const participantsTable = document.getElementById('participantsTable').querySelector('tbody');
    const selectEvent = document.getElementById('selectEvent');
    const barChartCtx = document.getElementById('barChart').getContext('2d');
    const ageBarChartCtx = document.getElementById('ageBarChart').getContext('2d');
    const genderPieChartCtx = document.getElementById('genderPieChart').getContext('2d');
    const notificationBox = document.getElementById('notificationBox');
    const notificationMessage = document.getElementById('notificationMessage');

    const EVENTS_KEY = 'events';
    const PARTICIPANTS_KEY = 'participants';

    const getData = (key) => JSON.parse(localStorage.getItem(key)) || [];
    const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    let events = getData(EVENTS_KEY);
    let participants = getData(PARTICIPANTS_KEY);

    let eventChart = null;
    let ageChart = null;
    let genderChart = null;

    const updateEventDropdown = () => {
        selectEvent.innerHTML = '<option value="">Select an event</option>';
        events.forEach(event => {
            const option = document.createElement('option');
            option.value = event.name;
            option.textContent = event.name;
            selectEvent.appendChild(option);
        });
    };

    const renderEvents = () => {
        eventListTable.innerHTML = '';
        events.forEach((event, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${event.name}</td>
                <td>${event.date}</td>
                <td>${event.time}</td>
                <td>${event.location}</td>
                <td><button class="btn btn-danger btn-sm delete-event" data-index="${index}">Delete</button></td>
            `;
            eventListTable.appendChild(row);
        });
    };

    const renderParticipants = () => {
        participantsTable.innerHTML = '';
        participants.forEach((participant, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${participant.name}</td>
                <td>${participant.age}</td>
                <td>${participant.gender}</td>
                <td>${participant.contact}</td>
                <td>${participant.gmail}</td>
                <td>${participant.sitio}</td>
                <td>${participant.event}</td>
                <td><button class="btn btn-danger btn-sm delete-participant" data-index="${index}">Delete</button></td>
            `;
            participantsTable.appendChild(row);
        });
    };

    const updateCharts = () => {
        if (eventChart) eventChart.destroy();
        if (ageChart) ageChart.destroy();
        if (genderChart) genderChart.destroy();

        const ageGroups = ['0-18', '19-35', '36-50', '51+'];
        const ageData = ageGroups.map((_, index) => {
            return participants.filter(participant => {
                const age = participant.age;
                return (
                    (index === 0 && age <= 18) ||
                    (index === 1 && age >= 19 && age <= 35) ||
                    (index === 2 && age >= 36 && age <= 50) ||
                    (index === 3 && age >= 51)
                );
            }).length;
        });

        ageChart = new Chart(ageBarChartCtx, {
            type: 'bar',
            data: {
                labels: ageGroups,
                datasets: [{
                    label: 'Number of Participants by Age Group',
                    data: ageData,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true }
                }
            }
        });

        const eventCounts = events.map(event => {
            return {
                name: event.name,
                count: participants.filter(participant => participant.event === event.name).length,
                date: event.date
            };
        });

        const eventNamesWithDates = eventCounts.map(e => `${e.name}\n(${e.date})`);
        const eventCountsData = eventCounts.map(e => e.count);

        eventChart = new Chart(barChartCtx, {
            type: 'bar',
            data: {
                labels: eventNamesWithDates,
                datasets: [{
                    label: 'Number of Participants by Event',
                    data: eventCountsData,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true }
                },
                scales: {
                    x: {
                        ticks: {
                            autoSkip: false,
                            maxRotation: 0,
                            minRotation: 0
                        }
                    }
                }
            }
        });

        // Remove "Other" category from gender counts
        const genderCounts = ['Male', 'Female'].map(gender => {
            return participants.filter(participant => participant.gender === gender).length;
        });

        genderChart = new Chart(genderPieChartCtx, {
            type: 'pie',
            data: {
                labels: ['Male', 'Female'],
                datasets: [{
                    label: 'Gender Distribution',
                    data: genderCounts,
                    backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                    borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return `${context.label}: ${context.raw} (${percentage}%)`;
                            }
                        }
                    },
                    datalabels: {
                        formatter: (value, context) => {
                            const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${percentage}%\n${context.chart.data.labels[context.dataIndex]}`;
                        },
                        color: '#000',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    };

    const checkEventsToday = () => {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in yyyy-mm-dd format
        const eventsToday = events.filter(event => event.date === today);

        if (eventsToday.length > 0) {
            const eventNames = eventsToday.map(event => `${event.name} at ${event.time}`).join(', ');
            notificationMessage.textContent = `${eventNames}`;
            notificationBox.style.display = 'block'; // Show notification box
        } else {
            notificationBox.style.display = 'none'; // Hide notification box if no events today
        }
    };

    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('eventName').value;
        const date = document.getElementById('eventDate').value;
        const time = document.getElementById('eventTime').value;
        const location = document.getElementById('eventLocation').value;

        events.push({ name, date, time, location });
        setData(EVENTS_KEY, events);
        renderEvents();
        updateEventDropdown();
        updateCharts();
        checkEventsToday(); // Update the "Scheduled for Today" section after adding a new event
        eventForm.reset();
    });

    participantForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('participantName').value;
        const age = parseInt(document.getElementById('participantAge').value, 10);
        const gender = document.getElementById('participantGender').value;
        const contact = document.getElementById('participantContact').value;
        const gmail = document.getElementById('participantGmail').value;
        const sitio = document.getElementById('participantSitio').value;
        const event = document.getElementById('selectEvent').value;

        participants.push({ name, age, gender, contact, gmail, sitio, event });
        setData(PARTICIPANTS_KEY, participants);
        renderParticipants();
        updateCharts();
        participantForm.reset();
    });

    eventListTable.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-event')) {
            const index = e.target.getAttribute('data-index');
            events.splice(index, 1);
            setData(EVENTS_KEY, events);
            renderEvents();
            updateEventDropdown();
            updateCharts();
            checkEventsToday(); // Recheck the "Scheduled for Today" after deletion
        }
    });

    participantsTable.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-participant')) {
            const index = e.target.getAttribute('data-index');
            participants.splice(index, 1);
            setData(PARTICIPANTS_KEY, participants);
            renderParticipants();
            updateCharts();
        }
    });

    renderEvents();
    renderParticipants();
    updateEventDropdown();
    updateCharts();
    checkEventsToday(); // Check if there are events scheduled for today
});
