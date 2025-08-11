let lista = []
function mudarTema(){
    const header = document.querySelector("#header");
    if(header.classList.contains("bg-white")){
        header.classList.remove("bg-white", "text-black", "fill-black");
        header.classList.add("bg-black", "text-white", "fill-white");
    }else{
        header.classList.remove("bg-black", "text-white", "fill-white");
        header.classList.add("bg-white", "text-black", "fill-black");
    }
}

function abrirGaveta(editar = false){
    const sombra = document.querySelector("#sombra");
    const gaveta = document.querySelector("#gaveta");
    const formCriar = document.querySelector("#formCriar");
    const formEditar = document.querySelector("#formEditar");

    if(editar){
        formCriar.classList.add("hidden");
        formEditar.classList.remove("hidden");
    }else{
        formEditar.classList.add("hidden");
        formCriar.classList.remove("hidden");
    }

    sombra.classList.remove("invisible", "opacity-0");
    gaveta.classList.remove("invisible", "opacity-0");
}

function fecharGaveta(){
    const sombra = document.querySelector("#sombra");
    const gaveta = document.querySelector("#gaveta");

    sombra.classList.add("invisible", "opacity-0");
    gaveta.classList.add("invisible", "opacity-0");
}

function buscarTarefas(){
    fetch("http://localhost:3000/tarefas")
    .then(resposta => resposta.json())
    .then(json => {
        lista = json;
        carregarTarefas(json);
    })
}

buscarTarefas();

function carregarTarefas(tarefas){
    const listaDeTarefas = document.querySelector("#lista-de-tarefas");
    tarefas.map(tarefa => {
        listaDeTarefas.innerHTML += `
            <div class="bg-white shadow rounded p-4">
                <h3 class="font-bold">${tarefa.titulo}</h3>
                <p class="text-[14px] text-gray-500 line-clamp-3 mb-4">${tarefa.descricao}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-[10px]">${formatarData(tarefa.data)}</span>
                    <div class="flex gap-3">
                        <box-icon name='pencil' onclick="abrirGaveta(true), preencherFormulario(${tarefa.id})"></box-icon>
                        <box-icon name='trash' onclick="deletarTarefa(${tarefa.id})"></box-icon>
                    </div>
                </div>
            </div>
        `;
    })
}

function criarTarefa(){
    event.preventDefault();

    fetch("http://localhost:3000/tarefas", {
        method: "post",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(capturarDados("#formCriar"))
    })
}

function editarTarefa(){
    event.preventDefault();
    const id = document.querySelector("#formEditar input[name='tarefa_id']").value;
    fetch(`http://localhost:3000/tarefas/${id}`, {
        method: "put",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(capturarDados("#formEditar"))
    })
}

function deletarTarefa(idDaTarefa){
    let confirmou = confirm("Deseja realmente apagar este item?");
    if(confirmou){
        fetch(`http://localhost:3000/tarefas/${idDaTarefa}`, {
            method: "delete",
        })
    }
}

function capturarDados(idDeUmFormulario){
    let form = document.querySelector(idDeUmFormulario);
    let formData = new FormData(form);
    let dados = Object.fromEntries(formData.entries())
    let data = new Date();
    dados.data = data.toLocaleDateString().split('/').reverse().join('-');
    return dados;
}

function formatarData(data){
    let dataFormatada = new Date(data);
    return dataFormatada.toLocaleDateString();
}

function preencherFormulario(idDaTarefa){
    let idValue = document.querySelector("#formEditar input[name='tarefa_id']");
    let tituloValue = document.querySelector("#formEditar input[name='titulo']");
    let descricaoValue = document.querySelector("#formEditar textarea[name='descricao']");
    let tarefa = lista.find(item => item.id == idDaTarefa);
    
    idValue.value = tarefa.id;
    tituloValue.value = tarefa.titulo;
    descricaoValue.value = tarefa.descricao;
}