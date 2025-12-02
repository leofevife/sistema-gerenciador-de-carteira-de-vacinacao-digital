// Dados mockados
let familyMembers = [
    {
        id: "1",
        name: "Maria Silva Santos",
        relationship: "Filha",
        birthDate: "2018-03-15",
        age: 7,
        vaccines: [
            {
                id: "v1",
                name: "BCG",
                date: "2018-03-16",
                status: "completed",
                batch: "BCG2018A",
                location: "Hospital Maternidade"
            },
            {
                id: "v2",
                name: "Hepatite B",
                date: "2018-04-15",
                status: "completed",
                batch: "HEPB2018B",
                location: "UBS Centro"
            },
            {
                id: "v3",
                name: "Tríplice Viral",
                date: "2019-03-20",
                status: "completed",
                batch: "TV2019C",
                location: "UBS Centro"
            },
            {
                id: "v4",
                name: "Gripe (Influenza)",
                date: "2025-11-20",
                status: "pending",
                location: "UBS Centro"
            }
        ]
    },
    {
        id: "2",
        name: "João Carlos Santos",
        relationship: "Cônjuge",
        birthDate: "1985-07-22",
        age: 40,
        vaccines: [
            {
                id: "v5",
                name: "COVID-19 (1ª dose)",
                date: "2021-05-10",
                status: "completed",
                batch: "COV2021X",
                location: "Centro de Vacinação Municipal"
            },
            {
                id: "v6",
                name: "COVID-19 (2ª dose)",
                date: "2021-07-10",
                status: "completed",
                batch: "COV2021Y",
                location: "Centro de Vacinação Municipal"
            },
            {
                id: "v7",
                name: "Gripe (Influenza)",
                date: "2025-05-15",
                status: "completed",
                batch: "FLU2025A",
                location: "Farmácia Popular"
            },
            {
                id: "v8",
                name: "Tétano",
                date: "2025-10-01",
                status: "overdue"
            }
        ]
    },
    {
        id: "3",
        name: "Ana Paula Santos",
        relationship: "Mãe",
        birthDate: "1960-11-30",
        age: 64,
        vaccines: [
            {
                id: "v9",
                name: "Gripe (Influenza)",
                date: "2025-04-20",
                status: "completed",
                batch: "FLU2025B",
                location: "UBS Jardim"
            },
            {
                id: "v10",
                name: "Pneumocócica",
                date: "2024-06-15",
                status: "completed",
                batch: "PNEU2024A",
                location: "UBS Jardim",
                nextDose: "2029-06-15"
            },
            {
                id: "v11",
                name: "COVID-19 (Reforço)",
                date: "2025-09-01",
                status: "overdue"
            }
        ]
    }
];

let selectedMember = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeIcons();
    updateStats();
    renderFamilyGrid();
    
    // Event listeners
    document.getElementById('addFamilyBtn').addEventListener('click', openAddDialog);
    document.getElementById('addFirstFamilyBtn').addEventListener('click', openAddDialog);
    document.getElementById('addFamilyForm').addEventListener('submit', handleAddMember);
    document.getElementById('scheduleForm').addEventListener('submit', handleScheduleAppointment);
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Close dialogs on overlay click
    document.querySelectorAll('.dialog-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
            }
        });
    });
});

function initializeIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function updateStats() {
    const totalMembers = familyMembers.length;
    const totalVaccines = familyMembers.reduce((sum, member) => sum + member.vaccines.length, 0);
    const pendingVaccines = familyMembers.reduce(
        (sum, member) => sum + member.vaccines.filter(v => v.status === 'pending' || v.status === 'overdue').length,
        0
    );
    
    document.getElementById('totalMembers').textContent = totalMembers;
    document.getElementById('totalVaccines').textContent = totalVaccines;
    document.getElementById('pendingVaccines').textContent = pendingVaccines;
}

function renderFamilyGrid() {
    const grid = document.getElementById('familyGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (familyMembers.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        initializeIcons();
        return;
    }
    
    grid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    grid.innerHTML = familyMembers.map(member => createFamilyCard(member)).join('');
    initializeIcons();
}

function createFamilyCard(member) {
    const completedVaccines = member.vaccines.filter(v => v.status === 'completed').length;
    const pendingVaccines = member.vaccines.filter(v => v.status === 'pending' || v.status === 'overdue').length;
    const overdueVaccines = member.vaccines.filter(v => v.status === 'overdue').length;
    
    return `
        <div class="family-card">
            <div class="card-header">
                <div class="card-header-content">
                    <div class="member-info">
                        <div class="avatar">
                            <i data-lucide="user-circle"></i>
                        </div>
                        <div class="member-details">
                            <h3>${member.name}</h3>
                            <p class="member-meta">${member.relationship} • ${member.age} anos</p>
                        </div>
                    </div>
                    ${overdueVaccines > 0 ? `
                        <span class="badge badge-destructive">
                            ${overdueVaccines} atrasada${overdueVaccines > 1 ? 's' : ''}
                        </span>
                    ` : ''}
                </div>
            </div>
            <div class="card-content">
                <div class="vaccine-stats">
                    <div class="stat-box stat-box-green">
                        <div class="stat-box-header">
                            <i data-lucide="syringe"></i>
                            <span>Completas</span>
                        </div>
                        <div class="stat-box-value">${completedVaccines}</div>
                    </div>
                    <div class="stat-box stat-box-amber">
                        <div class="stat-box-header">
                            <i data-lucide="calendar"></i>
                            <span>Pendentes</span>
                        </div>
                        <div class="stat-box-value">${pendingVaccines}</div>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn btn-outline" onclick="openRecordDialog('${member.id}')">
                        <i data-lucide="eye"></i>
                        <span>Ver Carteira</span>
                    </button>
                    <button class="btn btn-primary" onclick="openScheduleDialog('${member.id}')">
                        <i data-lucide="calendar"></i>
                        <span>Agendar</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredMembers = familyMembers.filter(member =>
        member.name.toLowerCase().includes(searchTerm) ||
        member.relationship.toLowerCase().includes(searchTerm)
    );
    
    const grid = document.getElementById('familyGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (filteredMembers.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        emptyState.querySelector('h3').textContent = 'Nenhum familiar encontrado';
        emptyState.querySelector('.empty-text').textContent = 'Tente buscar com outros termos';
        emptyState.querySelector('.btn').style.display = 'none';
    } else {
        grid.style.display = 'grid';
        emptyState.style.display = 'none';
        grid.innerHTML = filteredMembers.map(member => createFamilyCard(member)).join('');
    }
    
    initializeIcons();
}

// Dialog functions
function openAddDialog() {
    document.getElementById('addFamilyDialog').style.display = 'flex';
}

function closeAddDialog() {
    document.getElementById('addFamilyDialog').style.display = 'none';
    document.getElementById('addFamilyForm').reset();
}

function openScheduleDialog(memberId) {
    selectedMember = familyMembers.find(m => m.id === memberId);
    if (!selectedMember) return;
    
    document.getElementById('scheduleMemberName').textContent = selectedMember.name;
    document.getElementById('scheduleDialog').style.display = 'flex';
    initializeIcons();
}

function closeScheduleDialog() {
    document.getElementById('scheduleDialog').style.display = 'none';
    document.getElementById('scheduleForm').reset();
    selectedMember = null;
}

function openRecordDialog(memberId) {
    selectedMember = familyMembers.find(m => m.id === memberId);
    if (!selectedMember) return;
    
    document.getElementById('recordMemberName').textContent = selectedMember.name;
    document.getElementById('recordBirthDate').textContent = formatDate(selectedMember.birthDate);
    document.getElementById('recordAge').textContent = `${selectedMember.age} anos`;
    document.getElementById('recordRelationship').textContent = selectedMember.relationship;
    
    const vaccinesList = document.getElementById('vaccinesList');
    vaccinesList.innerHTML = selectedMember.vaccines.map(vaccine => createVaccineItem(vaccine)).join('');
    
    document.getElementById('recordDialog').style.display = 'flex';
    initializeIcons();
}

function closeRecordDialog() {
    document.getElementById('recordDialog').style.display = 'none';
    selectedMember = null;
}

function createVaccineItem(vaccine) {
    const statusIcons = {
        completed: 'check-circle-2',
        pending: 'clock',
        overdue: 'alert-circle'
    };
    
    const statusLabels = {
        completed: 'Completa',
        pending: 'Pendente',
        overdue: 'Atrasada'
    };
    
    const badgeClass = vaccine.status === 'completed' ? 'badge-completed' : 
                       vaccine.status === 'pending' ? 'badge-pending' : 'badge-destructive';
    
    return `
        <div class="vaccine-item">
            <div class="vaccine-header">
                <div class="vaccine-info">
                    <div class="status-icon ${vaccine.status}">
                        <i data-lucide="${statusIcons[vaccine.status]}"></i>
                    </div>
                    <div class="vaccine-details">
                        <h4>${vaccine.name}</h4>
                        <div class="vaccine-date">
                            <i data-lucide="calendar"></i>
                            <span>
                                ${vaccine.status === 'completed' 
                                    ? `Aplicada em ${formatDate(vaccine.date)}`
                                    : `Prevista para ${formatDate(vaccine.date)}`
                                }
                            </span>
                        </div>
                        ${vaccine.location ? `<p class="vaccine-meta">Local: ${vaccine.location}</p>` : ''}
                        ${vaccine.batch ? `<p class="vaccine-meta">Lote: ${vaccine.batch}</p>` : ''}
                    </div>
                </div>
                <span class="badge ${badgeClass}">${statusLabels[vaccine.status]}</span>
            </div>
            ${vaccine.nextDose ? `
                <div class="vaccine-next-dose">
                    Próxima dose: ${formatDate(vaccine.nextDose)}
                </div>
            ` : ''}
        </div>
    `;
}

// Form handlers
function handleAddMember(e) {
    e.preventDefault();
    
    const name = document.getElementById('memberName').value;
    const relationship = document.getElementById('memberRelationship').value;
    const birthDate = document.getElementById('memberBirthDate').value;
    
    const age = calculateAge(birthDate);
    
    const newMember = {
        id: Date.now().toString(),
        name,
        relationship,
        birthDate,
        age,
        vaccines: []
    };
    
    familyMembers.push(newMember);
    updateStats();
    renderFamilyGrid();
    closeAddDialog();
    showToast(`${name} foi adicionado(a) com sucesso!`);
}

function handleScheduleAppointment(e) {
    e.preventDefault();
    
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const vaccineType = document.getElementById('vaccineType').value;
    
    closeScheduleDialog();
    showToast(`Consulta agendada para ${selectedMember.name} em ${formatDate(date)} às ${time}`);
}

// Utility functions
function calculateAge(birthDate) {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast toast-success';
    toast.innerHTML = `
        <i data-lucide="check-circle-2" class="toast-icon"></i>
        <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    initializeIcons();
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add slide out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
