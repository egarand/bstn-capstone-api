import { rateLimit } from "express-rate-limit";
import { slowDown } from "express-slow-down";

/* Rate limiting middlewares to help protect the API - and especially to
 * safeguard the proxy endpoints - from heavy usage.
 *
 * This is less important for a small application I expect very few people
 * to be using at once, but I would rather implement this early than get
 * blocked by any of our source APIs. */

const oneMinute = 60 * 1000;

const proxyLimiterConfig = {
	windowMs: oneMinute,
	limit: 10,
	message: "Too many requests; try again in 1 minute."
};

const proxySpeedLimiterConfig = {
	windowMs: oneMinute,
	delayAfter: 5,
	maxDelayMs: 10_000
};

/** Use to rate limit requests to non-proxy endpoints */
export const limiter = rateLimit({
	windowMs: oneMinute,
	limit: 20,
	message: "Too many requests; try again in 1 minute."
});

/** Use to delay requests to non-proxy endpoints */
export const speedLimiter = slowDown({
	windowMs: oneMinute,
	delayAfter: 5,
	maxDelayMs: 5000
});

/** Use to rate limit requests to inaturalist proxy endpoints */
export const inatLimiter = rateLimit(proxyLimiterConfig);
/** Use to delay requests to inaturalist proxy endpoints */
export const inatSpeedLimiter = slowDown(proxySpeedLimiterConfig);

/** Use to rate limit requests to overpass proxy endpoints */
export const osmLimiter = rateLimit(proxyLimiterConfig);
/** Use to delay requests to overpass proxy endpoints */
export const osmSpeedLimiter = slowDown(proxySpeedLimiterConfig);
