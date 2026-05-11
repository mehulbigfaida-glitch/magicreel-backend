import { buildEditorialPrompt } from './builders/editorialPromptBuilder'

const prompt = buildEditorialPrompt({
  worldId: 'dark-aristocracy',

  framePreset: 'coutureEditorial',

  lensPreset: 'cinematic85mm',

  lightingPreset: 'darkEditorial',

  emotionPreset: 'aristocraticDistance',

  suppressionPreset: 'cinematicIsolation',

  variationSeed: 7,
})

console.log('\n')
console.log('==============================')
console.log('MAGICREEL EDITORIAL ENGINE V1')
console.log('==============================')
console.log('\n')

console.log(prompt)

console.log('\n')
console.log('==============================')
console.log('END')
console.log('==============================')
console.log('\n')