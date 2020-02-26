import React, { Fragment } from "react";
import { Input as SuiInput } from "semantic-ui-react";
import "./style.css";

export const Input = ({ label, error, ...props }) => (
	<Fragment>
		{label && <label htmlFor={props.id}>{label}</label>}
		<SuiInput fluid {...props} />
		{error && <p className="error">{error}</p>}
	</Fragment>
);
