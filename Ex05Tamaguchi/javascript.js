const img = document.getElementById("main");
const bnt = document.getElementById("btn");

 const estados = {
    normal: "imagens/tamaguchi.png",
    alimentado: "imagens/tamaguchi_comendo.png",
    bravo: "imagens/tamaguchi_bravo.png"
 };

 let contador = 0;
 let intervalo = null;
 let timeClick = null;
 let timeOut = null;

 function initConta(){
    if(intervalo) clearInterval(intervalo);

    intervalo = setInterval(() => {

        contador++;
        
        console.log("Tempo:", contador);
        
        if(contador == 30){
            img.src = estados.alimentado
        }
        
        if(contador == 60){
            img.src = estados.bravo
        }
    }, 1000)
};

initConta();