
document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;
    const isInsidePaginas = currentPath.includes("/paginas/");
    const basePath = isInsidePaginas ? ".." : ".";

    const loadFragment = (containerId, fragmentPath) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        fetch(`${basePath}/${fragmentPath}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Não foi possível carregar ${fragmentPath}`);
                }
                return response.text();
            })
            .then(html => {
                container.innerHTML = html;
            })
            .catch(error => {
                console.error(error);
            });
    };

    loadFragment("header-container", "fragments/header.html");
    loadFragment("footer-container", "fragments/footer.html");
});
var qrGerado = false;
var timerInterval = null;
var TEMPO_TOTAL = 5 * 60; // 5 minutos em segundos

function resetarEtapasPix() {
    document.getElementById('pix-confirmacao').style.display = 'block';
    document.getElementById('pix-qr-area').style.display = 'none';
    document.getElementById('pix-expirado').style.display = 'none';

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function iniciarContagemPix() {
    var segundosRestantes = TEMPO_TOTAL;
    var timerEl = document.getElementById('pix-timer');

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    atualizarTimer();

    timerInterval = setInterval(function () {
        segundosRestantes--;

        if (segundosRestantes <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;

            // Esconde o QR Code e mostra a mensagem de expirado
            document.getElementById('pix-qr-area').style.display = 'none';
            document.getElementById('pix-expirado').style.display = 'block';

            // Limpa o QR Code para que um novo seja gerado da próxima vez
            document.getElementById('qrcode-pix').innerHTML = '';
            qrGerado = false;
        } else {
            atualizarTimer();
        }
    }, 1000);

    function atualizarTimer() {
        var minutos = Math.floor(segundosRestantes / 60);
        var segundos = segundosRestantes % 60;
        timerEl.textContent = 'Expira em ' +
            String(minutos).padStart(2, '0') + ':' +
            String(segundos).padStart(2, '0');
    }
}

function gerarQrCodePix() {
    document.getElementById('pix-confirmacao').style.display = 'none';
    document.getElementById('pix-expirado').style.display = 'none';
    document.getElementById('pix-qr-area').style.display = 'block';

    if (!qrGerado) {
        new QRCode(document.getElementById('qrcode-pix'), {
            text: document.getElementById('pix-copia-cola-input').value,
            width: 180,
            height: 180,
            colorDark: '#1a1a1a',
            colorLight: '#ffffff'
        });
        qrGerado = true;
    }

    iniciarContagemPix();
}

// Alterna a exibição dos campos de cartão/pix conforme a forma de pagamento escolhida
document.querySelectorAll('input[name="pagamento"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
        var dadosCartao = document.getElementById('dados-cartao');
        var dadosPix = document.getElementById('dados-pix');

        if (this.value === 'credito' || this.value === 'debito') {
            dadosCartao.style.display = 'block';
            dadosPix.style.display = 'none';
        } else if (this.value === 'pix') {
            dadosCartao.style.display = 'none';
            dadosPix.style.display = 'block';
            resetarEtapasPix();
        }
    });
});

// Botão "Sim, é o Pix que eu vou pagar" -> gera QR Code e inicia contagem
document.getElementById('btn-confirmar-pix').addEventListener('click', function () {
    gerarQrCodePix();
});

// Botão "Gerar novo QR Code" após expiração
document.getElementById('btn-gerar-novo-pix').addEventListener('click', function () {
    gerarQrCodePix();
});

// Botão "Copiar" do código Pix copia e cola
document.getElementById('btn-copiar-pix').addEventListener('click', function () {
    var input = document.getElementById('pix-copia-cola-input');
    input.select();
    navigator.clipboard.writeText(input.value).then(function () {
        var btn = document.getElementById('btn-copiar-pix');
        var textoOriginal = btn.textContent;
        btn.textContent = 'Copiado!';
        setTimeout(function () {
            btn.textContent = textoOriginal;
        }, 1500);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;
    const isInsidePaginas = currentPath.includes("/paginas/");
    const basePath = isInsidePaginas ? ".." : ".";

    const loadFragment = (containerId, fragmentPath) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        fetch(`${basePath}/${fragmentPath}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Não foi possível carregar ${fragmentPath}`);
                }
                return response.text();
            })
            .then(html => {
                container.innerHTML = html;
            })
            .catch(error => {
                console.error(error);
            });
    };

    loadFragment("header-container", "fragments/header.html");
    loadFragment("footer-container", "fragments/footer.html");
});

