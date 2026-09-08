# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Run locally

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd My-Projects-/ClearPath-V1
npm i
npm run dev
```

Open the local address printed in the terminal (normally `http://localhost:3000`).

The AI writing actions require this server-side environment variable:

```sh
LOVABLE_API_KEY=your_lovable_api_key
```

## Deploy on Vercel

Import the GitHub repository into Vercel and use these settings:

- **Root Directory:** `ClearPath-V1`
- **Environment Variable:** `LOVABLE_API_KEY`

The included `vercel.json` builds the TanStack Start server and its browser assets. After deployment, use the Vercel production URL for LinkedIn Featured; this is a server application, so opening an HTML file directly will not run its AI actions.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
