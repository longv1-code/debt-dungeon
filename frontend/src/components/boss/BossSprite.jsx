import { useEffect, useRef, useState } from 'react'
import styles from './BossSprite.module.css'

const BOSS_SPRITES = {
    CREDIT_CARD: {
        folder: 'demon_slime',
        type: 'grid',
        frameWidth: 288,
        frameHeight: 160,
        animations: {
            idle: { row: 0, frames: 6 },
            walk: { row: 1, frames: 12 },
            attack: {row: 2, frames: 15 },
            hit: { row: 3, frames: 5 },
            death: { row: 4, frames: 22 },
        }
    },
    STUDENT_LOAN: {
        folder: 'flying_monster',
        type: 'horizontal',
        frameWidth: 64,
        frameHeight: 64,
        animations: {
            idle: { frame: 8 },
            attack: { frame: 12 },
            hit: { frame: 4 },
            death: { frames: 17 },
        }
    },
    AUTO_LOAN: {
        folder: 'orange_goblin',
        type: 'horizontal',
        frameWidth: 90,
        frameHeight: 64,
        animations: {
        idle:   { frames: 8  },
        attack: { frames: 11 },
        hit:    { frames: 4  },
        death:  { frames: 13 },
        }
    },
    MEDICAL: {
        folder: 'mushroom',
        type: 'horizontal',
        frameWidth: 80,
        frameHeight: 64,
        animations: {
        idle:   { frames: 7  },
        attack: { frames: 10 },
        hit:    { frames: 5  },
        death:  { frames: 15 },
        }
    },
    PERSONAL: {
        folder: 'bat',
        type: 'horizontal',
        frameWidth: 64,
        frameHeight: 64,
        animations: {
        idle:   { frames: 9  },
        attack: { frames: 8  },
        hit:    { frames: 5  },
        death:  { frames: 12 },
        }
    },
    OTHER: {
        folder: 'blue_goblin',
        type: 'horizontal',
        frameWidth: 90,
        frameHeight: 64,
        animations: {
        idle:   { frames: 8  },
        attack: { frames: 11 },
        hit:    { frames: 4  },
        death:  { frames: 13 },
        }
    },
}

const FRAME_DURATION = 120

const BossSprite = ({ debtType, animation = 'idle', scale = 3, onAnimationEnd }) => {
    const config = BOSS_SPRITES[debtType]
    const animConfig = config?.animations[animation]
    const [currentFrame, setCurrentFrame] = useState(0)
    const intervalRef = useRef(null)

    useEffect(() => {
        // Reset to first frame when animation changes
        setCurrentFrame(0)

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
    }, [animation, debtType])

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
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
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