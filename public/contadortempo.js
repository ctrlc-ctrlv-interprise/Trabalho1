  // Função para formatar o tempo em minutos e segundos
  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

// Inicializa o contador de tempo
let sessionTime = 0;
const sessionElement = document.getElementById('tempo-sessao');

// Atualiza o tempo de sessão a cada segundo
setInterval(() => {
    sessionTime++;
    sessionElement.textContent = `Tempo de Sessão: ${formatTime(sessionTime)}`;
}, 1000);