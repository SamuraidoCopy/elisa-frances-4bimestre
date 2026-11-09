$ErrorActionPreference = 'Stop'
$port = 8784
$url = "http://127.0.0.1:$port"
$ready = $false
try {
  $page = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
  $ready = $page.Content -like '*Bonjour, Elisa!*'
} catch { }
if (-not $ready) {
  $node = Get-Command node -ErrorAction SilentlyContinue
  if (-not $node) { throw 'Instale o Node.js para abrir pelo servidor local ou peça ajuda ao adulto.' }
  $serverPath = Join-Path $PSScriptRoot 'servir.cjs'
  $serverArgs = @("`"$serverPath`"", "$port")
  Start-Process -FilePath $node.Source -ArgumentList $serverArgs -WorkingDirectory $PSScriptRoot -WindowStyle Hidden
  for ($attempt = 0; $attempt -lt 20; $attempt++) {
    Start-Sleep -Milliseconds 200
    try {
      $page = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 1
      if ($page.Content -like '*Bonjour, Elisa!*') { $ready = $true; break }
    } catch { }
  }
}
if (-not $ready) { throw "Não foi possível iniciar o jogo na porta $port. Peça ajuda ao adulto." }
$chromePaths = @("$env:ProgramFiles\Google\Chrome\Application\chrome.exe", "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe", "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe")
$chrome = $chromePaths | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if ($chrome) { Start-Process -FilePath $chrome -ArgumentList $url }
else { Write-Host 'Chrome não encontrado; abrindo no navegador padrão.'; Start-Process $url }
