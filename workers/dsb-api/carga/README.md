# Carga full Notion → D1

Usada na fase de testes (dsb-staging) e repetida no cutover. Idempotente: apaga os dados e regrava com ids estáveis.

1. Exportar a fila do Notion para `notion.json` (lista de linhas com as colunas da coleção `d69d8348-…`, incluindo Post Text e Briefing MD).
2. `python3 transformar.py notion.json` → `carga.json` (regras e casos especiais no topo do arquivo; todo caso especial vira pendência `stage=carga`).
3. `CF_D1=<token com D1 Edit> python3 gravar.py` → grava e imprime a reconciliação por status e canal.
4. Rodar `POST /varrer` no dsb-api.

`notion.json` e `carga.json` têm conteúdo da fila: não versionar.

## Backfill do X

5. Coletar a timeline da @DSBriefing em `x_timeline.json` (ver `x_casar.py`).
6. `python3 x_casar.py` → `x_match.json` (tweet ↔ briefing pelo título do cartão).
7. `CF_D1=… python3 gravar_x.py` → X publicado com a URL do tweet; blog anterior a 28/10/2026 vira X pulado; o resto fica na fila do X. Religa a verificação `x_atrasado`.
