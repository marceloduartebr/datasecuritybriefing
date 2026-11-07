# Runbook — Web Push agendado do DSB

Este Worker **não está em produção**. A rotina que envia hoje continua sendo o bot (`scripts/push/apos-publicar.mjs` + `scripts/push/enviar.mjs`), nos dias úteis por volta de 11:25 e 19:25 em `America/Sao_Paulo`.

Nada neste repositório implanta, liga cron ou lê inscrições/segredos reais. O primeiro deploy já cria recurso novo (o Durable Object). Só fazer isso com autorização explícita, e mesmo assim com as duas travas de envio fechadas.

## O que este serviço faz

- Lê o catálogo público `https://dsb.duarte.top/push/catalogo.json`, gerado no build do site a partir de `src/content/briefings`.
- Escolhe briefings cujo `pubDate` cai **hoje em Brasília** e cujo instante já passou.
- Confere `HEAD` 200 em `https://dsb.duarte.top/briefings/<slug>`.
- Filtra inscrições do KV `DSB_PUSH` (o mesmo namespace do site) com as regras atuais: tópico `edicao`; `tipos`/`regioes` omitidos = todos; array vazio = nenhum; tipo ou país ausente no briefing **não restringe**.
- Envia payload `{ titulo, texto, url, tag }` com os títulos `Nova Notícia`, `Novo Incidente`, `Nova Vulnerabilidade` ou, sem tipo válido, `Novo briefing no DSB`.
- Guarda estado **por destinatário** no SQLite do Durable Object `AgendaPush`. Sucesso não é reenviado. 404/410 apaga a inscrição. 429/5xx/timeout/rede voltam para a fila com backoff. O artigo só fica `concluido` quando a varredura do KV terminou e não há entrega `pendente`, `enviando` nem `esgotado`. `parcial` não é sucesso.

O dia do push é a data de `pubDate` em `America/Sao_Paulo`, não o prefixo do slug. Se os dois divergirem, o comportamento muda em relação ao bot. Isso é intencional e está coberto por teste.

Inscrição antiga sem `topicos` não recebe o tópico `edicao`. É o que `enviar.mjs` já faz hoje quando o bot passa `--topico edicao`. Não foi afrouxado.

## Fonte de verdade operacional

| Decisão | Onde vive | O deploy deste arquivo apaga? |
|---|---|---|
| Código e bindings | `workers/push-agenda/wrangler.jsonc` | Substitui o script e os bindings declarados |
| Cron | **Só** a chave `triggers` desse arquivo | **Sim.** `wrangler deploy` substitui os crons da conta pelo arquivo. Cron criado só no painel some no próximo deploy. Hoje a chave não existe: deploy sobe sem cron |
| Trava 1, `envio` | SQLite do Durable Object, via `POST /admin/envio` | Não. Padrão: chave ausente = desligado |
| Trava 2, `PUSH_ENVIO` | Secret do Worker. Tem de ser exatamente `on` | Não, porque **não** está em `vars`. Não adicionar `vars.PUSH_ENVIO`: um `off` commitado passaria a pisar qualquer ativação em todo deploy |
| Cutoff e histórico | SQLite, via `POST /admin/importar` | Não, salvo se alguém trocar a tag da migration ou apagar a classe |
| Par VAPID e `ADMIN_TOKEN` | Secrets. O mesmo par já publicado no site; a privada continua fora do git | Não |
| Inscrições | KV `DSB_PUSH` `1467af16ba4f4d3db8f3c6dd292f2d0b` | O deploy não copia nem zera o KV. 404/410 em envio real apagam uma chave |

As duas travas precisam estar `on` **e** o cutoff precisa existir. Falta uma delas e o tick não envia.

Não apontar binding, KV, chave VAPID ou Durable Object para o Boa Nova do Dia. Os produtos ficam separados.

## Por que o cron não está no arquivo

Expressão proposta, igual à janela atual, só que sem o adiantamento de 10 minutos (cron não dispara antes do minuto):

```text
25 14,22 * * 1-5
```

Isso é 14:25 e 22:25 UTC = 11:25 e 19:25 em Brasília. O fuso está em UTC−3 o ano inteiro desde 2019 (sem horário de verão). Se isso mudar, a expressão deixa de bater com o relógio local.

Dentro de 20 minutos depois do disparo o Worker volta a cada 5 minutos se o catálogo ainda não tem o briefing do dia ou se o `HEAD` não é 200. É o atraso de build. Entrega já começada continua depois dessa janela, em lotes, até esgotar a fila ou o backoff. O adiantamento de −10 minutos do bot **não** foi reproduzido.

## Custo e cotas (consulta em 7 nov 2026)

Não é custo zero.

Documentação lida:

- Workers Limits, atualizado em 29 out 2026: [Limits](https://developers.cloudflare.com/workers/platform/limits/)
- Durable Objects Pricing, 18 out 2026: [Pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)
- Durable Objects Limits: [Limits](https://developers.cloudflare.com/durable-objects/platform/limits/)
- Traces, 16 out 2026, atributos de span em 16 out 2026: [Spans](https://developers.cloudflare.com/workers/observability/traces/spans-and-attributes/)

Números que importam para este desenho:

- Workers Free: 10 ms de CPU, 50 subrequests por invocação, 100 mil requests/dia, 5 crons por conta.
- Workers Paid: CPU padrão 30 s (teto configurável 5 min). Cron com intervalo ≥ 1 h: até 15 min de CPU. Subrequests padrão 10 mil. O plano inclui US$ 5/mês.
- Cron e alarme de Durable Object: parede de 15 min.
- No máximo 6 conexões simultâneas esperando cabeçalho. O envio é sequencial de propósito.
- Durable Objects SQLite existem no plano Free e no Paid. Free: 100 mil requests/dia, 13 mil GB-s/dia, 5 milhões de linhas lidas/dia, 100 mil linhas escritas/dia, 5 GB. Paid: 1 milhão de requests/mês incluídos e depois US$ 0,15/milhão; 400 mil GB-s e depois US$ 12,50/milhão de GB-s. A página de pricing diz que o armazenamento SQLite passou a ser faturável em janeiro de 2026.
- A página de limits do DO fala em 30 s de CPU padrão por request e, ao mesmo tempo, que os limits do Workers também valem. No Free o Workers lista 10 ms. **Não dá para afirmar que o plano Free aguenta o WebCrypto de um lote.** O desenho fatia o trabalho (15 leituras de KV e 8 envios por invocação, mais o catálogo e alguns `HEAD`) para caber em 50 subrequests, mas a CPU do Free pode cortar antes. O alvo realista é Workers Paid. Medir no teste controlado; não extrapolar daqui.

Um dia típico (dois crons, poucos briefings, dezenas de inscrições, retentativas curtas) fica folgado dentro do incluído do Paid. Isso é estimativa, não medição.

## Traces desligados de propósito

O span automático de `fetch` grava `url.full`. No push, essa URL é o endpoint da inscrição (um segredo de capacidade). O span de KV grava a chave, e o de SQL do DO grava o texto e os bindings. Por isso `observability.traces.enabled` é `false`. Logs estruturados ficam ligados e o código omite endpoint, chave, token e payload. Não ligar traces enquanto a plataforma não tiver redação desses campos. A partir de 1º dez 2026 traces armazenados entram na cobrança de observabilidade; com traces off este Worker não gera esse item.

## Estado e exactly-once

Não há exactly-once.

- O push service pode aceitar a mensagem e a resposta se perder (timeout, queda do isolate, trava de 120 s expirada). A entrega volta para `pendente` e **pode chegar duas vezes** no aparelho. O teste cobre a retomada; não cobre o aparelho.
- 404 e 410 são terminais (`expirado`) e a chave `sub:` é apagada. Não há retry.
- 429 usa `Retry-After` (teto 15 min) e, sem o cabeçalho, backoff próprio. 5xx, timeout e erro de rede usam 30 s, 1 min, 3 min, 10 min, 15 min. Na 5ª falha a entrega fica `esgotado` e o artigo fica `parcial`, não `concluido`.
- Quem já está `enviado` não entra de novo na fila.
- Dois ticks ao mesmo tempo: o segundo recebe `ocupado` e não reivindica a fila. Isso está testado em processo único com SQLite local. O runtime do Durable Object na Cloudflare **não** foi executado.

## Importação do histórico

`POST /admin/importar` com o JSON do bot (`{ "enviados": { "<slug>": "<iso>" }, "cutoff": "<iso>" }`).

- Cada slug novo vira artigo `concluido`, sem disparo.
- Repetir a chamada não duplica e não reabre quem já está `concluido`.
- Se o slug já tem entregas, ou está `pendente`/`parcial`, a chamada devolve `conflitos` e **não** mexe nesse slug.
- `cutoff` só anda para a frente. Valor anterior é recusado (`cutoff_retrocede`).
- Sem cutoff, mesmo com `envio` e `PUSH_ENVIO` ligados, o tick responde `sem_cutoff` e não envia. Briefing com `publicadoEm` anterior ao cutoff vira `ignorado` (não foi push deste Worker; também não será).

O cutoff é exclusivo: `publicadoEm < cutoff` não sai. Igual ou posterior pode sair, se não estiver `concluido`.

## Admin

Rotas no hostname do Worker (`*.workers.dev` depois do deploy). Não pendurar no domínio `dsb.duarte.top`.

- `GET /health` — só `{ ok, servico }`.
- `GET /admin/status` — contagens e slugs. Sem endpoint.
- `POST /admin/simular` — plano do dia (títulos, contagem de destinatários). Não envia e não grava. Pode ler o KV. A resposta não leva inscrição. Acima de 300 inscrições o corpo traz `truncado: true`.
- `POST /admin/importar` — histórico e cutoff.
- `POST /admin/tick` — um lote. Respeita as travas. Não aceita relógio do cliente.
- `POST /admin/envio` — `{ "ligado": true }` ou `{ "ligado": false }`. Tem de ser booleano. `false` também apaga o alarme.

`Authorization: Bearer <ADMIN_TOKEN>`. Token ausente ou com menos de 16 caracteres: 503, a rota não abre. Token errado: 401. Não há token padrão no repositório. Gerar 32 bytes aleatórios na hora do deploy. A comparação usa hash SHA-256 e `timingSafeEqual` quando o runtime oferece.

Simular com catálogo colado no corpo (`{ "catalogo": { "itens": [...] } }`) não substitui o `HEAD` nem prova que o JSON público já está no ar.

## Corte (só com autorização nova)

Ordem. Não pular.

1. Revisar esta PR. Não fazer merge por conta deste runbook.
2. Publicar o site com `/push/catalogo.json` **antes** de qualquer tick real, senão o Worker não vê tipo/país. O catálogo é estático, sem `notionUrl`, fonte ou corpo. Conferir o JSON no ar (campos e um briefing do dia). Isso ainda não envia push.
3. `npx wrangler deploy --config workers/push-agenda/wrangler.jsonc` a partir da raiz. Isso **cria** o Worker e o namespace do Durable Object. Não cria KV. Não liga cron. Não lê o segredo do bot se você não colar.
4. Secrets, sem ecoar em log ou issue:
   - `wrangler secret put ADMIN_TOKEN --config workers/push-agenda/wrangler.jsonc`
   - `wrangler secret put VAPID_PUBLIC_KEY --config workers/push-agenda/wrangler.jsonc`
   - `wrangler secret put VAPID_PRIVATE_KEY --config workers/push-agenda/wrangler.jsonc`
   - `wrangler secret put VAPID_SUBJECT --config workers/push-agenda/wrangler.jsonc`  
     Usar o par que o site já tem. Não gerar outro: o service worker e as inscrições atuais quebram.
5. Simulação: `POST /admin/simular`. Conferir títulos, contagens e o que ficaria de fora. `enviaria` tem de ser `false`.
6. Pausar o bot (o cron da máquina). Esperar não haver `apos-publicar` / `enviar` em execução.
7. Importar o `~/.config/dsb/push-enviados.json` **na íntegra**, com `cutoff` no instante do corte (ISO UTC). Guardar a resposta (`conflitos` tem de ser `[]`).
8. `GET /admin/status` e uma segunda simulação. O que o bot já marcou aparece `concluido`. O que é anterior ao cutoff e não foi importado como envio do dia não pode estar na lista que sairia.
9. Teste real controlado, de novo só com autorização: uma inscrição nova, criada de propósito, com preferência estreita, num briefing que ainda não foi enviado. Aí sim `PUSH_ENVIO=on` e `POST /admin/envio` `{ "ligado": true }`, e um `POST /admin/tick` ou o cron. Confirmar no aparelho dessa inscrição. Isso esta PR **não** fez.
10. Só depois de o teste controlado bater: acrescentar no `wrangler.jsonc`, no mesmo commit que for implantado,

    ```jsonc
    "triggers": { "crons": ["25 14,22 * * 1-5"] }
    ```

    e deploy de novo. Sem essa chave no arquivo, o próximo deploy apaga o cron.

11. Acompanhar um ciclo de dia útil (11:25 e 19:25). `parcial` ou `esgotado` no status é falha de entrega, não “já foi”.
12. Desligar o bot de vez só depois desse ciclo. Até lá ele fica pausado, não apagado.

`PUSH_ENVIO` sozinho não envia. `ligado: true` sozinho não envia. Cron sozinho não envia.

## Rollback sem duplicar

1. `POST /admin/envio` com `{ "ligado": false }`.
2. Se o cron já tiver sido commitado, tirar `triggers` **nesse** deploy, sabendo que o arquivo volta a ser a fonte e o cron para. Se o cron ainda não foi para o arquivo, não há o que remover.
3. `GET /admin/status`.
4. Para cada slug com alguma entrega `enviado`: colocar o slug em `~/.config/dsb/push-enviados.json` **antes** de religar o bot. O bot deduplica por slug, não por pessoa. Religar sem isso reenvia para quem já recebeu.
5. Slug `parcial`: também entra no arquivo do bot se houve ao menos um `enviado`. Quem ficou `pendente` ou `esgotado` **não** recebe o restante pelo bot. É a escolha que evita duplicata. A alternativa (não recomendar) é deixar o slug fora e aceitar duplicata para todo mundo.
6. Slug sem nenhum `enviado` (só `aguardando`, `ignorado`, ou falha antes do primeiro 201): não colocar no arquivo do bot, para o bot poder enviar.
7. Secret `PUSH_ENVIO`: `wrangler secret delete` ou um valor que não seja `on`. Não é obrigatório se `ligado` já é `false`, mas fecha a segunda trava.
8. Religar o bot só depois dos passos 4–6.

O Durable Object guarda o dedupe. Não apagar a classe nem mudar a tag `v1-agenda-push` num rollback: objeto novo perderia a memória de quem já recebeu.

## O que não foi validado

- Deploy, cron, alarme e Durable Object no edge.
- Leitura do KV de produção e qualquer inscrição real.
- Par VAPID real (os testes geram chave efêmera e comparam a cifra com `http_ece`).
- Entrega no aparelho, em FCM, Mozilla, Apple ou Windows. Teste offline não é notificação recebida.
- CPU e duração reais no plano da conta. A fatia de 8 envios é um teto de desenho, não uma medição.
- O repositório do Boa Nova do Dia não estava acessível (HTTP 404). O desenho segue o padrão descrito (Worker agendado, WebCrypto aes128gcm + VAPID ES256, DO SQLite, dedupe por destinatário, importação) sem copiar aquele código.
- Redação de traces no painel. A decisão de deixar traces off vem da documentação dos atributos `url.full` e das chaves de KV, não de um trace capturado.
- `wrangler deploy --dry-run` não foi executado aqui (precisa de credencial e pode falar com a API).

## Verificação local

```bash
npm test
```

Os testes usam `node:sqlite` e WebCrypto. Não há rede de push. O script do bot não é chamado.
