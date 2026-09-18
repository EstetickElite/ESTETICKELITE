// =========================================================
// ESTETICKELITE
// SISTEMA DE AGENDAMENTO
// SALVAR AGENDAMENTOS
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("formAgendamento");

    if (!form) {
        console.error("Formulário de agendamento não encontrado.");
        return;
    }

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        // =====================================================
        // PEGAR CAMPOS
        // =====================================================

        const nome = document.getElementById("nomeCliente").value.trim();

        const veiculo = document
            .getElementById("veiculoCliente")
            .value
            .trim();

        const placa = document
            .getElementById("placa-veiculo")
            .value
            .trim()
            .toUpperCase();

        const servico = document
            .getElementById("servicoCliente")
            .value;

        const data = document
            .getElementById("dataCliente")
            .value;

        const horario = document
            .getElementById("horarioCliente")
            .value;

        const observacoes = document
            .getElementById("observacoesCliente")
            .value
            .trim();

        const pagamentoSelecionado = document.querySelector(
            'input[name="pagamento"]:checked'
        );

        // =====================================================
        // VERIFICAR PAGAMENTO
        // =====================================================

        if (!pagamentoSelecionado) {
            alert("Selecione uma forma de pagamento.");
            return;
        }

        // =====================================================
        // CRIAR AGENDAMENTO
        // =====================================================

        const novoAgendamento = {
            id: Date.now(),

            nome: nome,

            veiculo: veiculo,

            placa: placa,

            servico: servico,

            data: data,

            horario: horario,

            observacoes: observacoes,

            pagamento: pagamentoSelecionado.value,

            status: "agendado"
        };

        // =====================================================
        // PEGAR AGENDAMENTOS EXISTENTES
        // =====================================================

        let agendamentos = JSON.parse(
            localStorage.getItem("agendamentosEstetickElite")
        ) || [];

        // =====================================================
        // ADICIONAR NOVO AGENDAMENTO
        // =====================================================

        agendamentos.push(novoAgendamento);

        // =====================================================
        // SALVAR NO LOCALSTORAGE
        // =====================================================

        localStorage.setItem(
            "agendamentosEstetickElite",
            JSON.stringify(agendamentos)
        );

        // =====================================================
        // MENSAGEM
        // =====================================================

        const mensagem = document.getElementById(
            "mensagemAgendamento"
        );

        if (mensagem) {
            mensagem.innerHTML = `
                <div class="alert alert-success">
                    <strong>Agendamento realizado com sucesso!</strong><br>
                    Seu agendamento foi registrado.
                </div>
            `;
        }

        alert("Agendamento realizado com sucesso!");

        // =====================================================
        // LIMPAR FORMULÁRIO
        // =====================================================

        form.reset();

        // =====================================================
        // ESCONDER ÁREAS DE PAGAMENTO
        // =====================================================

        const dadosPix = document.getElementById("dados-pix");

        const dadosCartao = document.getElementById("dados-cartao");

        if (dadosPix) {
            dadosPix.style.display = "none";
        }

        if (dadosCartao) {
            dadosCartao.style.display = "none";
        }

        // =====================================================
        // CONSOLE PARA TESTE
        // =====================================================

        console.log(
            "Agendamento salvo:",
            novoAgendamento
        );

        console.log(
            "Todos os agendamentos:",
            agendamentos
        );
    });

});

