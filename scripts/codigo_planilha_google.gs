// --- COPIE TODO ESTE CÓDIGO E SUBSTITUA O ANTERIOR NO APPS SCRIPT ---

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Aguarda até 10s para evitar conflitos de escrita simultânea

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // DEBUG: Se quiser ver o que está chegando, descomente a linha abaixo (cria logs na planilha)
    // sheet.appendRow(["", "DEBUG", JSON.stringify(e)]);

    var data;
    
    // Tenta ler os dados de diferentes formas para garantir compatibilidade
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error("Nenhum dado recebido no corpo da requisição.");
    }

    // Validação básica
    if (!data.email) {
      throw new Error("Email não fornecido.");
    }

    // Lógica de verificação de retorno (Duplicidade)
    var email = data.email.toString().toLowerCase().trim();
    var tipoRegistro = "Primeiro";
    var dataFormatada = Utilities.formatDate(new Date(), "GMT-3", "dd/MM/yyyy");
    
    var range = sheet.getDataRange();
    var values = range.getValues();
    
    // Procura o email na coluna D (índice 3), pois a tabela começa na coluna B e o email é o 3º campo útil
    // Col A: Vazia/Índice
    // Col B: Nome
    // Col C: Status/Histórico
    // Col D: Email
    for (var i = 1; i < values.length; i++) {
      // Verifica se a coluna existe antes de acessar
      var rowEmail = (values[i].length > 3 && values[i][3]) ? values[i][3].toString().toLowerCase().trim() : "";
      if (rowEmail === email) {
        tipoRegistro = "Retorno";
        break;
      }
    }

    var statusFinal = tipoRegistro + " - " + dataFormatada;

    // Salva os dados começando da coluna B (adiciona string vazia na primeira posição)
    sheet.appendRow([
      "", // Coluna A (Vazia)
      data.nome || "Não informado", // Coluna B
      statusFinal, // Coluna C
      data.email, // Coluna D
      data.nascimento || "", // Coluna E
      data.escore_inflamacao || 0, // Coluna F
      data.escore_risco_mental || 0, // Coluna G
      data.telefone || "", // Coluna H
      new Date() // Coluna I (Timestamp do sistema)
    ]);

    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Em caso de erro, tenta salvar o erro na planilha para você ver o que houve
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      // Ajusta também o log de erro para começar na coluna B
      sheet.appendRow(["", "ERRO", error.toString(), new Date()]);
    } catch(e) {}

    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } finally {
    lock.releaseLock();
  }
}
