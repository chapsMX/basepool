export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL;

  return Response.json({
    accountAssociation: {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE,
    },
    frame: {
      version: process.env.NEXT_PUBLIC_VERSION,
      name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
      homeUrl: URL,
      iconUrl: process.env.NEXT_PUBLIC_ICON_URL,
      imageUrl: process.env.NEXT_PUBLIC_IMAGE_URL,
      buttonTitle: `Launch ${process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME}`,
      splashImageUrl: process.env.NEXT_PUBLIC_SPLASH_IMAGE_URL,
      splashBackgroundColor: `#${process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR}`,
      webhookUrl: `https://api.neynar.com/f/app/2b8b88b6-594d-4b0c-ae23-67684694b621/event`,
      subtitle: `A provable fair lottery game.`,
      description: `BasePool is a provably fair lottery on Base. Join with 0.0005 ETH per number. At 0.5 ETH, Pyth draws a winner.`,
      screenshotUrls: [
  `${URL}/ss_01.jpg`,
  `${URL}/ss_02.jpg`,
  `${URL}/ss_03.jpg`,
],
      primaryCategory: `games`,
      tags: [`lottery`, `onchain`, `base`, `pool`, `draw`],
      heroImageUrl: `${URL}/hero.png`,
      tagline: `Play. Win. Reset.`,
      ogTitle: `Join BasePool`,
      ogDescription: `A fair onchain lottery powered by Base and Pyth. 0.5 ETH prize every round.`,
      ogImageUrl: `${URL}/hero.png`,
    },
  });
}
