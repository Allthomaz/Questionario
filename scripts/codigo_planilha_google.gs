// --- COPIE ESTE CÓDIGO PARA O APPS SCRIPT DA SUA PLANILHA ---

function doPost(e) {
  try {
    // 1. Obtém a aba ativa da planilha
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 2. Recebe os dados do site
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);
    
    // 3. Verifica se o paciente já existe (pelo Email na Coluna 3 / C)
    // Estrutura esperada das colunas conforme sua imagem: 
    // [A: Nome] [B: Data do Questionário] [C: Email] [D: Nascimento] [E: Inflamação] [F: Risco Mental]
    
    var email = data.email;
    var tipoRegistro = "Primeiro";
    var dataFormatada = Utilities.formatDate(new Date(), "GMT-3", "dd/MM/yyyy");
    
    // Verifica histórico (lê toda a coluna C para checar duplicação)
    var range = sheet.getDataRange();
    var values = range.getValues();
    
    // Começa do 1 para pular o cabeçalho
    for (var i = 1; i < values.length; i++) {
      // Verifica se a linha tem dados e se o email bate (case insensitive)
      if (values[i][2] && values[i][2].toString().toLowerCase() == email.toString().toLowerCase()) { 
        tipoRegistro = "Retorno";
        break;
      }
    }
    
    var statusFinal = tipoRegistro + " - " + dataFormatada;
    
    // 4. Salva a nova linha na ordem exata da sua imagem + campos extras úteis
    sheet.appendRow([
      data.nome,                // Coluna A
      statusFinal,              // Coluna B (Ex: Primeiro - 17/10/2025)
      data.email,               // Coluna C
      data.nascimento,          // Coluna D
      data.escore_inflamacao,   // Coluna E
      data.escore_risco_mental, // Coluna F
      data.telefone,            // Coluna G (Extra: Telefone)
      new Date()                // Coluna H (Extra: Carimbo de data/hora sistema)
    ]);
    
    // 5. Retorna sucesso para o site
    return ContentService.createTextOutput(JSON.stringify({ "status": "sucesso", "mensagem": "Dados salvos" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Retorna erro se algo falhar
    return ContentService.createTextOutput(JSON.stringify({ "status": "erro", "mensagem": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
