# AI CHATBOT CMS

The AI chatbot will be white-labeled, allowing for full customization to meet the needs of any company. The chatbot will be integrated with Facebook Messenger, WhatsApp, and a custom chat window that can be embedded into company websites.

## Built with
[![React][react-shields]][react-url] [![Vite][vite-shields]][vite-url] [![Typescript][typescript-shields]][typescript-url]

## Getting started

Below are the steps to guide you through preparing your local enviroment for the AI CHATBOT CMS. Before diving into setup please look into the concept of [Github Sub Modules](https://github.blog/open-source/git/working-with-submodules/), [Docker Merge](https://docs.docker.com/compose/how-tos/multiple-compose-files/merge/).

### Prerequisites

To begin, ensure you have network access. Then, you'll need the following:

1. [Git](https://git-scm.com/)
2. [Node.JS](https://nodejs.org/en/) version >=18 / 20+
3. [Pnpm](https://pnpm.io/)
4. Alternatively, you can use [Docker](https://www.docker.com/) to build the application.

### Local development (with docker)

Clone the repository using HTTPS, SSH, or Github CLI
```bash
git clone https://github.com/toggle-corp/ai-chatbot-cms.git #HTTPS
git clone git@github.com:toggle-corp/ai-chatbot-cms.git #SSH
gh repo clone toggle-corp/ai-chatbot-cms #Github CLI
```
Download the contents of backend(ai-chatbot-backend)
```bash
git submodule update --init --recursive
```
Update Environment variables
* create .env file and add COMPOSE_FILE variable for the ai-chatbot-cms
```bash
touch .env
```
* Copy env.example to .env and update the variables for the backend
```bash
cd backend
cp env.example .env
```
> NOTE: The backend has a higher priority than the ai-chatbot-cms. You can add backend environment variables in the CMS, but you must create a .env file in the backend for them to work.

Build the docker image
```bash
docker compose build
```
Start the development server
```bash
docker compose up
```
Install the dependencies
```bash
docker compose exec react bash -c 'pnpm install'
```
Generate type
```bash
docker compose exec react bash -c 'pnpm generate:type'
```
### Local development (without docker)

Same steps upto downloading the contents of backend

Update Enviroment variables

* create .env file and add COMPOSE_FILE and other variable for the ai-chatbot-cms
```bash
touch .env
```
> NOTE: Copy the env variables from the docker compose file in environment section

Install the dependencies
```bash
pnpm install
```
Generate type
```bash
pnpm generate:type
```
Start the development server
```bash
pnpm start
```

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[react-shields]: https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[react-url]: https://reactjs.org/
[vite-shields]: https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white
[vite-url]: https://vitejs.dev/
[typescript-shields]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/
