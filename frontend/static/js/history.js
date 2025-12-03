// history_script.js

// history.js

// A lista de vacinas será carregada via Jinja no HTML
let vaccineHistory = [];
let filteredData = [];

// Função para carregar os dados das vacinas do HTML
function loadVaccineData() {
    const dataElement = document.getElementById('vaccine-data');
    if (dataElement) {
        try {
            // O JSON é injetado no HTML pelo Flask
            vaccineHistory = JSON.parse(dataElement.textContent);
            filteredData = [...vaccineHistory];
        } catch (e) {
            console.error("Erro ao carregar dados das vacinas:", e);
        }
    }
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
            <tr onclick="showVaccineDetails(${vaccine.id})" style="cursor: pointer;">
                <td class="vaccine-name">${vaccine.vaccine_name}</td>
                <td>${vaccine.dose_number}ª Dose</td>
                <td>${vaccine.date_formatted}</td>
                <td><code class="batch-code">${vaccine.lote || 'N/A'}</code></td>
                <td>${vaccine.local || 'N/A'}</td>
                <td class="text-center">
                    <span class="badge badge-applied">${vaccine.status}</span>
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
        vaccine.vaccine_name.toLowerCase().includes(searchTerm)
    );
    renderTable(filteredData);
}

// Exibir detalhes da vacina (simulação de modal)
function showVaccineDetails(id) {
    const vaccine = vaccineHistory.find(v => v.id === id);
    if (vaccine) {
        alert(\`Detalhes da Vacina:
Vacina: \${vaccine.vaccine_name}
Dose: \${vaccine.dose_number}ª Dose
Data: \${vaccine.date_formatted}
Lote: \${vaccine.lote || 'N/A'}
Local: \${vaccine.local || 'N/A'}
Status: \${vaccine.status}\`);
    }
}

// Toggle QR Code
function toggleQR() {
    const qrContainer = document.getElementById('qrContainer');
    const qrImage = document.getElementById('qrImage');
    const userCpf = document.querySelector('[data-user-cpf]').dataset.userCpf;
    
    if (qrContainer.style.display === 'none' || qrContainer.style.display === '') {
        // Se estiver oculto, mostra e carrega a imagem do QR Code
        qrContainer.style.display = 'flex';
        // A URL para o QR Code é gerada pelo Flask
        qrImage.src = \`/generate_qr_code/\${userCpf}\`;
    } else {
        // Se estiver visível, oculta
        qrContainer.style.display = 'none';
    }
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
            text: 'Carteirinha de Vacinação - ' + vaccineHistory[0].name, // Usa o nome do primeiro registro como exemplo
            url: window.location.href,
        }).catch(err => console.log('Erro ao compartilhar:', err));
    } else {
        console.log('Função de compartilhamento disponível apenas em dispositivos móveis');
    }
}

// Voltar (corrigido para ir para o index.html na pasta anterior)
function goBack() {
    window.location.href = '../index.html';
}

// FUNÇÃO ALTERADA: Lógica para ler a URL e abrir o histórico automaticamente
document.addEventListener('DOMContentLoaded', function() {
    loadVaccineData(); // Carrega os dados antes de renderizar
    
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
        if (historyIcon) {
            historyIcon.classList.remove('fa-eye');
            historyIcon.classList.add('fa-eye-slash');
        }
        if (historyButtonText) {
            historyButtonText.textContent = 'Histórico';
        }
    }
});

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
    const qrImage = document.getElementById('qrImage');
    const userCpf = document.querySelector('[data-user-cpf]').dataset.userCpf;
    
    if (qrContainer.style.display === 'none' || qrContainer.style.display === '') {
        // Se estiver oculto, mostra e carrega a imagem do QR Code
        qrContainer.style.display = 'flex';
        // A URL para o QR Code é gerada pelo Flask
        qrImage.src = `/generate_qr_code/${userCpf}`;
    } else {
        // Se estiver visível, oculta
        qrContainer.style.display = 'none';
    }
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

// Download PDF (removido, agora é uma rota Flask)

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
