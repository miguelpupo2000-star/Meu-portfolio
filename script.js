window.onload = function() {
    
    const botao = document.getElementById("btn-mudar-texto");
    const titulo = document.getElementById("titulo-boas-vindas");
    const campoNome = document.getElementById("campo-nome");

    // Criamos uma função separada para reaproveitar o mesmo código no clique e no Enter
    function enviarNome() {
        const nomeDigitado = campoNome.value;

        if (nomeDigitado !== "") {
            titulo.innerText = "👋 Olá, " + nomeDigitado + "! Seja bem-vindo!";
            campoNome.value = ""; // Limpa a caixa
        } else {
            titulo.innerText = "Por favor, digite um nome! 😊";
        }
    }

    // 1. Executa a função ao clicar no botão com o mouse
    botao.onclick = enviarNome;

    // 2. Executa a função ao apertar uma tecla dentro do campo de texto
    campoNome.onkeydown = function(evento) {
        // Verifica se a tecla pressionada foi especificamente o "Enter"
        if (evento.key === "Enter") {
            enviarNome(); // Roda a mesma função de envio
        }
    };
    
};
// LÓGICA DO INTERRUPTOR DARK / LIGHT MODE
const btnTema = document.getElementById('btn-tema');

btnTema.addEventListener('click', () => {
    // Adiciona ou remove a classe light-mode do corpo do site
    document.body.classList.toggle('light-mode');

    // Troca o texto e o ícone baseado no modo atual
    if (document.body.classList.contains('light-mode')) {
        btnTema.innerHTML = '<i class="fas fa-moon"></i> Modo Escuro';
    } else {
        btnTema.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
    }
});
// ==================================================
// LOGICA DE REVELAÇÃO AO ROLAR A PAGINA
// ==================================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Selecionamos as seções e os cards que queremos animar
    const elementosParaAnimar = document.querySelectorAll('#sobre, #projetos, .card, #contato');

    // 2. Colocamos a classe de "escondido" em todos eles de forma automatica
    elementosParaAnimar.forEach(el => el.classList.add('revelar-elemento'));

    // 3. Criamos o "Vigiador" de tela (Intersection Observer)
    const vigiadorDeScroll = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            // Se o elemento apareceu na tela do usuario
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visivel'); // Faz ele surgir subindo
                vigiadorDeScroll.unobserve(entrada.target); // Para de vigiar para rodar a animação só uma vez
            }
        });
    }, {
        threshold: 0.15 // Dispara o efeito quando 15% do elemento estiver visivel na tela
    });

    // 4. Mandamos o vigiador monitorar cada um dos elementos escolhidos
    elementosParaAnimar.forEach(el => vigiadorDeScroll.observe(el));
});
// ==================================================
// FORMULÁRIO DE CONTATO INTELIGENTE COM PRE-PREENCHIMENTO
// ==================================================
const campoNome = document.getElementById('campo-nome');
const linkEmail = document.getElementById('link-email');

// Função que atualiza o link do e-mail com o nome do usuário
function atualizarLinkEmail() {
    const nomeVisitante = campoNome.value.trim();
    const meuEmail = "migueldev.contato@gmail.com";
    
    // Assunto do e-mail codificado para a web
    const assunto = encodeURIComponent("Contato através do Portfólio");
    
    // Mensagem padrão que muda se a pessoa digitou o nome ou não
    let corpoMensagem = "Olá Miguel, gostaria de trocar uma ideia sobre desenvolvimento web!";
    if (nomeVisitante !== "") {
        corpoMensagem = `Olá Miguel, meu nome é ${nomeVisitante} e gostaria de trocar uma ideia sobre desenvolvimento web!`;
    }
    
    const corpoCodificado = encodeURIComponent(corpoMensagem);

    // Monta a URL mágica do mailto: email?subject=Assunto&body=Mensagem
    linkEmail.href = `mailto:${meuEmail}?subject=${assunto}&body=${corpoCodificado}`;
}

// Escuta quando o usuário digita no campo de texto para atualizar o link na hora
campoNome.addEventListener('input', atualizarLinkEmail);

// Roda uma vez ao carregar a página para o link já nascer configurado
atualizarLinkEmail();
// ==================================================
// EFEITO MÁQUINA DE ESCREVER (TYPEWRITER EFFECT)
// ==================================================
const elementoTexto = document.getElementById("texto-digitado");

// Lista de palavras que vão ficar alternando na tela
const palavras = ["Front-End", "HTML", "CSS", "JavaScript"];
let indicePalavra = 0;
let indiceLetra = 0;
let estaApagando = false;

function iniciarDigitacao() {
    // Pega a palavra atual da lista
    const palavraAtual = palavras[indicePalavra];
    
    if (estaApagando) {
        // Se estiver no modo de apagar, remove uma letra
        elementoTexto.textContent = palavraAtual.substring(0, indiceLetra - 1);
        indiceLetra--;
    } else {
        // Se estiver no modo de digitar, adiciona uma letra
        elementoTexto.textContent = palavraAtual.substring(0, indiceLetra + 1);
        indiceLetra++;
    }

    // Define a velocidade padrão da digitação (milisegundos)
    let velocidade = estaApagando ? 50 : 100;

    // Se a palavra foi toda digitada
    if (!estaApagando && indiceLetra === palavraAtual.length) {
        velocidade = 1500; // Espera 1.5 segundos parada na tela para o usuário ler
        estaApagando = true;
    } 
    // Se a palavra foi toda apagada
    else if (estaApagando && indiceLetra === 0) {
        estaApagando = false;
        indicePalavra++; // Pula para a próxima palavra da lista
        
        // Se chegou ao fim da lista de palavras, volta para a primeira
        if (indicePalavra === palavras.length) {
            indicePalavra = 0;
        }
        velocidade = 500; // Dá uma pausa de meio segundo antes de começar a próxima
    }

    // Chama a função novamente após o tempo definido criar o loop contínuo
    setTimeout(iniciarDigitacao, velocidade);
}

// Inicia o efeito assim que o script carrega
iniciarDigitacao();
