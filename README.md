# Site do Centro de Estética Jasmim

Site estático (HTML, CSS e JavaScript puro, sem build) para a Vercel, no padrão visual da GTS Academia (Barlow Condensed e Barlow), com o roxo da Jasmim. Todos os arquivos ficam na raiz.

```
index.html      página única
style.css       visual
main.js         menu, horário ao vivo, pré-consulta integrativa e WhatsApp
*.jpg           fotos do Instagram @centrodeesteticajasmim
vercel.json     URLs limpas e cache das imagens
robots.txt, sitemap.xml, favicon.svg, apple-touch-icon.png, og-image.jpg
```

## Funcionalidade própria: pré-consulta integrativa

A pessoa marca o foco (saúde, rosto ou os dois), os sinais que sente e o que quer melhorar no rosto, informa nome, idade, exames, suplementação e o melhor período. O site monta um resumo (mapa dos sinais e caminhos possíveis) e envia tudo pronto para o WhatsApp da clínica. Não agenda sozinho: a equipe confere a agenda e confirma o horário, como a Dra. Patricia prefere. Nada fica salvo no site.

- Número do WhatsApp: constante `WHATSAPP` no topo de `main.js` e os links `wa.me/5549999562544` do `index.html`.
- Sinais, pesos e textos do resumo: `AREAS`, `PESOS` e `CAMINHOS` em `main.js`.
- Horário de atendimento: `HORARIO` em `main.js` e a tabela no `index.html`.

## Publicação

Repositório no GitHub com deploy automático na Vercel: cada push na branch `main` atualiza o site. Se o endereço mudar (domínio próprio, por exemplo esteticajasmim.com.br), troque `esteticajasmim.vercel.app` em `index.html` (canonical, og:url, og:image e JSON-LD), `robots.txt` e `sitemap.xml`.

## Validar com a clínica

- Valor da consulta: o site diz que a consulta tem valor, informado pelo WhatsApp (cobrança a partir de outubro de 2026).
- Autorização das pacientes para as fotos de antes e depois no site (hoje estão no Instagram da clínica).
- Lista de ativos e textos de suplementação.
