import type { Asset, Book } from "./schemas.js";
import type { ImageProvider } from "./providers.js";

export interface ImageGenerationResult { book: Book; generatedAssetIds: string[]; failures: string[]; }

export async function generateBookImages(book: Book, provider: ImageProvider): Promise<ImageGenerationResult> {
  const assets: Asset[] = [...book.assets];
  const generatedAssetIds: string[] = [];
  const failures: string[] = [];

  for (const page of book.pages) {
    for (const panel of page.panels) {
      if (panel.assetIds.length > 0) continue;
      const characters = panel.characterIds
        .map(id => book.characters.find(character => character.id === id))
        .filter((character): character is NonNullable<typeof character> => Boolean(character));
      const references = characters.flatMap(character => character.referenceAssetIds)
        .map(id => book.assets.find(asset => asset.id === id)?.url)
        .filter((url): url is string => Boolean(url));
      const traits = characters.flatMap(character => character.visualTraits).join(", ");
      const prompt = [
        "Children's comic panel, warm, safe, friendly, non-graphic.",
        `Page ${page.pageNumber}: ${page.title}.`,
        `Narration: ${panel.narration}`,
        `Character visual identity: ${traits || "preserve the established character identity"}.`
      ].join(" ");
      try {
        const result = await provider.generate({ prompt, references });
        assets.push({ id: result.assetId, type: "page-art", url: result.url, prompt, providerId: provider.metadata.id, createdAt: new Date().toISOString() });
        panel.assetIds = [result.assetId];
        generatedAssetIds.push(result.assetId);
      } catch (error) {
        failures.push(`${panel.id}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  return { book: { ...book, assets }, generatedAssetIds, failures };
}
