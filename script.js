const input = document.getElementById("novaTarefa");
const lista = document.getElementById("listaTarefas");
const adicionarBtn = document.getElementById("adicionarBtn");
const limparTudoBtn = document.getElementById("limparTudoBtn");
const exportarCSVBtn = document.getElementById("exportarCSVBtn");

function salvarTarefas() {
  const tarefas = Array.from(lista.children).map((li) => ({
    texto: li.querySelector("span").textContent,
    concluida: li.classList.contains("concluida")
  }));
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function carregarTarefas() {
  const tarefasSalvas = JSON.parse(localStorage.getItem("tarefas")) || [];
  tarefasSalvas.forEach((tarefa) => adicionarTarefa(tarefa.texto, tarefa.concluida));
}

function adicionarTarefa(texto, concluida = false) {
  if (!texto.trim()) return;

  const li = document.createElement("li");
  if (concluida) li.classList.add("concluida");

  const span = document.createElement("span");
  span.textContent = texto;
  span.onclick = () => {
    li.classList.toggle("concluida");
    salvarTarefas();
  };

  const removerBtn = document.createElement("button");
  removerBtn.textContent = "🗑️";
  removerBtn.onclick = () => {
    li.remove();
    salvarTarefas();
  };

  li.appendChild(span);
  li.appendChild(removerBtn);
  lista.appendChild(li);
  input.value = "";
  input.focus();

  salvarTarefas();
}

adicionarBtn.onclick = () => adicionarTarefa(input.value);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") adicionarTarefa(input.value);
});

limparTudoBtn.onclick = () => {
  if (confirm("Tem certeza que deseja remover todas as tarefas?")) {
    lista.innerHTML = "";
    salvarTarefas();
  }
};

exportarCSVBtn.onclick = () => {
  const tarefas = Array.from(lista.children).map((li) => ({
    texto: li.querySelector("span").textContent,
    concluida: li.classList.contains("concluida") ? "Sim" : "Não"
  }));

  if (tarefas.length === 0) {
    alert("Nenhuma tarefa para exportar.");
    return;
  }

  let csv = "Tarefa,Concluída\n";
  tarefas.forEach((t) => {
    const texto = `"${t.texto.replace(/"/g, '""')}"`; // escapa aspas duplas
    const status = t.concluida;
    csv += `${texto},${status}\n`;
  });

  // Adiciona o BOM (Byte Order Mark) no início do arquivo
  const BOM = '\uFEFF'; // <- Isso força UTF-8 com acentos a funcionar
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "tarefas.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
carregarTarefas();
