// history.js

// A lista de vacinas será carregada via Jinja no HTML
let vaccineHistory = [];

// Função para carregar os dados das vacinas do HTML
function loadVaccineData() {
    const dataElement = document.getElementById('vaccine-data');
    if (dataElement) {
        try {
            // O JSON é injetado no HTML pelo Flask
            vaccineHistory = JSON.parse(dataElement.textContent);
        } catch (e) {
            console.error("Erro ao carregar dados das vacinas:", e);
        }
    }
}

// Função para alternar entre nome e data da vacina (usada em vaccine_card.html)
// IMPORTANTE: Função global para ser acessível pelo onclick no HTML
window.toggleVaccineInfo = function(element) {
    const nameSpan = element.querySelector('.vaccine-info.name');
    const dateSpan = element.querySelector('.vaccine-info.date');
    
    if (nameSpan.style.display !== 'none' && nameSpan.style.display !== '') {
        nameSpan.style.display = 'none';
        dateSpan.style.display = 'block';
    } else {
        nameSpan.style.display = 'block';
        dateSpan.style.display = 'none';
    }
};

// Compartilhar por email
// IMPORTANTE: Função global para ser acessível pelo onclick no HTML
window.shareCard = function() {
    // Buscar dados do usuário da página
    const userName = document.querySelector('.detail-value')?.textContent || 'Usuário';
    const vaccineCount = document.querySelectorAll('.vaccine-square').length;
    
    // Criar o corpo do email
    const subject = encodeURIComponent('Carteira de Vacinação Digital - ImmunoTrack');
    const body = encodeURIComponent(
        `Olá!\n\n` +
        `Compartilho minha Carteira de Vacinação Digital do ImmunoTrack.\n\n` +
        `Nome: ${userName}\n` +
        `Vacinas Registradas: ${vaccineCount}\n\n` +
        `Para visualizar a carteira completa, acesse: ${window.location.href}\n\n` +
        `ImmunoTrack - Carteira de Vacinação Digital\n` +
        `Ministério da Saúde - Sistema Único de Saúde`
    );
    
    // Abrir cliente de email
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
};

// --- Funções para Histórico Detalhado (vaccine_history.html) ---

// Renderizar tabela (usada em vaccine_history.html)
function renderTable(data) {
    const tbody = document.getElementById('vaccineTableBody');
    const footer = document.getElementById('tableFooter');
    
    if (!tbody) return; // Garante que só executa na página correta

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center empty-state">Nenhuma vacina encontrada</td>
            </tr>
        `;
        footer.innerHTML = 'Mostrando 0 vacina(s)';
    } else {
        // O HTML da tabela é renderizado pelo Jinja, então só precisamos da função de filtro
        // Se estivéssemos renderizando o HTML via JS, usaríamos o .map() aqui.
        // Como o Jinja já renderizou, esta função é mais para fins de filtro.
        
        // Vamos apenas garantir que o footer esteja correto para o caso de não haver filtro
        if (footer) {
            footer.innerHTML = `Mostrando ${data.length} de ${vaccineHistory.length} vacina(s)`;
        }
    }
}

// Filtrar vacinas (usada em vaccine_history.html)
function filterVaccines() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredData = vaccineHistory.filter(vaccine =>
        vaccine.vaccine_name.toLowerCase().includes(searchTerm) ||
        vaccine.date_formatted.includes(searchTerm)
    );
    
    const tbody = document.getElementById('vaccineTableBody');
    const footer = document.getElementById('tableFooter');
    
    if (!tbody) return;

    if (filteredData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center empty-state">Nenhuma vacina encontrada</td>
            </tr>
        `;
        footer.innerHTML = 'Mostrando 0 vacina(s)';
    } else {
        tbody.innerHTML = filteredData.map(vaccine => `
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
        footer.innerHTML = `Mostrando ${filteredData.length} de ${vaccineHistory.length} vacina(s)`;
    }
}

// Exibir detalhes da vacina (simulação de modal) (usada em vaccine_history.html)
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

// Voltar (corrigido para ir para o index.html na pasta anterior)
function goBack() {
    window.location.href = '../index.html';
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadVaccineData(); // Carrega os dados
    
    // Renderiza a tabela na página de histórico (se o elemento existir)
    if (document.getElementById('vaccineTableBody')) {
        // O Jinja já renderizou a tabela, mas podemos chamar renderTable para garantir o footer
        renderTable(vaccineHistory);
    }
});
