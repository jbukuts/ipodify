# ipodify

Custom Spotify web client designed to look like an old iPod.

Built using:

- [React](https://react.dev/)
- [TailwindCSS v4](https://tailwindcss.com/docs/installation/using-vite)
- [@spotify/web-api-ts-sdk](https://www.npmjs.com/package/@spotify/web-api-ts-sdk)
- [tanstack/react-query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Radix UI](https://www.radix-ui.com/themes/docs/overview/getting-started)

## Running locally

First, create an `.env` file containing:

- `VITE_SPOTIFY_CLIENT_ID`: Spotify Developer application client ID
- `VITE_REDIRECT_TARGET`: Where to redirect after login (should be site root)

Install dependencies via:

```bash
npm ci
```

Then run the app locally via:

```bash
npm run dev
```

The site will be served locally at http://localhost:5173
 
## Further documentation:

- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
