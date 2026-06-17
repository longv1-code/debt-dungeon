import { BOSS_SPRITES } from '../data/bossSprites.js'

const preloadedTypes = new Set()

const preloadImage = (src) => {
    const img = new Image()
    img.src = src
    return img
}

export const preloadBossSpriteAssets = (debtType) => {
    if (!debtType || preloadedTypes.has(debtType)) return

    const config = BOSS_SPRITES[debtType]
    if (!config) return

    preloadedTypes.add(debtType)

    const animations = ['idle', 'attack', 'hit', 'death']

    animations.forEach((anim) => {
        const src = config.type === 'grid'
            ? `/assets/sprites/bosses/${config.folder}/spritesheet.png`
            : `/assets/sprites/bosses/${config.folder}/${anim}.png`

        preloadImage(src)
    })
}

export const preloadBossSpriteSet = (debtTypes = []) => {
    debtTypes.forEach((debtType) => preloadBossSpriteAssets(debtType))
}