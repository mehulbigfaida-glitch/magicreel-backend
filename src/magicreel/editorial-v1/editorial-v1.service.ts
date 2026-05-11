import { buildEditorialPrompt } from './builders/editorialPromptBuilder'

export interface GenerateEditorialV1Input {
  worldId?: any

  variationSeed?: number
}

export async function generateEditorialV1Prompt(
  input: GenerateEditorialV1Input
) {
  const prompt = buildEditorialPrompt({
    worldId: input.worldId,
    variationSeed: input.variationSeed,
  })

  return {
    success: true,
    prompt,
  }
}