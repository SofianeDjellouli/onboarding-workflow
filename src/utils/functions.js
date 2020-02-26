import { isDev } from "./";

export const handlePromise = (promise, setLoading, handleError) => {
	if (setLoading) setLoading(true);
	window.document.body.style.cursor = "progress";
	return promise
		.catch(e => {
			if (isDev) console.error(e);
			if (handleError) handleError(e.message);
		})
		.then(e => {
			if (setLoading) setLoading(false);
			window.document.body.style.cursor = "";
			return e;
		});
};
