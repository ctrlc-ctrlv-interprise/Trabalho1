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
            var dadosArquivo = conteudoArquivo;
            console.log("Dados do arquivo armazenados:", dadosArquivo); 
            for(var i =0; i>50; i++){

            var indexStart;
            var indexEnd;
                indexStart = dadosArquivo.indexOf("ClassName:") + 10;
                indexEnd = dadosArquivo.indexOf(";");
                const className = (dadosArquivo.substring(indexStart, indexEnd)).trim();

                dadosArquivo = dadosArquivo.replace(dadosArquivo.substring(0, indexEnd+1), "")

                indexStart = dadosArquivo.indexOf("ClassTimeCode:") + 14;
                indexEnd = dadosArquivo.indexOf(";");
                const classTimeCode = (dadosArquivo.substring(indexStart, indexEnd)).trim();

                dadosArquivo = dadosArquivo.replace(dadosArquivo.substring(0, indexEnd+1), "")
                indexStart = dadosArquivo.indexOf("ClassCode:") + 10;
                indexEnd = dadosArquivo.indexOf(";");
                const classCode = (dadosArquivo.substring(indexStart, indexEnd)).trim();

                dadosArquivo = dadosArquivo.replace(dadosArquivo.substring(0, indexEnd+1), "")
                
            
            const classInfo = {
                ClassName: className,
                ClassTimeCode: classTimeCode,
                ClassCode: classCode
            }

            console.log(submit(classInfo))
        }            

            // Exibe o conteúdo do arquivo em um alerta
            //alert("Conteúdo do arquivo:\n" + dadosArquivo);
        };

        // Lê o conteúdo do arquivo como texto
        leitor.readAsText(arquivo);
    } else {
        alert("Por favor, selecione um arquivo .txt.");
    }

});

async function submit(classInfo){
    const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const result = await fetch("http://localhost:3333/", {
            method: "POST",
                body: JSON.stringify(classInfo),
                headers: myHeaders,
            });
        if(result.status !=200) return alert('Informação invalida');
        return alert('Matéria adicionada')
}
