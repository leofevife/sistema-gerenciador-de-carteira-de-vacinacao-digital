// Estado Global da Aplicação
const AppState = {
    currentScreen: 'postos',
    selectedPosto: null,
    selectedVacina: null,
    selectedDate: null,
    selectedHorario: null,
    searchTerm: '',
    viewMode: 'list',
    selectedPostoId: null,
    agendamentos: [
        {
            id: '1',
            vacina: 'COVID-19 (Pfizer)',
            posto: 'UBS Centro',
            data: '2025-11-15',
            horario: '10:00',
            status: 'confirmado'
        },
        {
            id: '2',
            vacina: 'Gripe (Influenza)',
            posto: 'UBS Vila Nova',
            data: '2025-11-20',
            horario: '14:30',
            status: 'pendente'
        }
    ],
    onPostosBackHandler: null
};

// Dados Mock
const POSTOS_MOCK = [
    {
        id: '1',
        nome: 'UBS Centro',
        endereco: 'Rua das Flores, 123 - Centro',
        distancia: 0.8,
        horario: 'Seg-Sex: 8h-17h',
        telefone: '(11) 3456-7890',
        lat: -23.550520,
        lng: -46.633308
    },
    {
        id: '2',
        nome: 'UBS Vila Nova',
        endereco: 'Av. Paulista, 456 - Vila Nova',
        distancia: 1.5,
        horario: 'Seg-Sex: 7h-19h | Sáb: 8h-12h',
        telefone: '(11) 3456-7891',
        lat: -23.561684,
        lng: -46.656139
    },
    {
        id: '3',
        nome: 'UBS Jardim das Acácias',
        endereco: 'Rua das Acácias, 789 - Jardim',
        distancia: 2.3,
        horario: 'Seg-Sex: 8h-18h',
        telefone: '(11) 3456-7892',
        lat: -23.548943,
        lng: -46.638818
    },
    {
        id: '4',
        nome: 'UBS Parque da Saúde',
        endereco: 'Av. da Saúde, 321 - Parque',
        distancia: 3.1,
        horario: 'Seg-Sex: 7h-17h',
        telefone: '(11) 3456-7893',
        lat: -23.563891,
        lng: -46.654623
    },
    {
        id: '5',
        nome: 'UBS São José',
        endereco: 'Rua São José, 654 - Bairro Alto',
        distancia: 4.2,
        horario: 'Seg-Sex: 8h-16h',
        telefone: '(11) 3456-7894',
        lat: -23.557499,
        lng: -46.662876
    }
];

const VACINAS_MOCK = [
    {
        id: '1',
        nome: 'COVID-19 (Pfizer)',
        descricao: 'Vacina contra COVID-19 - Pfizer/BioNTech',
        disponivel: 45
    },
    {
        id: '2',
        nome: 'COVID-19 (AstraZeneca)',
        descricao: 'Vacina contra COVID-19 - AstraZeneca/Oxford',
        disponivel: 30
    },
    {
        id: '3',
        nome: 'Gripe (Influenza)',
        descricao: 'Vacina contra Influenza - Campanha 2025',
        disponivel: 120
    },
    {
        id: '4',
        nome: 'Hepatite B',
        descricao: 'Vacina contra Hepatite B - 3 doses',
        disponivel: 25
    },
    {
        id: '5',
        nome: 'Tríplice Viral (Sarampo, Caxumba, Rubéola)',
        descricao: 'Vacina tríplice viral - MMR',
        disponivel: 60
    },
    {
        id: '6',
        nome: 'Febre Amarela',
        descricao: 'Vacina contra Febre Amarela - dose única',
        disponivel: 15
    },
    {
        id: '7',
        nome: 'Tétano e Difteria (dT)',
        descricao: 'Vacina dupla adulto',
        disponivel: 0,
        proximaReposicao: '2025-11-12'
    },
    {
        id: '8',
        nome: 'Pneumocócica 23-valente',
        descricao: 'Vacina pneumocócica para idosos',
        disponivel: 8
    }
];

const HORARIOS_DISPONIVEIS = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30'
];

// Função para conectar handler externo do botão Voltar
function setPostosBackHandler(handler) {
    AppState.onPostosBackHandler = handler;
}

// Funções de Navegação
function navigateTo(screen) {
    console.log(screen);
    
    AppState.currentScreen = screen;
    render();
}

function selectPosto(posto) {
    AppState.selectedPosto = posto;
    navigateTo('disponibilidade');
}

function selectVacina(vacina) {
    AppState.selectedVacina = vacina;
    navigateTo('agendamento');
}

function createAgendamento() {
    if (!AppState.selectedDate || !AppState.selectedHorario) return;
    
    const newAgendamento = {
        id: Date.now().toString(),
        vacina: AppState.selectedVacina.nome,
        posto: AppState.selectedPosto.nome,
        data: AppState.selectedDate,
        horario: AppState.selectedHorario,
        status: 'confirmado'
    };
    
    AppState.agendamentos.push(newAgendamento);
    AppState.selectedDate = null;
    AppState.selectedHorario = null;
    navigateTo('meus-agendamentos');
}

function cancelAgendamento(id) {
    const index = AppState.agendamentos.findIndex(ag => ag.id === id);
    if (index !== -1) {
        AppState.agendamentos[index].status = 'cancelado';
        render();
    }
}

function goBack() {
    if (AppState.currentScreen === 'disponibilidade') {
        AppState.selectedPosto = null;
        navigateTo('postos');
    } else if (AppState.currentScreen === 'agendamento') {
        AppState.selectedVacina = null;
        navigateTo('disponibilidade');
    }
}

// Funções de Renderização
function renderPostosScreen() {
    const filteredPostos = POSTOS_MOCK.filter(posto =>
        posto.nome.toLowerCase().includes(AppState.searchTerm.toLowerCase()) ||
        posto.endereco.toLowerCase().includes(AppState.searchTerm.toLowerCase())
    );
    
    return `
        <div class="container">
            <!-- Header -->
            <div class="header-section">
                <div class="flex items-center justify-between mb-4 gap-4" style="flex-wrap: wrap;">
                    <div class="flex items-center gap-4">
                       
                        <div>
                            <h1>Consulta de Postos de Saúde</h1>
                            <p class="text-muted">Encontre os postos de saúde mais próximos de você</p>
                        </div>
                    </div>
                    <button class="btn btn-outline" onclick="navigateTo('meus-agendamentos')">
                        <i data-lucide="calendar" style="width: 16px; height: 16px;"></i>
                        Meus Agendamentos
                    </button>
                </div>
                
                <!-- Search and View Toggle -->
                <div class="search-section">
                    <div class="input-wrapper">
                        <i data-lucide="map-pin" class="input-icon" style="width: 20px; height: 20px;"></i>
                        <input 
                            type="text" 
                            class="input input-with-icon" 
                            placeholder="Buscar por nome ou endereço..."
                            value="${AppState.searchTerm}"
                            oninput="AppState.searchTerm = this.value; render()"
                        />
                    </div>
                    <div class="view-toggle">
                        <button 
                            class="btn ${AppState.viewMode === 'list' ? 'btn-primary' : 'btn-outline'}"
                            onclick="AppState.viewMode = 'list'; render()"
                        >
                            <i data-lucide="list" style="width: 16px; height: 16px;"></i>
                            Lista
                        </button>
                        <button 
                            class="btn ${AppState.viewMode === 'map' ? 'btn-primary' : 'btn-outline'}"
                            onclick="AppState.viewMode = 'map'; render()"
                        >
                            <i data-lucide="map" style="width: 16px; height: 16px;"></i>
                            Mapa
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Content -->
            ${AppState.viewMode === 'list' ? renderPostosListView(filteredPostos) : renderPostosMapView(filteredPostos)}
        </div>
    `;
}

function renderPostosListView(postos) {
    return `
        <div class="grid md-grid-cols-2 lg-grid-cols-3">
            ${postos.map(posto => `
                <div class="card card-hover" onclick='selectPosto(${JSON.stringify(posto)})'>
                    <div class="card-header">
                        <div class="flex items-start justify-between">
                            <div class="card-title">${posto.nome}</div>
                            <span class="badge badge-secondary">${posto.distancia} km</span>
                        </div>
                        <div class="card-description">${posto.endereco}</div>
                    </div>
                    <div class="card-content">
                        <div class="flex items-center gap-2 text-muted mb-3">
                            <i data-lucide="clock" style="width: 16px; height: 16px;"></i>
                            <span class="text-sm">${posto.horario}</span>
                        </div>
                        <div class="flex items-center gap-2 text-muted mb-3">
                            <i data-lucide="phone" style="width: 16px; height: 16px;"></i>
                            <span class="text-sm">${posto.telefone}</span>
                        </div>
                        <button class="btn btn-primary w-full" onclick='event.stopPropagation(); selectPosto(${JSON.stringify(posto)})'>
                            Ver Vacinas Disponíveis
                            <i data-lucide="navigation" style="width: 16px; height: 16px;"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderPostosMapView(postos) {
    return `
        <div class="grid lg-grid-cols-2 gap-4">
            <!-- Map -->
            <div class="card">
                <div class="map-placeholder">
                    <div class="p-4">
                        <i data-lucide="map" style="width: 64px; height: 64px; margin: 0 auto 1rem; display: block;" class="text-primary"></i>
                        <p class="text-muted">Mapa interativo com a localização dos postos</p>
                        <p class="text-muted text-sm mt-2">
                            (Em produção, aqui seria integrado com Google Maps ou similar)
                        </p>
                    </div>
                    ${postos.map((posto, index) => `
                        <div class="map-pin" 
                             style="left: ${20 + index * 15}%; top: ${30 + (index % 3) * 20}%;"
                             onclick="AppState.selectedPostoId = '${posto.id}'; render()">
                            <i data-lucide="map-pin" 
                               style="width: 32px; height: 32px; ${AppState.selectedPostoId === posto.id ? 'color: #ef4444; fill: currentColor;' : 'color: var(--primary);'}">
                            </i>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- List -->
            <div class="flex flex-col gap-4">
                ${postos.map(posto => `
                    <div class="card card-hover ${AppState.selectedPostoId === posto.id ? 'ring-2 ring-primary' : ''}" 
                         style="${AppState.selectedPostoId === posto.id ? 'outline: 2px solid var(--primary); outline-offset: 2px;' : ''}"
                         onclick="AppState.selectedPostoId = '${posto.id}'; render()">
                        <div class="card-header">
                            <div class="flex items-start justify-between">
                                <div class="card-title">${posto.nome}</div>
                                <span class="badge badge-secondary">${posto.distancia} km</span>
                            </div>
                            <div class="card-description">${posto.endereco}</div>
                        </div>
                        <div class="card-content">
                            <div class="flex items-center gap-2 text-muted mb-3">
                                <i data-lucide="clock" style="width: 16px; height: 16px;"></i>
                                <span class="text-sm">${posto.horario}</span>
                            </div>
                            <div class="flex items-center gap-2 text-muted mb-3">
                                <i data-lucide="phone" style="width: 16px; height: 16px;"></i>
                                <span class="text-sm">${posto.telefone}</span>
                            </div>
                            <button class="btn btn-primary w-full" onclick='event.stopPropagation(); selectPosto(${JSON.stringify(posto)})'>
                                Ver Vacinas Disponíveis
                                <i data-lucide="navigation" style="width: 16px; height: 16px;"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderDisponibilidadeScreen() {
    const vacinasDisponiveis = VACINAS_MOCK.filter(v => v.disponivel > 0);
    const vacinasIndisponiveis = VACINAS_MOCK.filter(v => v.disponivel === 0);
    
    return `
        <div class="container">
            <!-- Header -->
            <div class="header-section">
                <div class="flex items-center gap-4 mb-4">
                   
                    <button class="btn btn-outline ml-auto" onclick="navigateTo('meus-agendamentos')">
                        <i data-lucide="calendar" style="width: 16px; height: 16px;"></i>
                        Meus Agendamentos
                    </button>
                </div>
                
                <div class="card mb-4">
                    <div class="card-header">
                        <div class="card-title">${AppState.selectedPosto.nome}</div>
                        <div class="card-description">${AppState.selectedPosto.endereco}</div>
                    </div>
                    <div class="card-content">
                        <div class="flex gap-4 text-sm text-muted" style="flex-wrap: wrap;">
                            <div class="flex items-center gap-2">
                                <i data-lucide="package" style="width: 16px; height: 16px;"></i>
                                <span>${vacinasDisponiveis.length} vacinas disponíveis</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i data-lucide="alert-circle" style="width: 16px; height: 16px;"></i>
                                <span>${vacinasIndisponiveis.length} em reposição</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mb-6">
                <h2>Disponibilidade de Vacinas</h2>
                <p class="text-muted">Consulta em tempo real sobre quais vacinas estão disponíveis neste posto</p>
            </div>
            
            <!-- Vacinas Disponíveis -->
            <div class="mb-8">
                <h3 class="mb-4 flex items-center gap-2">
                    <i data-lucide="check-circle" style="width: 20px; height: 20px;" class="text-primary"></i>
                    Vacinas Disponíveis para Agendamento
                </h3>
                <div class="grid md-grid-cols-2">
                    ${vacinasDisponiveis.map(vacina => `
                        <div class="card card-hover" style="background-color: var(--bg-accent);" onclick='selectVacina(${JSON.stringify(vacina)})'>
                            <div class="card-header">
                                <div class="card-title">
                                    <i data-lucide="syringe" style="width: 20px; height: 20px;" class="text-primary"></i>
                                    ${vacina.nome}
                                </div>
                                <div class="card-description mt-2">${vacina.descricao}</div>
                            </div>
                            <div class="card-content">
                                <div class="flex items-center justify-between mb-3">
                                    <span class="text-sm text-muted">Doses disponíveis:</span>
                                    <span class="badge badge-primary">${vacina.disponivel} doses</span>
                                </div>
                                <button class="btn btn-primary w-full" onclick='event.stopPropagation(); selectVacina(${JSON.stringify(vacina)})'>
                                    Agendar Vacinação
                                    <i data-lucide="calendar" style="width: 16px; height: 16px;"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Vacinas Indisponíveis -->
            ${vacinasIndisponiveis.length > 0 ? `
                <div>
                    <h3 class="mb-4 flex items-center gap-2 text-orange">
                        <i data-lucide="alert-circle" style="width: 20px; height: 20px;"></i>
                        Vacinas Temporariamente Indisponíveis
                    </h3>
                    <div class="grid md-grid-cols-2">
                        ${vacinasIndisponiveis.map(vacina => `
                            <div class="card opacity-75" style="border-color: var(--border-orange); background-color: #fffbeb;">
                                <div class="card-header">
                                    <div class="card-title">
                                        <i data-lucide="syringe" style="width: 20px; height: 20px; color: #ea580c;"></i>
                                        ${vacina.nome}
                                    </div>
                                    <div class="card-description mt-2">${vacina.descricao}</div>
                                </div>
                                <div class="card-content">
                                    <div class="alert alert-warning">
                                        <i data-lucide="alert-circle" style="width: 16px; height: 16px;"></i>
                                        <div>
                                            ${vacina.proximaReposicao 
                                                ? `Próxima reposição prevista: ${new Date(vacina.proximaReposicao).toLocaleDateString('pt-BR')}`
                                                : 'Sem previsão de reposição'
                                            }
                                        </div>
                                    </div>
                                    <button class="btn btn-outline w-full mt-3" disabled>
                                        Indisponível
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

function renderAgendamentoScreen() {
    return `
        <div class="container">
            <!-- Header -->
            <div class="header-section">
                <div class="flex items-center gap-4 mb-4">
                    
                    <button class="btn btn-outline ml-auto" onclick="navigateTo('meus-agendamentos')">
                        <i data-lucide="calendar" style="width: 16px; height: 16px;"></i>
                        Meus Agendamentos
                    </button>
                </div>
                
                <h1>Agendamento Online</h1>
                <p class="text-muted">Selecione a data e horário disponível para aplicação da vacina</p>
            </div>
            
            <!-- Resumo -->
            <div class="card mb-8" style="background-color: var(--bg-accent);">
                <div class="card-header">
                    <div class="card-title">Resumo do Agendamento</div>
                </div>
                <div class="card-content">
                    <div class="grid md-grid-cols-2">
                        <div class="flex items-start gap-3">
                            <i data-lucide="syringe" style="width: 20px; height: 20px;" class="text-primary"></i>
                            <div>
                                <p class="text-muted text-sm">Vacina</p>
                                <p>${AppState.selectedVacina.nome}</p>
                                <p class="text-muted text-sm">${AppState.selectedVacina.descricao}</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <i data-lucide="map-pin" style="width: 20px; height: 20px;" class="text-primary"></i>
                            <div>
                                <p class="text-muted text-sm">Posto de Saúde</p>
                                <p>${AppState.selectedPosto.nome}</p>
                                <p class="text-muted text-sm">${AppState.selectedPosto.endereco}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Seleção de Data e Horário -->
            <div class="grid md-grid-cols-2 gap-4">
                <!-- Calendário -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title flex items-center gap-2">
                            <i data-lucide="calendar" style="width: 20px; height: 20px;"></i>
                            Selecione a Data
                        </div>
                        <div class="card-description">Escolha o dia para sua vacinação</div>
                    </div>
                    <div class="card-content">
                        <div id="calendar"></div>
                        <div class="alert alert-info mt-4">
                            <div class="text-sm">Domingos não estão disponíveis para agendamento</div>
                        </div>
                    </div>
                </div>
                
                <!-- Horários -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title flex items-center gap-2">
                            <i data-lucide="clock" style="width: 20px; height: 20px;"></i>
                            Selecione o Horário
                        </div>
                        <div class="card-description">
                            ${AppState.selectedDate 
                                ? `Horários disponíveis para ${new Date(AppState.selectedDate).toLocaleDateString('pt-BR')}`
                                : 'Selecione uma data primeiro'
                            }
                        </div>
                    </div>
                    <div class="card-content">
                        ${AppState.selectedDate ? `
                            <div class="horarios-grid">
                                ${HORARIOS_DISPONIVEIS.map(horario => `
                                    <button 
                                        class="btn ${AppState.selectedHorario === horario ? 'btn-primary' : 'btn-outline'}"
                                        onclick="AppState.selectedHorario = '${horario}'; render()"
                                    >
                                        ${horario}
                                    </button>
                                `).join('')}
                            </div>
                        ` : `
                            <div class="empty-state">
                                <i data-lucide="clock" class="empty-state-icon"></i>
                                <p>Selecione uma data para ver os horários disponíveis</p>
                            </div>
                        `}
                    </div>
                </div>
            </div>
            
            <!-- Botão de Confirmação -->
            ${AppState.selectedDate && AppState.selectedHorario ? `
                <div class="card mt-4" style="background-color: var(--bg-accent);">
                    <div class="card-content">
                        <div class="flex items-center justify-between gap-4" style="flex-wrap: wrap;">
                            <div>
                                <p class="mb-2">Agendamento selecionado:</p>
                                <p class="text-muted">
                                    <strong>${new Date(AppState.selectedDate).toLocaleDateString('pt-BR')}</strong> às
                                    <strong>${AppState.selectedHorario}</strong>
                                </p>
                            </div>
                            <button class="btn btn-primary btn-lg" onclick="createAgendamento()">
                                <i data-lucide="check-circle-2" style="width: 20px; height: 20px;"></i>
                                Confirmar Agendamento
                            </button>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

function renderMeusAgendamentosScreen() {
    const agendamentosFuturos = AppState.agendamentos.filter(ag => {
        const agendamentoDate = new Date(ag.data);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return agendamentoDate >= today && ag.status !== 'cancelado';
    });
    
    const agendamentosCancelados = AppState.agendamentos.filter(ag => ag.status === 'cancelado');
    
    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmado':
                return `<span class="badge badge-primary">
                    <i data-lucide="check-circle-2" style="width: 12px; height: 12px;"></i>
                    Confirmado
                </span>`;
            case 'pendente':
                return `<span class="badge" style="border: 1px solid var(--secondary); color: var(--secondary-hover); background-color: rgba(126, 200, 227, 0.2);">
                    <i data-lucide="alert-circle" style="width: 12px; height: 12px;"></i>
                    Pendente
                </span>`;
            case 'cancelado':
                return `<span class="badge badge-secondary">
                    <i data-lucide="x-circle" style="width: 12px; height: 12px;"></i>
                    Cancelado
                </span>`;
        }
    };
    
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };
    
    return `
        <div class="container">
            <!-- Header -->
            <div class="header-section">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h1>Meus Agendamentos</h1>
                        <p class="text-muted">Visualização, confirmação, reagendamento ou cancelamento de agendamentos</p>
                    </div>
                    <button class="btn btn-primary" onclick="navigateTo('postos')">
                        <i data-lucide="plus" style="width: 16px; height: 16px;"></i>
                        Novo Agendamento
                    </button>
                </div>
            </div>
            
            <!-- Agendamentos Futuros -->
            ${agendamentosFuturos.length > 0 ? `
                <div class="mb-8">
                    <h2 class="mb-4 flex items-center gap-2">
                        <i data-lucide="calendar" style="width: 20px; height: 20px;" class="text-primary"></i>
                        Próximos Agendamentos
                    </h2>
                    <div class="flex flex-col gap-4">
                        ${agendamentosFuturos.map(ag => `
                            <div class="card card-hover">
                                <div class="card-header">
                                    <div class="flex items-start justify-between">
                                        <div class="flex-1">
                                            <div class="card-title">
                                                <i data-lucide="syringe" style="width: 20px; height: 20px;" class="text-primary"></i>
                                                ${ag.vacina}
                                            </div>
                                            <div class="card-description mt-2 capitalize">${formatDate(ag.data)}</div>
                                        </div>
                                        ${getStatusBadge(ag.status)}
                                    </div>
                                </div>
                                <div class="card-content">
                                    <div class="grid md-grid-cols-2 mb-4">
                                        <div class="flex items-center gap-3">
                                            <i data-lucide="map-pin" style="width: 20px; height: 20px;" class="text-primary"></i>
                                            <div>
                                                <p class="text-sm text-muted">Local</p>
                                                <p>${ag.posto}</p>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-3">
                                            <i data-lucide="clock" style="width: 20px; height: 20px;" class="text-primary"></i>
                                            <div>
                                                <p class="text-sm text-muted">Horário</p>
                                                <p>${ag.horario}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    ${ag.status === 'confirmado' ? `
                                        <div class="alert alert-info mb-4">
                                            <i data-lucide="check-circle-2" style="width: 16px; height: 16px;" class="text-primary"></i>
                                            <div>Agendamento confirmado! Não se esqueça de levar um documento com foto.</div>
                                        </div>
                                    ` : ''}
                                    
                                    ${ag.status === 'pendente' ? `
                                        <div class="alert mb-4" style="background-color: #eff6ff; border-color: #bfdbfe;">
                                            <i data-lucide="alert-circle" style="width: 16px; height: 16px; color: var(--secondary);"></i>
                                            <div>Aguardando confirmação do posto de saúde.</div>
                                        </div>
                                    ` : ''}
                                    
                                    <div class="flex gap-2">
                                        <button class="btn btn-destructive" onclick="showCancelModal('${ag.id}')">
                                            <i data-lucide="x-circle" style="width: 16px; height: 16px;"></i>
                                            Cancelar Agendamento
                                        </button>
                                        <button class="btn btn-outline">
                                            <i data-lucide="calendar" style="width: 16px; height: 16px;"></i>
                                            Reagendar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : `
                <div class="card text-center p-12 mb-8">
                    <i data-lucide="calendar" style="width: 64px; height: 64px; margin: 0 auto 1rem; color: var(--text-muted);"></i>
                    <h3 class="mb-2">Nenhum agendamento futuro</h3>
                    <p class="text-muted mb-6">Você não possui agendamentos programados no momento.</p>
                    <button class="btn btn-primary" onclick="navigateTo('postos')" style="margin: 0 auto;">
                        <i data-lucide="plus" style="width: 16px; height: 16px;"></i>
                        Fazer Novo Agendamento
                    </button>
                </div>
            `}
            
            <!-- Agendamentos Cancelados -->
            ${agendamentosCancelados.length > 0 ? `
                <div>
                    <h2 class="mb-4 flex items-center gap-2 text-muted">
                        <i data-lucide="x-circle" style="width: 20px; height: 20px;"></i>
                        Agendamentos Cancelados
                    </h2>
                    <div class="flex flex-col gap-4">
                        ${agendamentosCancelados.map(ag => `
                            <div class="card opacity-60" style="border-color: #d1d5db;">
                                <div class="card-header">
                                    <div class="flex items-start justify-between">
                                        <div class="flex-1">
                                            <div class="card-title text-muted">
                                                <i data-lucide="syringe" style="width: 20px; height: 20px;"></i>
                                                ${ag.vacina}
                                            </div>
                                            <div class="card-description mt-2 capitalize">${formatDate(ag.data)}</div>
                                        </div>
                                        ${getStatusBadge(ag.status)}
                                    </div>
                                </div>
                                <div class="card-content">
                                    <div class="grid md-grid-cols-2 text-muted">
                                        <div class="flex items-center gap-3">
                                            <i data-lucide="map-pin" style="width: 20px; height: 20px;"></i>
                                            <div>
                                                <p class="text-sm">Local</p>
                                                <p>${ag.posto}</p>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-3">
                                            <i data-lucide="clock" style="width: 20px; height: 20px;"></i>
                                            <div>
                                                <p class="text-sm">Horário</p>
                                                <p>${ag.horario}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

// Modal de Cancelamento
let currentCancelId = null;

function showCancelModal(id) {
    currentCancelId = id;
    const modal = document.createElement('div');
    modal.id = 'cancel-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title">Confirmar Cancelamento</div>
                <div class="modal-description">
                    Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="closeCancelModal()">
                    Não, manter agendamento
                </button>
                <button class="btn" style="background-color: var(--text-destructive); color: white;" onclick="confirmCancel()">
                    Sim, cancelar
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeCancelModal() {
    const modal = document.getElementById('cancel-modal');
    if (modal) {
        modal.remove();
    }
    currentCancelId = null;
}

function confirmCancel() {
    if (currentCancelId) {
        cancelAgendamento(currentCancelId);
        closeCancelModal();
    }
}

// Calendário
function renderCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;
    
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const prevMonthLastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
    
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    let html = `
        <div class="calendar">
            <div class="calendar-header">
                <button class="btn btn-outline" onclick="changeMonth(-1)">
                    <i data-lucide="chevron-left" style="width: 16px; height: 16px;"></i>
                </button>
                <div>${currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</div>
                <button class="btn btn-outline" onclick="changeMonth(1)">
                    <i data-lucide="chevron-right" style="width: 16px; height: 16px;"></i>
                </button>
            </div>
            <div class="calendar-grid">
                <div class="calendar-weekday">Dom</div>
                <div class="calendar-weekday">Seg</div>
                <div class="calendar-weekday">Ter</div>
                <div class="calendar-weekday">Qua</div>
                <div class="calendar-weekday">Qui</div>
                <div class="calendar-weekday">Sex</div>
                <div class="calendar-weekday">Sáb</div>
    `;
    
    // Dias do mês anterior
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthLastDay.getDate() - i;
        html += `<div class="calendar-day outside">${day}</div>`;
    }
    
    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const dateStr = date.toISOString().split('T')[0];
        const isPast = date < today;
        const isSunday = date.getDay() === 0;
        const isSelected = AppState.selectedDate === dateStr;
        const isDisabled = isPast || isSunday;
        
        html += `
            <div class="calendar-day ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}"
                 onclick="${!isDisabled ? `AppState.selectedDate = '${dateStr}'; render()` : ''}">
                ${day}
            </div>
        `;
    }
    
    // Dias do próximo mês
    const remainingCells = 42 - (firstDayOfWeek + daysInMonth);
    for (let day = 1; day <= remainingCells; day++) {
        html += `<div class="calendar-day outside">${day}</div>`;
    }
    
    html += '</div></div>';
    
    calendarEl.innerHTML = html;
    lucide.createIcons();
}

function changeMonth(delta) {
    // Implementação futura para navegação entre meses
    render();
}

// Render Principal
function render() {
    const app = document.getElementById('app');
    
    let content = '';
    
    switch (AppState.currentScreen) {
        case 'postos':
            content = renderPostosScreen();
            break;
        case 'disponibilidade':
            content = renderDisponibilidadeScreen();
            break;
        case 'agendamento':
            content = renderAgendamentoScreen();
            break;
            default:
            content = `<h2>Tela ${AppState.currentScreen} não encontrada</h2>`;
        case 'meus-agendamentos':
            
            // console.log("Oiiiiii!");
            
            content = renderMeusAgendamentosScreen();
            // window.location.href = '../vitoria/familia/familia.html'; 

            break;
    }
    
    app.innerHTML = content;
    
    // Renderizar calendário se estiver na tela de agendamento
    if (AppState.currentScreen === 'agendamento') {
        setTimeout(renderCalendar, 0);
    }
    
    // Inicializar ícones Lucide
    lucide.createIcons();
}

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', () => {
    render();
});
