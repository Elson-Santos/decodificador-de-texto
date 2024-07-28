// Mapeamento de caracteres para encriptação
const mappings = [
  ["e", "enter"],
  ["o", "ober"],
  ["i", "imes"],
  ["a", "ai"],
  ["u", "ufat"],
];

// Normaliza o texto: remove acentos e caracteres não permitidos
const normalizeText = (text) => {
  const normalized = text
    .toLowerCase() // Converte para minúsculas
    .normalize("NFD") // Decomposição dos caracteres acentuados
    .replace(/[\u0300-\u036f]/g, ""); // Remove os acentos

  // Verifica se o texto contém apenas letras e espaços permitidos
  const isValid = /^[a-z\s]+$/.test(normalized);
  return isValid ? normalized : "";
};

// Função para transformar o texto
const transformText = (text, encrypt) => {
  return mappings.reduce((acc, [original, replacement]) => {
    const [from, to] = encrypt
      ? [original, replacement]
      : [replacement, original];
    return acc.replaceAll(from, to);
  }, text);
};

// Função para atualizar a interface
const updateUI = (newText, showCopyButton) => {
  const elements = {
    outputText: document.getElementById("textoFinal"),
    rightSection: document.getElementById("rigth"),
    inputText: document.getElementById("textoInput"),
    mascot: document.getElementById("cadeado"),
    infoText: document.getElementById("textoInfo"),
    copyButton: document.getElementById("tecla__copiar"),
  };

  elements.outputText.innerHTML = newText;
  elements.outputText.classList.toggle("ajustar", newText !== "");
  elements.rightSection.classList.toggle("ajuste", newText !== "");
  elements.inputText.value = "";
  elements.inputText.style.height = "auto";
  elements.inputText.placeholder = "Digite seu texto";
  elements.mascot.classList.toggle("ocultar", newText !== "");
  elements.infoText.classList.toggle("ocultar", newText !== "");
  elements.copyButton.classList.toggle("bn_ocultar", !showCopyButton);
  if (showCopyButton) elements.copyButton.focus();
};

// Resetar a interface
const resetUI = () => {
  updateUI("", false);
  document.getElementById("textoInput").focus();
};

// Adiciona event listeners
document.getElementById("tecla__encriptar").addEventListener("click", () => {
  const text = normalizeText(document.getElementById("textoInput").value);
  if (text) {
    updateUI(transformText(text, true), true);
  } else {
    alert("Escreva texto válido para criptografar (somente letras sem acento)");
    resetUI();
  }
});

document.getElementById("tecla__desencriptar").addEventListener("click", () => {
  const text = normalizeText(document.getElementById("textoInput").value);
  if (text) {
    updateUI(transformText(text, false), true);
  } else {
    alert(
      "Escreva texto válido para descriptografar (somente palavras sem acento)"
    );
    resetUI();
  }
});

document.getElementById("tecla__copiar").addEventListener("click", () => {
  navigator.clipboard
    .writeText(document.getElementById("textoFinal").textContent)
    .then(() => {
      alert("Texto copiado com Sucesso!");
      resetUI();
    });
});

// Impede a digitação de caracteres acentuados e outros caracteres não permitidos
document.getElementById("textoInput").addEventListener("input", (e) => {
  // Remove caracteres não permitidos e atualiza o valor do campo de texto
  const filteredText = e.target.value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z\s]/g, ""); // Remove caracteres não alfabéticos e não espaços

  e.target.value = filteredText;
  e.target.style.height = "auto";
  e.target.style.height = `${e.target.scrollHeight}px`;
});
