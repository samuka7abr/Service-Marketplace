# Service Marketplace API

A **Service Marketplace API** é uma aplicação construída em NestJS que simula um marketplace de serviços, onde clientes podem criar solicitações, prestadores podem oferecer serviços e enviar propostas, e ambas as partes interagem dentro de um fluxo simples que representa um cenário real de contratação de serviços.

O objetivo do projeto é servir como um ambiente de prática para NestJS, DynamoDB e Docker, utilizando uma abordagem modular e limpa.

## ✨ Funcionalidades

- Cadastro e gerenciamento de usuários (clientes e prestadores)
- Catálogo de serviços disponíveis
- Criação de solicitações por clientes
- Envio e gerenciamento de propostas por prestadores
- Organização da aplicação em módulos bem definidos

## 🧩 Módulos da Aplicação

- **Users** — gerenciamento de contas e perfis  
- **Services** — tipos de serviços oferecidos  
- **Requests** — solicitações criadas pelos clientes  
- **Proposals** — propostas enviadas por prestadores  

## 🛠️ Stack

<p align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg" width="45" alt="NestJS" />

  <!-- DynamoDB custom SVG inline -->
  <img width="55" alt="DynamoDB"
       src="data:image/svg+xml;utf8,<?xml version='1.0' encoding='UTF-8'?> <svg width='80px' height='80px' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient x1='0%' y1='100%' x2='100%' y2='0%' id='linearGradient-1'><stop stop-color='%232E27AD' offset='0%'/> <stop stop-color='%23527FFF' offset='100%'/></linearGradient></defs><g fill='none' fill-rule='evenodd'><rect width='80' height='80' fill='url(%23linearGradient-1)'/><path fill='%23FFFFFF' d='M52.0859525,54.8502506 C48.7479569,57.5490338 41.7449661,58.9752927 35.0439749,58.9752927 C28.3419838,58.9752927 21.336993,57.548042 17.9999974,54.8492588 L17.9999974,60.284515 C18.0009974,62.9952002 24.9999974,66.0163299 35.0439749,66.0163299 C45.0799617,66.0163299 52.0749525,62.9991676 52.0859525,60.290466 L52.0859525,54.8502506 Z M52.0869525,44.522272 C54.0869499,45.7303271 54.0869499,51.2746852 54.0869499,60.284515 C54.0869499,65.2952658 44.2749628,68 35.0439749,68 C25.8349871,68 16.0499999,65.3071678 16.003,60.3192292 L16,60.3043517 L16,51.2548485 C16.005,50.3691398 16.3609995,49.1412479 17.7869976,47.8875684 C16.3699995,46.6358725 16.01,45.4149236 16.001,44.5440924 L16.002,44.5331822 L16,35.483679 C16.005,34.5969784 16.3619995,33.3690866 17.7879976,32.1173908 C16.3699995,30.8647031 16.01,29.6427623 16.001,28.7729229 L16.002,28.7610209 L16,19.7125095 C16.019,14.6997751 25.8199871,12 35.0439749,12 C40.2549681,12 45.2609615,12.8281823 48.7779569,14.2722941 L48.0129579,16.1052054 C44.7299622,14.7573015 40.0029684,13.9836701 35.0439749,13.9836701 C24.9999882,13.9836701 18.0009974,17.0047998 18.0009974,19.7174687 C18.0009974,22.4291458 24.9999882,25.4502754 35.0439749,25.4502754 L35.8479739,25.4403571 L35.9319738,27.4220435 C35.3399745,27.4339456 28.3419838,27.4339456 21.336993,26.0066949 18,23.3079117 L18,28.7630046 C18.0109974,29.8034395 19.0779959,30.7119605 19.9719948,31.2892085 C22.6619912,33.0040913 27.4819849,34.1754485 32.8569778,34.4184481 L32.7659779,36.4001346 C27.3209851,36.1531677 22.5529914,35.0234675 19.4839954,33.2917235 C18.7279964,33.8570695 18.0009974,34.6217743 18.0009974,35.4886382 C18.0009974,38.2003153 24.9999882,41.2214449 35.0439749,41.2214449 C36.0289736,41.2214449 37.0069723,41.1887143 37.9519711,41.1232532 L38.0909709,43.1019642 C37.1009722,43.1704008 36.0749736,43.205115 35.0439749,43.205115 C28.3419838,43.205115 21.336993,41.7778644 18,39.0790811 L18,44.5113618 C18.0109974,45.574609 19.0779959,46.4821381 19.9719948,47.060378 C23.0479907,49.0232196 28.8239831,50.2451604 35.0439749,50.2451604 L35.4839744,50.2451604 L35.4839744,52.2288305 L35.0439749,52.2288305 C28.7249832,52.2288305 22.9819908,51.0554896 19.4699954,49.0728113 C18.7179964,49.6371655 18.0009974,50.397903 18.0009974,51.257824 C18.0009974,53.9695011 24.9999882,56.9916225 35.0439749,56.9916225 C45.0799617,56.9916225 52.0749525,53.9744602 52.0859525,51.2647668 C52.0839525,50.391952 51.3639534,49.6312145 50.6099544,49.0668603 L48.2379576,48.022458 C49.5939558,47.4015692 50.1109551,47.0623616 51.0129539,46.4742034 52.0869525,45.5547723 52.0869525,44.522272 Z'/></g></svg>" 
  />

  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" width="50" alt="Docker" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="45" alt="TypeScript" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="50" alt="Node.js" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pnpm/pnpm-original.svg" width="45" alt="pnpm" />
</p>

---

