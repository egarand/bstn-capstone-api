import { rateLimit } from "express-rate-limit";
import { slowDown } from "express-slow-down";

/* Rate limiting middlewares to help protect the API - and especially to
 * safeguard the proxy endpoints - from heavy usage.
 *
 * This is less important for a small application I expect very few people
 * to be using at once, but I would rather implement this early than get
 * blocked by any of our source APIs. */

const tenMinutes = 10 * 60 * 1000;

/** Use to rate limit requests to proxy endpoints */
export const sourceApiLimiter = rateLimit({
	windowMs: tenMinutes,
	limit: 100,
	message: "Sorry, you've been rate limited. Please try again in 10 minutes."
});

/** Use to delay requests to proxy endpoints */
export const sourceApiSpeedLimiter = slowDown({
	windowMs: tenMinutes,
	delayAfter: 10,
	delayMs: 500,
	maxDelayMs: 5000
});

/** Use to rate limit requests to non-proxy endpoints */
export const limiter = rateLimit({
	windowMs: tenMinutes,
	limit: 200,
	message: "Sorry, you've been rate limited. Please try again in 10 minutes."
});

/** Use to delay requests to non-proxy endpoints */
export const speedLimiter = slowDown({
	windowMs: tenMinutes,
	delayAfter: 50,
	delayMs: 500,
	maxDelayMs: 5000
});
