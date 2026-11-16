# Carga full Notion → D1

Usada na fase de testes (dsb-staging) e repetida no cutover. Idempotente: apaga os dados e regrava com ids estáveis.

1. Exportar a fila do Notion para `notion.json` (lista de linhas com as colunas da coleção `d69d8348-…`, incluindo Post Text e Briefing MD).
2. `python3 transformar.py notion.json` → `carga.json` (regras e casos especiais no topo do arquivo; todo caso especial vira pendência `stage=carga`).
3. `CF_D1=<token com D1 Edit> python3 gravar.py` → grava e imprime a reconciliação por status e canal.
4. Rodar `POST /varrer` no dsb-api.

`notion.json` e `carga.json` têm conteúdo da fila: não versionar.
