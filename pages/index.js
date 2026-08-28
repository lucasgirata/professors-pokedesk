function typeEffect(element, text, speed) {
  let index = 0;
  element.textContent = "";

  function type() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  }

  type();
}

const speech = '"Olá treinador! Pronto pra começar sua pesquisa?"';
const textBox = document.getElementById("speech");

typeEffect(textBox, speech, 90);
