'use strict';


async function capturarValorDaURL() {
  try {
    const response = await fetch('URL_DO_SEU_ACESSTOKEN');
    const data = await response.text(); // Alterado para text()

    // Aqui você pode manipular os dados conforme necessário
    console.log('Valor retornado pela URL:', data);
    
    // Exemplo de como acessar e utilizar o valor
    const valor = data.trim(); // Remover espaços em branco extras
    console.log('O valor retornado é:', valor);
    return data
  } catch (error) {
    console.error('Ocorreu um erro ao capturar o valor:', error);
  }
}
function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}T00:00:00.000-00:00`;
}
// Função para inicialização

async function init() {
  
  // Coloque aqui o código que você deseja manter

  const price2 =
    document
      .querySelector(
        'div.ui-pdp-price__second-line > span.andes-money-amount.ui-pdp-price__part.andes-money-amount--cents-superscript.andes-money-amount--compact > span.andes-money-amount__fraction'
      )
      ?.innerText.replace('.', '') || '0';

  const cents =
    document.querySelector(
      'div.ui-pdp-price__second-line > span.andes-money-amount.ui-pdp-price__part.andes-money-amount--cents-superscript.andes-money-amount--compact > span.andes-money-amount__cents.andes-money-amount__cents--superscript-36'
    )?.innerText || '0';

  const sold = Number(document.querySelector('.ui-pdp-header__subtitle')?.innerText.split(' ')[4]);

  const container = document.querySelector('.ui-pdp-header__title-container');

  const adId = document
    .querySelector('meta[name="twitter:app:url:ipad"]')
    ?.content.split('id=')[1];

  const mlResponse = await handleMlApi(`https://api.mercadolibre.com/items?ids=${adId}`);
  console.log(mlResponse);
  const {
    body: {
      price,
      category_id,
      listing_type_id,
      shipping,
      
      initial_quantity,
      
      last_updated,
      date_created,
      health,
      catalog_listing
    },
  } = mlResponse[0] || null;


  
  var tipoanuncio=listing_type_id; 
  var catalogo_listing=catalog_listing;

  // Certifique-se de que a classe "mlext-container" existe no seu HTML para onde você deseja adicionar os resultados.


  const {sale_fee_amount} =
    (await handleMlApi(
      `https://api.mercadolibre.com/sites/MLB/listing_prices?price=${price}&listing_type_id=${listing_type_id}&category_id=${category_id}`
    )) || {};


  const apiUrl = `https://api.mercadolibre.com/items/${adId}/shipping_options?zip_code=08771070`;
  const mlResponsevisit = await handleMlApi(apiUrl)|| {};;
  console.log(mlResponsevisit);
  let normalListCost = null;

// Verifica se há opções de entrega na resposta
if (mlResponsevisit.options && mlResponsevisit.options.length > 0) {
  // Percorre todas as opções de entrega
  mlResponsevisit.options.forEach(option => {
      // Verifica se o nome da opção é "Normal"
      if (option.name === "Normal") {
          // Se for, atribui o valor de list_cost a normalListCost
          normalListCost = option.list_cost;
      }
  });
}

console.log("Custo da opção Normal:", normalListCost);
  //const mlResponsevisit2=mlResponsevisit[0].total_visits;



  



  let perccom = 0;
  if (price<79.99) {
     perccom =  (((parseFloat(sale_fee_amount).toFixed(2))-6)/((parseFloat(price)).toFixed(2)))*100;
  } else{
     perccom =  ((parseFloat(sale_fee_amount).toFixed(2))/(parseFloat(price)).toFixed(2))*100;
  }
  
  if (tipoanuncio="gold_special"){
  
   tipoanuncio = "Clássico";
  }
  else{
     tipoanuncio = "Premium";
  }
  
  if (catalogo_listing="false"){
  
    catalogo_listing = "";
  }else{
    catalogo_listing = "Item de Catálogo";
   }
  const data1=new Date(date_created)
  const startTime = data1.toLocaleDateString('pt-BR');
  const qtdini=initial_quantity;
  const quantidaded=initial_quantity;
  const today = new Date();
  const oneDay = 24 * 60 * 60 * 1000; // 24 horas * 60 minutos * 60 segundos * 1000 milissegundos
  const diffTime = Math.abs( data1 - today); // Diferença de tempo em milissegundos
  const diffDays = Math.round(diffTime / oneDay); // Converte a diferença de tempo para dias
  const data2=new Date(last_updated)
  console.log(diffDays); 

  const updated=new Date(last_updated).toLocaleDateString('pt-BR');
  const diffTime2 = Math.abs( data2 - today); // Diferença de tempo em milissegundos
  const diffDays2 = Math.round(diffTime2 / oneDay);
  // Verifique se o frete grátis é verdadeiro e insira "FRETE GRÁTIS" na lista
  let shippingInfo = "Frete: Pago"; // Padrão é frete pago
  if (shipping && shipping.free_shipping === true) {
    shippingInfo = "FRETE GRÁTIS";
  }




  function getDadorealByQuantidaded(quantidaded) {
    const tabelaReferencia = [
      { Dadoreal: 0, Referencia: '0' },
      { Dadoreal: 1, Referencia: '1-50' },
      { Dadoreal: 50, Referencia: '51-100' },
      { Dadoreal: 100, Referencia: '101-150' },
      { Dadoreal: 150, Referencia: '151-200' },
      { Dadoreal: 200, Referencia: '201-250' },
      { Dadoreal: 250, Referencia: '251-500' },
      { Dadoreal: 500, Referencia: '501-5000' },
      { Dadoreal: 5000, Referencia: '5001-50000' },
      { Dadoreal: 50000, Referencia: '50001-99999' },
    ];
  
    const foundEntry = tabelaReferencia.find(entry => entry.Dadoreal === quantidaded);
    if (foundEntry) {
      return foundEntry.Referencia;
    } else {
      // Se não houver uma correspondência exata, você pode adicionar uma lógica para lidar com isso.
      return 'Valor não encontrado';
    }
  }

  function getDadorealByQuantidaded2(precoori) {
    const tabelaReferencia = [
      { Dadoreal: 0, Referencia: '0' },
      { Dadoreal: 1, Referencia: '1' },
      { Dadoreal: 2, Referencia: '2' },
      { Dadoreal: 3, Referencia: '3' },
      { Dadoreal: 4, Referencia: '4' },
      { Dadoreal: 5, Referencia: '5' },
      { Dadoreal: 6, Referencia: '6-25' },
      { Dadoreal: 25, Referencia: '26-50' },
      { Dadoreal: 50, Referencia: '51-100' },
      { Dadoreal: 100, Referencia: '101-150' },
      { Dadoreal: 150, Referencia: '151-200' },
      { Dadoreal: 200, Referencia: '201-250' },
      { Dadoreal: 250, Referencia: '251-500' },
      { Dadoreal: 500, Referencia: '501-5000' },
      { Dadoreal: 5000, Referencia: '5001-50000' },
      { Dadoreal: 50000, Referencia: '50001-500000' },
      
    ];
  
    const foundEntry = tabelaReferencia.find(entry => entry.Dadoreal === quantidaded);
    if (foundEntry) {
      return foundEntry.Referencia;
    } else {
      // Se não houver uma correspondência exata, você pode adicionar uma lógica para lidar com isso.
      return 'Valor não encontrado';
    }
  }
  const cspMetaTag = document.createElement('meta');
  cspMetaTag.setAttribute('http-equiv', 'Content-Security-Policy');
  cspMetaTag.setAttribute('content', "script-src 'self' api.mercadolibre.com");

  // Insere a meta tag CSP no cabeçalho do documento
  document.head.appendChild(cspMetaTag);


  setTimeout(() => {
    // Crie um elemento de imagem
    const logo = document.createElement('img');
  
    // Defina o atributo src da imagem com o URL da imagem desejada
    logo.src = '';
    const Dadoreal = getDadorealByQuantidaded(quantidaded);
  
    // Defina outros atributos, como alt, width e height, se necessário
    logo.alt = 'Minha Logo';
    logo.width = 80; // Defina a largura desejada
    logo.height = 30; // Defina a altura desejada
  
    // Crie um novo container para a imagem e a lista
    const containerWithImage = document.createElement('div');
    containerWithImage.classList.add('container-with-image');
    containerWithImage.appendChild(logo);

     
    // Insira a lista de <li> no container
    containerWithImage.insertAdjacentHTML(
      'beforeend',
      `
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

        <ul class="mlext-container">
        
          <li> ${catalogo_listing} </li>
          <li> Tipo de anúncio: <span> ${tipoanuncio}</span> </li>
          <li> Saúde do anúncio:<span>  ${health} </span> </li>
          <li> Comissão %: <span>${parseFloat(perccom).toFixed(2)} %</span></li>
          <li> Criado em: <span> ${startTime} - Há ${diffDays} dia(s)</span></li>
          <li> Ultima atualização: <span> ${updated} - Há ${diffDays2} dia(s)</span></li>
          <li> Quantidade inicial: <span> ${qtdini}</span></li>
          <li> Frete Estimado: <span> ${normalListCost} </span></li>
          
          <li> </li>
          
          <li>${shippingInfo}</li>
          
  
       

          

        </ul>
      `
    );
  
    // Insira o novo container no local desejado
    container?.insertAdjacentElement('beforebegin', containerWithImage);
  
    // Adiciona um ouvinte de evento para o botão
    
  }, 1500);


}

// Função para calcular a margem e exibir o resultado


// Função para formatar valores monetários
function formatMoney(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

// Função para formatar a data
function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Função para lidar com chamadas à API do Mercado Livre
async function handleMlApi(url) {
  try {
    let acesstoken=await capturarValorDaURL();
    console.log("O acess é" + acesstoken)
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + acesstoken,
      },
    };

    const response = await fetch(url, config);
    const finalRes = await response.json(); 
    console.log(response);
    return finalRes;
  } catch (err) {
    console.log('Erro na requisição:', err);
  }
}









// Função para salvar o valor do custo
function saveCostValue(value) {
  // Armazene o valor em uma variável
  const cost = value;
  // Você pode usar a variável "cost" para uso posterior
  console.log("Custo da mercadoria: " + cost);
}

// Função para salvar o valor dos impostos
function saveTaxValue(value) {
  // Armazene o valor em uma variável
  const tax = value;
  // Você pode usar a variável "tax" para uso posterior
  console.log("Impostos: " + tax + " %");
}


   
 
  

// Inicialize a função
init();