import { useEffect, useRef, useState } from 'react'
import styles from './BossSprite.module.css'
import { BOSS_SPRITES } from '../../data/bossSprites.js'

const FRAME_DURATION = 120

const BossSprite = ({ debtType, animation = 'idle', scale = 3, onAnimationEnd }) => {
    const config = BOSS_SPRITES[debtType]
    const actualScale = scale ?? config?.defaultScale ?? 3
    const groundOffset = config?.groundOffset ?? 0
    const animConfig = config?.animations[animation]
    const [currentFrame, setCurrentFrame] = useState(0)
    const intervalRef = useRef(null)

    useEffect(() => {
        // Clear any existing interval
        if (intervalRef.current) clearInterval(intervalRef.current)

        if (!animConfig) return

        intervalRef.current = setInterval(() => {
            setCurrentFrame((prev) => {
                const nextFrame = prev + 1

                // If we reached the last frame
                if (nextFrame >= animConfig.frames) {
                    // For death animation -- stop on last frame
                    if (animation === 'death') {
                        clearInterval(intervalRef.current)
                        onAnimationEnd?.()
                        return prev
                    }
                    // For hit and attack -- play once then singal end
                    if (animation === 'hit' || animation == 'attack') {
                        clearInterval(intervalRef.current)
                        onAnimationEnd?.()
                        return 0
                    }
                    // For all others -- loop back to start
                    return 0
                }

                return nextFrame
            })
        }, FRAME_DURATION)

        // Cleanup interval when compponent unmounts or animation changes
        return () => clearInterval(intervalRef.current)
    }, [animation, animConfig, onAnimationEnd])

    if (!config || !animConfig) return null

    // Build the background-position based on spritesheet type
    const getBackgroundStyle = () => {
        const { type, frameWidth, frameHeight, folder } = config

        const fileName = type === 'grid' ? 'spritesheet' : animation

        const src = `/assets/sprites/bosses/${folder}/${fileName}.png`

        // X position - current frame * frame width
        const xPos = -(currentFrame * frameWidth)

        // Y position - for grid sheets, each row is an animation
        const yPos = type === 'grid'
            ? -(animConfig.row * frameHeight)
            : 0

        return {
            backgroundImage: `url(${src})`,
            backgroundPosition: `${xPos}px ${yPos}px`,
            backgroundRepeat: 'no-repeat',
            width: `${frameWidth}px`,
            height: `${frameHeight}px`,
            transform: `translateY(${groundOffset}px) scale(${actualScale})`,
            transformOrigin: 'center bottom',
            imageRendering: 'pixelated', // keeps pixel art crisp when scaled    
        }
    }

    return (
        <div className={styles.wrapper}>
            <div 
                className={styles.sprite}
                style={getBackgroundStyle()}
            />
        </div>
    )
}

export default BossSprite