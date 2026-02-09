export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL;

  return Response.json({
    accountAssociation: {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE,
    },
    baseBuilder: {
      ownerAddress: "0x58F521068A39a5e675ACc7Edd7E269f576867691",
    },
      frame: {
      version: "1",
      name: "Base Pool",
      homeUrl: URL,
      iconUrl: `${URL}/icon.png`,
      imageUrl: `${URL}/basePool_New.png`,
      buttonTitle: `Launch Base Pool`,
      splashImageUrl: `${URL}/splash.png`,
      splashBackgroundColor: `#0052FF`,
      webhookUrl: `https://api.neynar.com/f/app/2b8b88b6-594d-4b0c-ae23-67684694b621/event`,
      subtitle: `A provable fair lottery game.`,
      description: `A fair onchain lottery powered by Base and Pyth.`,
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
      ogDescription: `A fair onchain lottery powered by Base and Pyth`,
      ogImageUrl: `${URL}/hero.png`,
      noindex: "false"
    },
  });
}
