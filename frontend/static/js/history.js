// history_script.js

// Dados das vacinas (mantidos conforme o seu input)
const vaccineHistory = [
    { id: 1, name: "COVID-19 (Pfizer)", dose: "1ª dose", date: "2021-05-15", batch: "FH7894", location: "UBS Centro - São Paulo/SP" },
    { id: 2, name: "COVID-19 (Pfizer)", dose: "2ª dose", date: "2021-07-10", batch: "FH8123", location: "UBS Centro - São Paulo/SP" },
    { id: 3, name: "COVID-19 (Pfizer)", dose: "3ª dose", date: "2022-01-20", batch: "FK2456", location: "UBS Vila Mariana - São Paulo/SP" },
    { id: 4, name: "COVID-19 (Pfizer)", dose: "Reforço", date: "2025-05-20", batch: "FM9876", location: "Clínica Saúde Total - São Paulo/SP" },
    { id: 5, name: "Gripe (Influenza)", dose: "Dose anual", date: "2025-09-15", batch: "GR2024", location: "UBS Jardim Paulista - São Paulo/SP" },
    { id: 6, name: "Hepatite B", dose: "1ª dose", date: "2020-03-10", batch: "HB1234", location: "Hospital Municipal - São Paulo/SP" },
    { id: 7, name: "Hepatite B", dose: "2ª dose", date: "2020-04-10", batch: "HB1235", location: "Hospital Municipal - São Paulo/SP" },
    { id: 8, name: "Hepatite B", dose: "3ª dose", date: "2025-01-10", batch: "HB3456", location: "UBS Centro - São Paulo/SP" },
    { id: 9, name: "Febre Amarela", dose: "Dose única", date: "2018-06-20", batch: "FA7890", location: "Centro de Vacinação - São Paulo/SP" },
    { id: 10, name: "Tétano/Difteria (dT)", dose: "Reforço", date: "2019-08-15", batch: "TD4567", location: "UBS Vila Mariana - São Paulo/SP" },
    { id: 11, name: "Tríplice Viral (Sarampo, Caxumba, Rubéola)", dose: "1ª dose", date: "1991-04-10", batch: "TV1990", location: "Hospital Infantil - São Paulo/SP" },
    { id: 12, name: "Tríplice Viral (Sarampo, Caxumba, Rubéola)", dose: "2ª dose", date: "1996-03-15", batch: "TV1995", location: "UBS Centro - São Paulo/SP" }
];

let filteredData = [...vaccineHistory];

// Formatar data
function formatDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

// Renderizar tabela
function renderTable(data) {
    const tbody = document.getElementById('vaccineTableBody');
    const footer = document.getElementById('tableFooter');
    
    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center empty-state">Nenhuma vacina encontrada</td>
            </tr>
        `;
        footer.innerHTML = '';
    } else {
        tbody.innerHTML = data.map(vaccine => `
            <tr>
                <td class="vaccine-name">${vaccine.name}</td>
                <td>${vaccine.dose}</td>
                <td>${formatDate(vaccine.date)}</td>
                <td><code class="batch-code">${vaccine.batch}</code></td>
                <td>${vaccine.location}</td>
                <td class="text-center">
                    <span class="badge badge-applied">Aplicada</span>
                </td>
            </tr>
        `).join('');
        
        footer.innerHTML = `Mostrando ${data.length} de ${vaccineHistory.length} vacina(s)`;
    }
}

// Filtrar vacinas
function filterVaccines() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredData = vaccineHistory.filter(vaccine =>
        vaccine.name.toLowerCase().includes(searchTerm) ||
        vaccine.dose.toLowerCase().includes(searchTerm)
    );
    renderTable(filteredData);
}

// Toggle QR Code
function toggleQR() {
    const qrContainer = document.getElementById('qrContainer');
    qrContainer.style.display = qrContainer.style.display === 'none' ? 'flex' : 'none';
}

// FUNÇÃO ALTERADA: Inclui atualização de ícone/texto e rolagem
function toggleHistory() {
    const historyCard = document.getElementById('historyCard');
    const historyIcon = document.getElementById('historyIcon');
    const historyButtonText = document.getElementById('historyButtonText');
    
    // 1. Alterna a visibilidade do cartão
    const isHidden = historyCard.style.display === 'none';
    historyCard.style.display = isHidden ? 'block' : 'none'; 
    
    // 2. Alterna o ícone e o texto
    if (isHidden) {
        // Se estava OCULTO e agora está VISÍVEL
        historyIcon.classList.remove('fa-eye-slash'); // remove olho cortado
        historyIcon.classList.add('fa-eye'); // adiciona olho aberto
        historyButtonText.textContent = 'Ocultar Histórico';
        
        // Rola para a seção
        historyCard.scrollIntoView({ behavior: 'smooth' });
    } else {
        // Se estava VISÍVEL e agora está OCULTO
        historyIcon.classList.remove('fa-eye'); // remove olho aberto
        historyIcon.classList.add('fa-eye-slash'); // adiciona olho cortado
        historyButtonText.textContent = 'Histórico';
    }
}

// Compartilhar (alert() substituído por console.log)
function shareCard() {
    if (navigator.share) {
        navigator.share({
            title: 'Minha Carteirinha de Vacinação',
            text: 'Carteirinha de Vacinação - Maria Silva Santos',
            url: window.location.href,
        }).catch(err => console.log('Erro ao compartilhar:', err));
    } else {
        console.log('Função de compartilhamento disponível apenas em dispositivos móveis');
    }
}

// Download PDF (alert() substituído por console.log)
function downloadPDF() {
    console.log('Função de download em desenvolvimento. Aqui você poderá baixar sua carteirinha em PDF.');
}

// Voltar (corrigido para ir para o index.html na pasta anterior)
function goBack() {
    window.location.href = '../index.html';
}

// FUNÇÃO ALTERADA: Lógica para ler a URL e abrir o histórico automaticamente
document.addEventListener('DOMContentLoaded', function() {
    const historyCard = document.getElementById('historyCard');
    
    // NOVO: Lê os parâmetros da URL
    const params = new URLSearchParams(window.location.search);
    const showHistoryFromUrl = params.get('showHistory') === 'true';

    // 1. A visualização inicial depende do parâmetro da URL
    if (historyCard) {
        historyCard.style.display = showHistoryFromUrl ? 'block' : 'none';
    }

    // 2. Renderiza a tabela
    renderTable(filteredData);
    
    // 3. Atualiza a data
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('pt-BR');
    
    // 4. Se o histórico estiver visível por causa da URL, ajusta o botão e rola a tela
    const historyIcon = document.getElementById('historyIcon');
    const historyButtonText = document.getElementById('historyButtonText');

    if (showHistoryFromUrl) {
        // Ajusta o botão para o estado "Aberto"
        if (historyIcon) {
            historyIcon.classList.remove('fa-eye-slash');
            historyIcon.classList.add('fa-eye');
        }
        if (historyButtonText) {
            historyButtonText.textContent = 'Ocultar Histórico';
        }
        
        // Rola para a seção do histórico
        if (historyCard) {
             historyCard.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        // Ajusta o botão para o estado "Fechado" (padrão)
        if (historyIcon) {s
            historyIcon.classList.remove('fa-eye');
            historyIcon.classList.add('fa-eye-slash');
        }
        if (historyButtonText) {
            historyButtonText.textContent = 'Histórico';
        }
    }
});
