export const isDev = process.env.NODE_ENV === "development";

const defaultField = { value: "", error: "" };

export const fields = [["firstName", "lastName", "email"], ["goal1", "goal2", "goal3"]];

const defaultForm = {};

for (let i = 0; i < fields.length; i++)
	for (let j = 0; j < fields[i].length; j++) defaultForm[fields[i][j]] = defaultField;

export { defaultForm };
