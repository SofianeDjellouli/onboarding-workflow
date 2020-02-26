import React, { Suspense, lazy } from "react";
import { render } from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

const App = lazy(_ => import("./App"));

render(
	<Suspense
		fallback={
			<div className="loading">
				<img src="/Pacman-0.7s-100px.svg" alt="Loading..." />
			</div>
		}>
		<App />
	</Suspense>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
