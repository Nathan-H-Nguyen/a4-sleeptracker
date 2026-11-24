--Readme document for Nathan Nguyen, nathahn9@uci.edu, NATHAHN9--

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

10/10
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 2/2 Either using a native device resource or backing up logged data
- 2/2 Following good principles of mobile design
- 2/2 Creating a compelling app
- 1/1 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?
- Tuesday   (11/17/2026): ~6 hours
    - Spent time creating app design using figma, looking into different ionic components, and looking into then implementing Ionic Storage
- Wednesday (11/18/2026): ~6 hours
    - Spent time working on the data layer, making changes to the provided data classes and adding util functions to be used once UI is started
- Thursday (11/19/2026): ~4 hours
    - Spent time working on the Home Page UI components, only finished the Header and Hero Card components.
        - NOTE: I had wisdom teeth extraction this day so I was super out of it from the anesthesia. Lowkey a miracle I even completed something ngl
- Friday (11/20/2026): ~8 hours
    - Spent time working on the rest of the Home Page UI component. Implemented the action buttons (still need to work on functionality), implemented the recent logs segment switches to display overnight sleep data and daytime sleepiness check ins, currently left off on creating modal menu screens to log data.
- Saturday (11/21/2026): ~6 hours
    - Spent time working on implementing the modal popups to log sleep and sleepiness checkins. Also worked on tab bar navigation to calendar page, and routing from recent log cards directly to calendar date.

3. What online resources did you consult when completing this assignment? (list specific URLs)
- General:
    - https://www.w3schools.com/js/js_varletconst.asp
    - https://ionicframework.com/docs/api/card
    - https://ionicframework.com/docs/api/icon
    - https://ionic.io/ionicons
    - https://ionicframework.com/docs/api/segment
    - https://ionicframework.com/docs/api/list
    - https://ionicframework.com/docs/api/modal
    - https://ionicframework.com/docs/api/toast
    - https://ionicframework.com/docs/api/datetime

- AI:
    - Used AI to create a bunch of default seed data so I didn't have to generate it myself one by one
    - Google search that gave me an AI overview answer: "what is yyyy-mm-dd format called"
    - Used AI chatbot to help fix bugs when I was creating the sleep sheet and sleepiness sheet components
        - Also used it to help with styling because I was running into trouble with formatting
    - I could not figure out how to get app.routes.ts working, so I had AI help me change the file for app routing for the navigation bar I added.
    - Used AI chatbot to help fix bugs and logic errors when I was creating the calendar, also used it to help with styling.

- Ionic Storage:
    - https://www.youtube.com/watch?v=hSFy_qvlDGE
    - https://github.com/ionic-team/ionic-storage
    - https://developer.chrome.com/docs/devtools/storage/localstorage

- Utils:
    - https://www.geeksforgeeks.org/javascript/how-to-format-javascript-date-as-yyyy-mm-dd/
    - https://stackabuse.com/javascript-get-number-of-days-between-dates/


4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?
- I worked on this project solo, so I didn't consult or communicate with fellow classmates or other individuals.


5. Is there anything special we need to know in order to run your code?
- I did install a couple packages (don't remember what exactly), but I committed the package.json and package-lock.json so a simple npm install should be good to run it. ALSO, I designed this app specifically for iOS iPhone 16, so when running this in the browser set dimensions to that.


--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?
- No, I designed it to be appealing to a wide user base, not targeted towards a specific group. However I did design it specifically for iPhone 16 dimensions


7. Did you design your app specifically for iOS or Android, or both?
- I designed my app specifically for iOS (iPhone 16), since I use iOS in my personal life and it's what I'm most comfortable with developing and interacting with.



8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?
- A person can log overnight sleep directly through the home page by selecting the "Log Sleep" action button, pressing this brings up a modal menu where users can select the time they went to sleep and woke up at, as well as give their sleep a rating from 1-5. I chose this because it felt familiar and I've seen other apps do similar designs, I also chose to avoid the "running" timer where you press a button to start and then press again to end because I find features like those easy to forget which can cause bad logs.

9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?
- A person can log sleepiness during the day by selecting the "Sleepiness" action button on the home page which brings up a modal menu with 7 different cards for each rating, they select a card then save their answer. I again chose this because it seemed familiar to some other apps I've used where clicking a button brings up a menu, its also intuitive and easy to understand.


10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?
- Using the recent logs section on the homepage users can flip between seeing the last 7 days of either sleep or sleepiness logs. There is also a Calendar page that users can navigate to by either clicking on one of the previously mentioned logs or using the navigation island at the bottom, here they can click on individual days to see what they logged and navigate between months as well.


11. Which feature choose--using a native device resource, backing up logged data, or both?
- The feature I chose to implement was backing up logged data using ionic storage and following the documentation and video provided in the assignment description


12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?
- N/A


13. If you backed up logged data, where does it back up to?
- My logged data is backed up and stored in an IndexedDB that lives within the browser allowing to survive refreshes and restarts.

14. How does your app implement or follow principles of good mobile design?
- It has a useful initial view allowing users to see relevant information and log sleep/sleepiness directly from the home page.
- I have "uh-oh" buttons implemented on several components like when logging data or navigating to pages, these buttons cancel entries, navigate back to the previous page, etc.
- Error prevention is implemented such that the sleep end time must be after the sleep start time, not possible to sleep back in time
- Follows iOS platform conventions by prioritizing content over UI, using the whole height and width of the screen for the interface, using simple colors, using borderless buttons and widgets, AND taking into account features on the screen like the floating island at the top (I lowered the header to make room for it) and the home bar at the bottom (I raised the navigation island to make room for it)