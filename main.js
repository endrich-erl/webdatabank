// Load existing schedules from localStorage
document.addEventListener('DOMContentLoaded', () => {
  const scheduleBody = document.getElementById('schedule-body');
  const schedules = JSON.parse(localStorage.getItem('schedules')) || [];
  schedules.forEach((schedule, index) => {
    addRow(scheduleBody, schedule, index);
  });
});

function addRow(scheduleBody, schedule, index) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${schedule.name}</td>
    <td>${schedule.dayStart}</td>
    <td>${schedule.dayEnd}</td>
    <td>${schedule.timeStart}</td>
    <td>${schedule.timeEnd}</td>
    <td><button class="delete-btn btn-danger" data-index="${index}">Delete</button></td>
  `;
  scheduleBody.appendChild(row);

  // Add event listener for the delete button
  row.querySelector('.delete-btn').addEventListener('click', (e) => {
    const index = e.target.getAttribute('data-index');
    deleteRow(scheduleBody, index);
  });
}

function deleteRow(scheduleBody, index) {
  const schedules = JSON.parse(localStorage.getItem('schedules')) || [];
  schedules.splice(index, 1);
  localStorage.setItem('schedules', JSON.stringify(schedules));

  // Refresh the table
  scheduleBody.innerHTML = '';
  schedules.forEach((schedule, i) => {
    addRow(scheduleBody, schedule, i);
  });
}

document.getElementById('add-schedule').addEventListener('click', () => {
  const name = document.getElementById('name').value;
  const dayStart = document.getElementById('daystart').value;
  const dayEnd = document.getElementById('dayend').value;
  const timeStart = document.getElementById('timestart').value;
  const timeEnd = document.getElementById('timeend').value;

  if (name && dayStart && dayEnd && timeStart && timeEnd) {
    const schedule = { name, dayStart, dayEnd, timeStart, timeEnd };
    const scheduleBody = document.getElementById('schedule-body');

    const schedules = JSON.parse(localStorage.getItem('schedules')) || [];
    schedules.push(schedule);
    localStorage.setItem('schedules', JSON.stringify(schedules));

    addRow(scheduleBody, schedule, schedules.length - 1);

    // Reset the form
    document.getElementById('form-col').reset();
  } else {
    alert('Please fill out all fields!');
  }
});
