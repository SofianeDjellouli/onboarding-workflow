import { useState, useCallback } from "react";

export const useToggle = (bool = false) => {
	const [toggled, setToggled] = useState(bool);
	const toggle = useCallback(_ => setToggled(toggled => !toggled), []);
	return { toggled, toggle };
};
