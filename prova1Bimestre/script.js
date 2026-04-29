function MostrarTabela(){
    let container = document.getElementById('containerTabela');
     
    container.innerHTML= "";

    let imagemTabela = document.createElement('img');

    imagemTabela.src = "Tabela_Jogos.png";
    imagemTabela.alt = "Tabela de jogos da copa";

    imagemTabela.classList.add('tabela-imagem');

    container.appendChild(imagemTabela);
}