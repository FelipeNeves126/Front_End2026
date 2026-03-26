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
        
        if(contador === 30){
            img.src = estados.alimentado
        }
        
        if(contador === 60){
            img.src = estados.bravo
        }
    }, 1000)
}

function alimentar(){
    img.src = estados.alimentado
    contador = 0;
    console.log("Comendo");

    if(time_click) clearInterval(time_click)
        time_click = setTimeout(() => {
            img.src = estados.normal;
            time_out = setTimeout(() => {
                img.src = estados.bravo;
            }, 2000);
    },1000);
}

initConta();