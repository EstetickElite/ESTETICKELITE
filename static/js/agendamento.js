document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formAgendamento");

    if (!formulario) {
        console.error("ERRO: formAgendamento não encontrado.");
        return;
    }

    formulario.addEventListener("submit", function (event) {

        event.preventDefault();

        // PEGAR DADOS DO FORMULÁRIO
        const nome = document.getElementById("nomeCliente").value.trim();
        const veiculo = document.getElementById("veiculoCliente").value.trim();
        const placa = document.getElementById("placa-veiculo").value.trim().toUpperCase();
        const servico = document.getElementById("servicoCliente").value;
        const data = document.getElementById("dataCliente").value;
        const horario = document.getElementById("horarioCliente").value;
        const observacoes = document.getElementById("observacoesCliente").value.trim();

        const pagamento = document.querySelector(
            'input[name="pagamento"]:checked'
        );

        // VERIFICAR PAGAMENTO
        if (!pagamento) {
            alert("Selecione uma forma de pagamento.");
            return;
        }

        // CRIAR AGENDAMENTO
        const novoAgendamento = {
            id: Date.now(),
            nome: nome,
            veiculo: veiculo,
            placa: placa,
            servico: servico,
            data: data,
            horario: horario,
            observacoes: observacoes || "Nenhuma observação",
            pagamento: pagamento.value,
            status: "agendado"
        };

        // PEGAR AGENDAMENTOS JÁ SALVOS
        let agendamentos = [];

        try {
            const dadosSalvos = localStorage.getItem(
                "agendamentosEstetickElite"
            );

            if (dadosSalvos) {
                agendamentos = JSON.parse(dadosSalvos);
            }

            if (!Array.isArray(agendamentos)) {
                agendamentos = [];
            }

        } catch (erro) {
            console.error("Erro ao ler agendamentos:", erro);
            agendamentos = [];
        }

        // ADICIONAR NOVO
        agendamentos.push(novoAgendamento);

        // SALVAR
        try {

            localStorage.setItem(
                "agendamentosEstetickElite",
                JSON.stringify(agendamentos)
            );

        } catch (erro) {

            console.error("Erro ao salvar agendamento:", erro);

            alert("Não foi possível salvar o agendamento.");
            return;
        }

        // CONFIRMAÇÃO
        const mensagem =
            document.getElementById("mensagemAgendamento");

        if (mensagem) {

            mensagem.innerHTML = `
                <div class="alert alert-success">
                    <strong>Agendamento realizado com sucesso!</strong>
                    <br>
                    Seu agendamento foi enviado para o painel administrativo.
                </div>
            `;
        }

        alert("Agendamento realizado com sucesso!");

        console.log("=================================");
        console.log("AGENDAMENTO SALVO");
        console.log("=================================");
        console.log(novoAgendamento);
        console.log("=================================");
        console.log("TODOS OS AGENDAMENTOS");
        console.log(agendamentos);

        // LIMPAR FORMULÁRIO
        formulario.reset();

    });

});
