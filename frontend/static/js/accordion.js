document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os cabeçalhos de acordeão
    const headers = document.querySelectorAll('.acordeao-header');

    headers.forEach(header => {
        header.addEventListener('click', function() {
            // Encontra o conteúdo correspondente (o próximo elemento irmão com a classe .acordeao-content)
            const content = this.nextElementSibling;

            // Encontra o item de acordeão pai (.secao-acordeao)
            const parent = this.closest('.secao-acordeao');

            // 1. Alterna a classe 'aberto' no cabeçalho
            this.classList.toggle('aberto');
            
            // 2. Alterna a classe 'content-aberto' no conteúdo para abrir/fechar
            content.classList.toggle('content-aberto');
            
            // 3. Aplica a lógica de max-height (necessário para a transição CSS)
            if (content.classList.contains('content-aberto')) {
                // Se estiver aberto, define max-height para a altura real do scroll (ou um valor grande)
                // Usar scrollHeight garante que a animação seja suave e exata.
                content.style.maxHeight = content.scrollHeight + 50 + "px";
            } else {
                // Se estiver fechado, volta para 0
                content.style.maxHeight = "0";
            }
        });
    });

    // Função para garantir que o item ABERTO por padrão tenha a altura correta (para a transição)
    function initializeAccordion() {
        const openedContent = document.querySelector('.acordeao-content.content-aberto');
        if (openedContent) {
            openedContent.style.maxHeight = openedContent.scrollHeight + 50 + "px";
        }
    }
    
    // Inicializa o acordeão
    initializeAccordion();
});