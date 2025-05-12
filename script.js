document.addEventListener('DOMContentLoaded', () => {
    // Initialize local storage if not exists
    initializeStorage();
    
    // Load saved data
    loadAllData();
});

function initializeStorage() {
    if (!localStorage.getItem('mdtData')) {
        localStorage.setItem('mdtData', JSON.stringify({
            citizens: [],
            vehicles: [],
            incidents: [],
            notes: []
        }));
    }
}

function loadAllData() {
    const data = JSON.parse(localStorage.getItem('mdtData')) || {};
    
    // Load citizens
    data.citizens.forEach(citizen => {
        displayCitizen(citizen);
    });
    
    // Load vehicles
    data.vehicles.forEach(vehicle => {
        displayVehicle(vehicle);
    });
    
    // Load incidents
    data.incidents.forEach(incident => {
        displayIncident(incident);
    });
    
    // Load notes
    data.notes.forEach(note => {
        displayNote(note);
    });
}

function toggleSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

function addCitizen() {
    const citizen = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        dob: document.getElementById('dob').value,
        licenseNumber: document.getElementById('licenseNumber').value,
        timestamp: new Date().toISOString()
    };
    
    saveCitizen(citizen);
    displayCitizen(citizen);
    clearForm('citizen-form');
}

function saveCitizen(citizen) {
    const data = JSON.parse(localStorage.getItem('mdtData'));
    data.citizens.push(citizen);
    localStorage.setItem('mdtData', JSON.stringify(data));
}

function displayCitizen(citizen) {
    const citizensSection = document.querySelector('#citizens .citizen-list');
    if (!citizensSection) return;
    
    const citizenElement = document.createElement('div');
    citizenElement.className = 'citizen-card';
    citizenElement.innerHTML = `
        <h3>${citizen.firstName} ${citizen.lastName}</h3>
        <p>DOB: ${citizen.dob}</p>
        <p>License: ${citizen.licenseNumber}</p>
        <p>Added: ${new Date(citizen.timestamp).toLocaleString()}</p>
    `;
    citizensSection.appendChild(citizenElement);
}

function addVehicle() {
    const vehicle = {
        plateNumber: document.getElementById('plateNumber').value,
        make: document.getElementById('make').value,
        model: document.getElementById('model').value,
        color: document.getElementById('color').value,
        timestamp: new Date().toISOString()
    };
    
    saveVehicle(vehicle);
    displayVehicle(vehicle);
    clearForm('vehicle-form');
}

function saveVehicle(vehicle) {
    const data = JSON.parse(localStorage.getItem('mdtData'));
    data.vehicles.push(vehicle);
    localStorage.setItem('mdtData', JSON.stringify(data));
}

function displayVehicle(vehicle) {
    const vehiclesSection = document.querySelector('#vehicles .vehicle-list');
    if (!vehiclesSection) return;
    
    const vehicleElement = document.createElement('div');
    vehicleElement.className = 'vehicle-card';
    vehicleElement.innerHTML = `
        <h3>${vehicle.make} ${vehicle.model}</h3>
        <p>Plate: ${vehicle.plateNumber}</p>
        <p>Color: ${vehicle.color}</p>
        <p>Added: ${new Date(vehicle.timestamp).toLocaleString()}</p>
    `;
    vehiclesSection.appendChild(vehicleElement);
}

function addIncident() {
    const incident = {
        type: document.getElementById('incidentType').value,
        location: document.getElementById('location').value,
        description: document.getElementById('description').value,
        timestamp: new Date().toISOString()
    };
    
    saveIncident(incident);
    displayIncident(incident);
    clearForm('incident-form');
}

function saveIncident(incident) {
    const data = JSON.parse(localStorage.getItem('mdtData'));
    data.incidents.push(incident);
    localStorage.setItem('mdtData', JSON.stringify(data));
}

function displayIncident(incident) {
    const incidentsSection = document.querySelector('#incidents .incident-list');
    if (!incidentsSection) return;
    
    const incidentElement = document.createElement('div');
    incidentElement.className = 'incident-card';
    incidentElement.innerHTML = `
        <h3>${incident.type}</h3>
        <p>Location: ${incident.location}</p>
        <p>Description: ${incident.description}</p>
        <p>Added: ${new Date(incident.timestamp).toLocaleString()}</p>
    `;
    incidentsSection.appendChild(incidentElement);
}

function addNote() {
    const note = {
        content: document.getElementById('noteContent').value,
        timestamp: new Date().toISOString()
    };
    
    saveNote(note);
    displayNote(note);
    clearForm('note-form');
}

function saveNote(note) {
    const data = JSON.parse(localStorage.getItem('mdtData'));
    data.notes.push(note);
    localStorage.setItem('mdtData', JSON.stringify(data));
}

function displayNote(note) {
    const notesSection = document.querySelector('#notes .note-list');
    if (!notesSection) return;
    
    const noteElement = document.createElement('div');
    noteElement.className = 'note-card';
    noteElement.innerHTML = `
        <p>${note.content}</p>
        <p class="timestamp">${new Date(note.timestamp).toLocaleString()}</p>
    `;
    notesSection.appendChild(noteElement);
}

function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

function searchCitizen() {
    const searchTerm = document.getElementById('citizenSearch').value.toLowerCase();
    const citizens = JSON.parse(localStorage.getItem('mdtData')).citizens;
    const results = citizens.filter(citizen => 
        citizen.firstName.toLowerCase().includes(searchTerm) ||
        citizen.lastName.toLowerCase().includes(searchTerm) ||
        citizen.licenseNumber.toLowerCase().includes(searchTerm)
    );
    
    displaySearchResults('citizens', results);
}

function searchVehicle() {
    const searchTerm = document.getElementById('vehicleSearch').value.toLowerCase();
    const vehicles = JSON.parse(localStorage.getItem('mdtData')).vehicles;
    const results = vehicles.filter(vehicle => 
        vehicle.plateNumber.toLowerCase().includes(searchTerm) ||
        vehicle.make.toLowerCase().includes(searchTerm) ||
        vehicle.model.toLowerCase().includes(searchTerm)
    );
    
    displaySearchResults('vehicles', results);
}

function displaySearchResults(sectionId, results) {
    const section = document.getElementById(sectionId);
    const list = section.querySelector('.list');
    if (!list) return;
    
    list.innerHTML = '';
    
    results.forEach(item => {
        const element = document.createElement('div');
        element.className = `${sectionId}-card`;
        element.innerHTML = `
            <h3>${item.make ? `${item.make} ${item.model}` : `${item.firstName} ${item.lastName}`}</h3>
            <p>${item.plateNumber ? `Plate: ${item.plateNumber}` : `License: ${item.licenseNumber}`}</p>
            <p>Added: ${new Date(item.timestamp).toLocaleString()}</p>
        `;
        list.appendChild(element);
    });
}
