import type { H3Event, EventHandlerRequest } from "h3";

export function getParamOrThrow(event: H3Event<EventHandlerRequest>, param: string) {
	const paramValue = getRouterParam(event, param);
	if (!paramValue) {
		throw createError({
			statusCode: 400,
			message: `${param} is required`,
		});
	}
	return paramValue;
}

export function getUserId(event: H3Event<EventHandlerRequest>) {
	return event.context.auth.user.id;
}
