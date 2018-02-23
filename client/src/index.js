import React from "react";
import ReactDOM from "react-dom";

import registerServiceWorker from "./registerServiceWorker";
import Router from "@/router";

ReactDOM.render(<Router />, document.getElementById("picosix-app"));
registerServiceWorker();
