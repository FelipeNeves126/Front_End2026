const produto = {
    "123": {"nome": "Coca-cola espumante", "preco": 9.99},
    "456": {"nome": "Pão de forma", "preco": 4.29},
    "789": {"nome": "Bandeja de mortadela", "preco": 3.89}
}

let carrinho = [];

const audio = new Audio("bip.mp3");

window.onload = () => {
    document.getElementById("cod").focus();
}

function addProduto(){
    const codValue = document.getElementById("cod");
    const qtdValue = document.getElementById("qnt");

    const codigo = codValue.value;
    const quantidade = qtdValue.value;

    if(!produto[codigo]){
        alert("Produto não encontrado!");
        return;
    }

    const produtoBase = produto[codigo];
    const item = {
        nome: produtoBase.nome,
        preco: produtoBase.preco,
        quantidade: quantidade,
        subtotal: produtoBase.preco * quantidade,
    };

    carrinho.push(item);

    audio.currentTime = 0;
    audio.play().catch(e => console.log("Áudio bloqueado pelo navegador"));

    codElement.value= "";

    atualizarTela();
    
}

function atualizarTela() {
    const lista = getElementById("lista");
    lista.innerHTML = "";

    let total = 0;

    carrinho.forEach((item, index) => {
        total+= item.subtotal;

        const li = document.createElement("li");

        li.innerHTML = `<div class="d-flex justify-content-between">
            <strong>${item.nome}</strong>
            <small> ${item.quantidade} x R$ ${item.preco} = <strong>${item.subtotal}</strong></small>
            `;

        lista.appendChild(li);

    });


}