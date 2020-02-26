import React from "react";
import { Header as SuiHeader } from "semantic-ui-react";

export const Header = ({ children }) => (
	<SuiHeader as="h1" textAlign="center">
		{children}
	</SuiHeader>
);
