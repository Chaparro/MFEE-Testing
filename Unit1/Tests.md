Markdown Table here

type 	description 	example 	mock candidates
unit 	the smallest bit of code you can isolate 	const sum = (a, b) => a + b 	own code, external code, external system
component 	a unit + dependencies 	const arithmetic = (op = sum, a, b) => ops[op](a, b) 	external code, external system
integration 	components fitting together 	- 	external code, external system
end-to-end (e2e) 	app + external data stores, delivery, etc 	A fake user (ex a Playwright agent) literally using an app connected to real external systems. 	none (do not mock)