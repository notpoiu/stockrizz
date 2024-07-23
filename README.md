# Stockrizz

This is a [Next.js](https://nextjs.org/) project that uses openai's GPT-4o to "analyse" rizz.

## Inspiration

Took inspiration from [this tiktok](https://vm.tiktok.com/ZMrBfDyP9/) and thought why not turn it into a actual site (I was very bored 😭)

## Setup

First, get your [openai api key](https://platform.openai.com/api-keys).

Then create a new repository on github and get the owner and the name of the repository.
Then, get your [github api key](https://github.com/settings/tokens?type=beta) (select the created repo and set the "Contents" permission in repository permissions as "Read and write"). NOTE THAT CLASSIC TOKENS WILL ALSO WORK.

After the you got your api key, clone the stockrizz repository and navigate to the root of the project.

Then create a new environement file (ex: `.env.local`).
Then put this in your environement file

```env
OPENAI_API_KEY=sk-...
GITHUB_TOKEN=github_pat_...

GITHUB_REPO_OWNER=...
GITHUB_REPO_NAME=...
```

Then install all the dependencies using the following commands:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

## Testing

Finaly, to run the development server, use the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment
I recommend deploying on vercel. 

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnotpoiu%2Fstockrizz.git&env=OPENAI_API_KEY,GITHUB_TOKEN,GITHUB_REPO_OWNER,GITHUB_REPO_NAME)
## Contributing

Create a PR to contribute
## License
This project is licensed under the [MIT License](LICENSE.md)
