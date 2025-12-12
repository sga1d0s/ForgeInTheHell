class Particle {
    constructor(id, state, xPos, yPos, physics, alpha) {
        this.id         = id;
        this.state      = state;
        this.xPos       = xPos;
        this.yPos       = yPos;
        this.physics    = physics;
        this.alpha      = alpha;
    }
}

class HammerSparkParticle extends Particle {
  constructor(id, state, xPos, yPos, physics, alpha, radius, timeToLive, color) {
    super(id, state, xPos, yPos, physics, alpha);

    this.radius = radius;
    this.timeToLive = timeToLive;
    this.life = 0;
    this.color = color;

    this.vx = 0;
    this.vy = 0;
    this.baseAlpha = alpha;
  }
}

class RainParticleSparkle extends Particle {
    constructor(id, state, xPos, yPos, physics, alpha, width, height, radius, color) {
        super(id, state, xPos, yPos, physics, alpha);

        this.width  = width;
        this.height = height;
        this.radius = radius;
        this.color  = color;
    }
}

class SkeletonSpawnCloudParticle extends Particle {
    constructor(id, state, xPos, yPos, physics, alpha, radius, timeToLive, color) {
        super(id, state, xPos, yPos, physics, alpha);

        this.radius = radius;
        this.timeToLive = timeToLive;
        this.life = 0;
        this.color = color;

        // simple motion
        this.vx = 0;
        this.vy = 0;
        this.baseAlpha = alpha;
    }
}

export {
    HammerSparkParticle,
    RainParticleSparkle,
    SkeletonSpawnCloudParticle,
};