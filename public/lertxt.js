document.getElementById('formularioUpload').addEventListener('submit', function(evento) {
    evento.preventDefault();

    // Monitora o clique no botão de envio, com uma função de escutador.
    // o preventDefault previne o comportamento padrão do formulário,
    // que é aquela parte de enviar dados para o servidor e recarregar a página.

    // Armazenamos o arquivo selecionado em uma lista com a propriedade files
    // e indicamos a primeira posição para ele, sendo a primeira a única posição.
    const inputArquivo = document.getElementById('inputArquivo');
    const arquivo = inputArquivo.files[0];

    // Agora o código verificará se o arquivo foi selecionado,
    // se não foi, teremos um alerta pedindo para selecionar algum arquivo
    if (arquivo) {
        const leitor = new FileReader(); // Criamos uma instância do FileReader para ler o conteúdo do arquivo

        leitor.onload = function(e) {
            const conteudoArquivo = e.target.result; // Conteúdo do arquivo .txt
            console.log("Conteúdo do arquivo:", conteudoArquivo);

            // Armazena o conteúdo em uma variável
            const dadosArquivo = conteudoArquivo;
            console.log("Dados do arquivo armazenados:", dadosArquivo); 

            // Exibe o conteúdo do arquivo em um alerta
            //alert("Conteúdo do arquivo:\n" + dadosArquivo);
        };

        // Lê o conteúdo do arquivo como texto
        leitor.readAsText(arquivo);
    } else {
        alert("Por favor, selecione um arquivo .txt.");
    }

});
