export const BOSS_SPRITES = {
    CREDIT_CARD: {
        folder: 'demon_slime',
        type: 'grid',
        frameWidth: 288,
        frameHeight: 160,
        defaultScale: 2,
        groundOffset: 0,
        animations: {
            idle:   { row: 0, frames: 6  },
            walk:   { row: 1, frames: 12 },
            attack: { row: 2, frames: 15 },
            hit:    { row: 3, frames: 5  },
            death:  { row: 4, frames: 22 },
        }
    },
    STUDENT_LOAN: {
        folder: 'flying_monster',
        type: 'horizontal',
        frameWidth: 64,
        frameHeight: 64,
        defaultScale: 3,
        groundOffset: 0,
        animations: {
            idle:   { frames: 8  },
            attack: { frames: 12 },
            hit:    { frames: 4  },
            death:  { frames: 17 },
        }
    },
    AUTO_LOAN: {
        folder: 'orange_goblin',
        type: 'horizontal',
        frameWidth: 90,
        frameHeight: 64,
        defaultScale: 3,
        groundOffset: 4,
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
        defaultScale: 3,
        groundOffset: 2,
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
        defaultScale: 3,
        groundOffset: -10,
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
        defaultScale: 3,
        groundOffset: 4,
        animations: {
            idle:   { frames: 8  },
            attack: { frames: 11 },
            hit:    { frames: 4  },
            death:  { frames: 13 },
        }
    },
}