function gerarFicha() {
  const nivel = parseInt(document.getElementById('nivel').value);
  const raca = document.getElementById('raca').value;

  let atributos = {
    FOR: parseInt(document.getElementById('for').value),
    CON: parseInt(document.getElementById('con').value),
    DES: parseInt(document.getElementById('des').value),
    INT: parseInt(document.getElementById('int').value),
    ESP: parseInt(document.getElementById('esp').value),
    CAR: parseInt(document.getElementById('car').value)
  };


  // HP Progressivo
  let hp = 0;
  if (atributos.CON > 0) {
    hp = atributos.CON * (10 + (nivel - 1) * 3);
  } else {
    hp = 10;
  }
  document.getElementById('hp').value = hp;

  // PR Progressivo
  let esp = atributos.ESP > 0 ? atributos.ESP : 0;
  let pr = (nivel * (1 + esp)) + 2;
  document.getElementById('pr').value = pr;

  // PR Recuperado
  let recAttr = document.querySelector('input[name="rec"]:checked').value;
  let recValue = atributos[recAttr.toUpperCase()];
  let prRec = recValue > 0 ? 1 + Math.floor(recValue / 2) : 1;
  document.getElementById('prRec').value = prRec;

  // PA fixo
  document.getElementById('pa').value = 4;
}

function atualizarRacialBonus() {
  const raca = document.getElementById('raca').value;
  const bonusDiv = document.getElementById('bonusHumanoDiv');
  if (bonusDiv) {
    bonusDiv.style.display = raca === 'humano' ? 'flex' : 'none';
  }
}

const atributosIds = ['for','con','des','int','esp','car'];

function aplicarBonusHumano() {
  const raca = document.getElementById('raca').value;
  atributosIds.forEach(id => {
    const input = document.getElementById(id);
    if (input.dataset.base === undefined) {
      input.dataset.base = input.value;
    }
    input.value = input.dataset.base;
  });
  if (raca === 'humano') {
    const bonusAttr = document.getElementById('bonusHumano').value;
    const input = document.getElementById(bonusAttr);
    input.value = parseInt(input.dataset.base) + 1;
  }
}

function gerarPDF() {
  const ficha = document.querySelector('.ficha');

  html2canvas(ficha, {scale: 2}).then(canvas => {
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jspdf.jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    let position = 0;

    if (imgHeight < pageHeight) {
      // só uma página
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    } else {
      // gera várias páginas se necessário
      let remainingHeight = imgHeight;
      while (remainingHeight > 0) {
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        remainingHeight -= pageHeight;
        if (remainingHeight > 0) {
          pdf.addPage();
          position = - (imgHeight - remainingHeight);
        }
      }
    }

    pdf.save("ficha_ardoma_rpg.pdf");
  });
}

async function rolarDados(sides, count) {
  const res = await fetch(`http://localhost:3000/dice/${sides}/${count}`);
  const data = await res.json();
  alert(`Rolagens: ${data.rolls.join(', ')}`);
}

async function salvarFicha() {
  const dados = {
    nome: document.getElementById('nome').value,
    raca: document.getElementById('raca').value,
    nivel: parseInt(document.getElementById('nivel').value),
    historia: document.getElementById('historia').value,
    atributos: {
      FOR: parseInt(document.getElementById('for').value),
      CON: parseInt(document.getElementById('con').value),
      DES: parseInt(document.getElementById('des').value),
      INT: parseInt(document.getElementById('int').value),
      ESP: parseInt(document.getElementById('esp').value),
      CAR: parseInt(document.getElementById('car').value)
    },
    recursos: {
      hp: parseInt(document.getElementById('hp').value),
      pr: parseInt(document.getElementById('pr').value),
      prRec: parseInt(document.getElementById('prRec').value),
      pa: parseInt(document.getElementById('pa').value)
    },
    vantagens: document.getElementById('vantagens').value,
    desvantagens: document.getElementById('desvantagens').value,
    itens: document.getElementById('itens').value,
    imagem: document.getElementById('previewImagem').src || ''
  };

  const res = await fetch('http://localhost:3000/characters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  const data = await res.json();
  alert(`Ficha salva com ID ${data.id}`);
}

document.addEventListener('DOMContentLoaded', () => {
  atualizarRacialBonus();
  atributosIds.forEach(id => {
    const input = document.getElementById(id);
    input.dataset.base = input.value;
    input.addEventListener('change', () => {
      input.dataset.base = input.value;
      aplicarBonusHumano();
    });
  });
  document.getElementById('bonusHumano').addEventListener('change', aplicarBonusHumano);
  document.getElementById('raca').addEventListener('change', () => {
    atualizarRacialBonus();
    aplicarBonusHumano();
  });
  const imgInput = document.getElementById('imagem');
  const preview = document.getElementById('previewImagem');
  if (imgInput) {
    imgInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        preview.src = ev.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    });
  }
  aplicarBonusHumano();
});

