class MDT {
    constructor() {
        this.data = this.initializeStorage();
        this.initializeEventListeners();
        this.loadAllData();
    }

    initializeStorage() {
        const data = localStorage.getItem('mdtData');
        return data ? JSON.parse(data) : {
            citizens: [],
            vehicles: [],
            incidents: [],
            notes: [],
            agencies: {
                police: { color: '#0000FF', code: 'PD' },
                fire: { color: '#FF0000', code: 'FD' },
                ems: { color: '#00FF00', code: 'EMS' }
            }
        };
    }

    saveData() {
        localStorage.setItem('mdtData', JSON.stringify(this.data));
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupAgencySelector();
            this.setupSearchListeners();
            this.setupFormSubmissions();
        });
    }

    setupAgencySelector() {
        const agencySelect = document.getElementById('agencySelect');
        if (agencySelect) {
            agencySelect.addEventListener('change', () => {
                this.updateAgencyTheme(agencySelect.value);
            });
        }
    }

    updateAgencyTheme(agency) {
        const agencyData = this.data.agencies[agency];
        document.documentElement.style.setProperty('--agency-color', agencyData.color);
        document.documentElement.style.setProperty('--agency-code', agencyData.code);
    }

    setupSearchListeners() {
        const searchInputs = document.querySelectorAll('.search-bar input');
        searchInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const sectionId = e.target.closest('.search-bar').parentElement.id;
                this.search(sectionId, e.target.value);
            });
        });
    }

    setupFormSubmissions() {
        const forms = {
            'citizen-form': this.handleCitizenForm,
            'vehicle-form': this.handleVehicleForm,
            'incident-form': this.handleIncidentForm,
            'note-form': this.handleNoteForm
        };

        Object.entries(forms).forEach(([formId, handler]) => {
            const form = document.getElementById(formId);
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    handler.call(this);
                });
            }
        });
    }

    handleCitizenForm() {
        const citizen = this.createCitizenObject();
        this.saveCitizen(citizen);
        this.displayCitizen(citizen);
        this.clearForm('citizen-form');
    }

    createCitizenObject() {
        return {
            id: Date.now().toString(),
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            dob: document.getElementById('dob').value,
            licenseNumber: document.getElementById('licenseNumber').value,
            agency: document.getElementById('agencySelect').value,
            timestamp: new Date().toISOString()
        };
    }

    saveCitizen(citizen) {
        this.data.citizens.push(citizen);
        this.saveData();
    }

    displayCitizen(citizen) {
        const citizensSection = document.querySelector('#citizens .citizen-list');
        if (!citizensSection) return;

        const citizenElement = this.createCitizenCard(citizen);
        citizensSection.appendChild(citizenElement);
    }

    createCitizenCard(citizen) {
        const agencyData = this.data.agencies[citizen.agency];
        const element = document.createElement('div');
        element.className = 'citizen-card';
        element.innerHTML = `
            <div class="agency-badge" style="background-color: ${agencyData.color}">${agencyData.code}</div>
            <h3>${citizen.firstName} ${citizen.lastName}</h3>
            <p>DOB: ${citizen.dob}</p>
            <p>License: ${citizen.licenseNumber}</p>
            <p class="timestamp">${new Date(citizen.timestamp).toLocaleString()}</p>
            <div class="card-actions">
                <button onclick="mdt.editCitizen('${citizen.id}')">Edit</button>
                <button onclick="mdt.deleteCitizen('${citizen.id}')">Delete</button>
            </div>
        `;
        return element;
    }

    editCitizen(id) {
        const citizen = this.data.citizens.find(c => c.id === id);
        if (!citizen) return;

        // Populate form with existing data
        document.getElementById('firstName').value = citizen.firstName;
        document.getElementById('lastName').value = citizen.lastName;
        document.getElementById('dob').value = citizen.dob;
        document.getElementById('licenseNumber').value = citizen.licenseNumber;
        document.getElementById('agencySelect').value = citizen.agency;

        // Add edit mode flag
        document.getElementById('citizen-form').dataset.editing = id;
    }

    deleteCitizen(id) {
        this.data.citizens = this.data.citizens.filter(c => c.id !== id);
        this.saveData();
        this.refreshCitizensList();
    }

    refreshCitizensList() {
        const citizensSection = document.querySelector('#citizens .citizen-list');
        if (!citizensSection) return;

        citizensSection.innerHTML = '';
        this.data.citizens.forEach(citizen => {
            const citizenElement = this.createCitizenCard(citizen);
            citizensSection.appendChild(citizenElement);
        });
    }

    handleVehicleForm() {
        const vehicle = this.createVehicleObject();
        this.saveVehicle(vehicle);
        this.displayVehicle(vehicle);
        this.clearForm('vehicle-form');
    }

    createVehicleObject() {
        return {
            id: Date.now().toString(),
            plateNumber: document.getElementById('plateNumber').value,
            make: document.getElementById('make').value,
            model: document.getElementById('model').value,
            color: document.getElementById('color').value,
            agency: document.getElementById('agencySelect').value,
            timestamp: new Date().toISOString()
        };
    }

    saveVehicle(vehicle) {
        this.data.vehicles.push(vehicle);
        this.saveData();
    }

    displayVehicle(vehicle) {
        const vehiclesSection = document.querySelector('#vehicles .vehicle-list');
        if (!vehiclesSection) return;

        const vehicleElement = this.createVehicleCard(vehicle);
        vehiclesSection.appendChild(vehicleElement);
    }

    createVehicleCard(vehicle) {
        const agencyData = this.data.agencies[vehicle.agency];
        const element = document.createElement('div');
        element.className = 'vehicle-card';
        element.innerHTML = `
            <div class="agency-badge" style="background-color: ${agencyData.color}">${agencyData.code}</div>
            <h3>${vehicle.make} ${vehicle.model}</h3>
            <p>Plate: ${vehicle.plateNumber}</p>
            <p>Color: ${vehicle.color}</p>
            <p class="timestamp">${new Date(vehicle.timestamp).toLocaleString()}</p>
            <div class="card-actions">
                <button onclick="mdt.editVehicle('${vehicle.id}')">Edit</button>
                <button onclick="mdt.deleteVehicle('${vehicle.id}')">Delete</button>
            </div>
        `;
        return element;
    }

    editVehicle(id) {
        const vehicle = this.data.vehicles.find(v => v.id === id);
        if (!vehicle) return;

        document.getElementById('plateNumber').value = vehicle.plateNumber;
        document.getElementById('make').value = vehicle.make;
        document.getElementById('model').value = vehicle.model;
        document.getElementById('color').value = vehicle.color;
        document.getElementById('agencySelect').value = vehicle.agency;
        document.getElementById('vehicle-form').dataset.editing = id;
    }

    deleteVehicle(id) {
        this.data.vehicles = this.data.vehicles.filter(v => v.id !== id);
        this.saveData();
        this.refreshVehiclesList();
    }

    refreshVehiclesList() {
        const vehiclesSection = document.querySelector('#vehicles .vehicle-list');
        if (!vehiclesSection) return;

        vehiclesSection.innerHTML = '';
        this.data.vehicles.forEach(vehicle => {
            const vehicleElement = this.createVehicleCard(vehicle);
            vehiclesSection.appendChild(vehicleElement);
        });
    }

    handleIncidentForm() {
        const incident = this.createIncidentObject();
        this.saveIncident(incident);
        this.displayIncident(incident);
        this.clearForm('incident-form');
    }

    createIncidentObject() {
        return {
            id: Date.now().toString(),
            type: document.getElementById('incidentType').value,
            location: document.getElementById('location').value,
            description: document.getElementById('description').value,
            agency: document.getElementById('agencySelect').value,
            timestamp: new Date().toISOString()
        };
    }

    saveIncident(incident) {
        this.data.incidents.push(incident);
        this.saveData();
    }

    displayIncident(incident) {
        const incidentsSection = document.querySelector('#incidents .incident-list');
        if (!incidentsSection) return;

        const incidentElement = this.createIncidentCard(incident);
        incidentsSection.appendChild(incidentElement);
    }

    createIncidentCard(incident) {
        const agencyData = this.data.agencies[incident.agency];
        const element = document.createElement('div');
        element.className = 'incident-card';
        element.innerHTML = `
            <div class="agency-badge" style="background-color: ${agencyData.color}">${agencyData.code}</div>
            <h3>${incident.type}</h3>
            <p>Location: ${incident.location}</p>
            <p>Description: ${incident.description}</p>
            <p class="timestamp">${new Date(incident.timestamp).toLocaleString()}</p>
            <div class="card-actions">
                <button onclick="mdt.editIncident('${incident.id}')">Edit</button>
                <button onclick="mdt.deleteIncident('${incident.id}')">Delete</button>
            </div>
        `;
        return element;
    }

    editIncident(id) {
        const incident = this.data.incidents.find(i => i.id === id);
        if (!incident) return;

        document.getElementById('incidentType').value = incident.type;
        document.getElementById('location').value = incident.location;
        document.getElementById('description').value = incident.description;
        document.getElementById('agencySelect').value = incident.agency;
        document.getElementById('incident-form').dataset.editing = id;
    }

    deleteIncident(id) {
        this.data.incidents = this.data.incidents.filter(i => i.id !== id);
        this.saveData();
        this.refreshIncidentsList();
    }

    refreshIncidentsList() {
        const incidentsSection = document.querySelector('#incidents .incident-list');
        if (!incidentsSection) return;

        incidentsSection.innerHTML = '';
        this.data.incidents.forEach(incident => {
            const incidentElement = this.createIncidentCard(incident);
            incidentsSection.appendChild(incidentElement);
        });
    }

    handleNoteForm() {
        const note = this.createNoteObject();
        this.saveNote(note);
        this.displayNote(note);
        this.clearForm('note-form');
    }

    createNoteObject() {
        return {
            id: Date.now().toString(),
            content: document.getElementById('noteContent').value,
            agency: document.getElementById('agencySelect').value,
            timestamp: new Date().toISOString()
        };
    }

    saveNote(note) {
        this.data.notes.push(note);
        this.saveData();
    }

    displayNote(note) {
        const notesSection = document.querySelector('#notes .note-list');
        if (!notesSection) return;

        const noteElement = this.createNoteCard(note);
        notesSection.appendChild(noteElement);
    }

    createNoteCard(note) {
        const agencyData = this.data.agencies[note.agency];
        const element = document.createElement('div');
        element.className = 'note-card';
        element.innerHTML = `
            <div class="agency-badge" style="background-color: ${agencyData.color}">${agencyData.code}</div>
            <p>${note.content}</p>
            <p class="timestamp">${new Date(note.timestamp).toLocaleString()}</p>
            <div class="card-actions">
                <button onclick="mdt.editNote('${note.id}')">Edit</button>
                <button onclick="mdt.deleteNote('${note.id}')">Delete</button>
            </div>
        `;
        return element;
    }

    editNote(id) {
        const note = this.data.notes.find(n => n.id === id);
        if (!note) return;

        document.getElementById('noteContent').value = note.content;
        document.getElementById('agencySelect').value = note.agency;
        document.getElementById('note-form').dataset.editing = id;
    }

    deleteNote(id) {
        this.data.notes = this.data.notes.filter(n => n.id !== id);
        this.saveData();
        this.refreshNotesList();
    }

    refreshNotesList() {
        const notesSection = document.querySelector('#notes .note-list');
        if (!notesSection) return;

        notesSection.innerHTML = '';
        this.data.notes.forEach(note => {
            const noteElement = this.createNoteCard(note);
            notesSection.appendChild(noteElement);
        });
    }

    clearForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            form.dataset.editing = '';
        }
    }

    search(sectionId, searchTerm) {
        const sectionData = this.data[sectionId];
        const results = this.filterResults(sectionData, searchTerm);
        this.displaySearchResults(sectionId, results);
    }

    filterResults(data, searchTerm) {
        const term = searchTerm.toLowerCase();
        return data.filter(item => {
            const values = Object.values(item);
            return values.some(value => 
                typeof value === 'string' && value.toLowerCase().includes(term)
            );
        });
    }

    displaySearchResults(sectionId, results) {
        const section = document.getElementById(sectionId);
        const list = section.querySelector('.list');
        if (!list) return;

        list.innerHTML = '';
        results.forEach(item => {
            const element = this.createCard(sectionId, item);
            list.appendChild(element);
        });
    }

    createCard(sectionId, item) {
        const agencyData = this.data.agencies[item.agency];
        const element = document.createElement('div');
        element.className = `${sectionId}-card`;
        element.innerHTML = `
            <div class="agency-badge" style="background-color: ${agencyData.color}">${agencyData.code}</div>
            <h3>${item.make ? `${item.make} ${item.model}` : `${item.firstName} ${item.lastName}`}</h3>
            <p>${item.plateNumber ? `Plate: ${item.plateNumber}` : `License: ${item.licenseNumber}`}</p>
            <p class="timestamp">${new Date(item.timestamp).toLocaleString()}</p>
        `;
        return element;
    }

    loadAllData() {
        this.refreshCitizensList();
        this.refreshVehiclesList();
        this.refreshIncidentsList();
        this.refreshNotesList();
    }
}

// Initialize MDT
const mdt = new MDT();
