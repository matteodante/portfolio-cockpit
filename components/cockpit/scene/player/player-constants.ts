// Tuning values for the player controller. Kept as a dedicated module so
// the physics functions stay pure and easy to tweak.

// Flight
export const ACCEL_FLY = 26
export const VMAX_FLY = 30
export const DRAG_TANG = 0.985
export const TURN_RATE_FLY = 1.2

// Walking on a planet
export const WALK_SPEED = 7
export const RUN_MULT = 1.6
export const TURN_RATE_LANDED = 2.4

// Land / takeoff transition
export const LAND_GAP = 1.2
export const LAND_VEL_MAX = 12
export const LAND_DIST_EXTRA = 10
export const TAKEOFF_BOOST = 16
export const TAKEOFF_CLEARANCE = 2.5
export const TRANS_DURATION = 0.75

// Collision margin
export const COLLISION_EXTRA = 1.5

// Black hole gravity & death
// Pull kicks in when the player is within BH_GRAV_RADIUS of the origin;
// acceleration magnitude follows BH_GRAV_STRENGTH / d^2. At or inside
// BH_DEATH_RADIUS (inside the shadow) the player dies — same flow as
// the asteroid collision (explosion + respawn), handled by the
// orchestrator, not the physics module.
export const BH_GRAV_STRENGTH = 420
export const BH_GRAV_RADIUS = 80
export const BH_DEATH_RADIUS = 5

// Death + respawn
export const DEATH_DURATION = 3
export const RESPAWN_POS: readonly [number, number, number] = [0, 0, -114]
