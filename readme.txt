1. to start the app in terminal :
	a. install dependencies : npm i
	b. to start the expo app: npm start

2. to launch app in mobile install expo go 	
	a. in android scan the barcode in terminal from the expo go app.
	b. for ios use camera to scan the terminal barcode

3. after app is running, in app.js line #23, change the component name to render the component(screen) in mobile.

	ex. if you want to see checkInscreen1 (all screens are in screens folder) replace the component name with
	the main function in respective screen. Hence to see checkInScreen1, replace the curret component 
	say for ex. <HabitTracker /> --> <CheckInScreen1 /> and take a reload, simply press r in terminal.