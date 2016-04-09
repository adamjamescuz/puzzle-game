TO RUN:

Please unzip the project into your local host folder as it uses createJS's Loader to load in some assets
Once unzipped to your localhost folder direct your browser to localhost/puzzle-game/build

OR You can also run the app by visiting:

http://adamcousins.com/demos/puzzle-app/

(Also works on mobile (tested on iphone 5s portrait))

HOME SCREEN:
Here you can customize how many pieces the puzzle is broken into

PUZZLE SCREEN:
Drag and drop the fallen pieces into the grid
Once complete you will be shown a congratulations message and a CTA to go back to the HOME screen



Build notes:
All source is in the source folder.
Runtime app is located in the build folder (once built - see below)

To build the app:
(dependencies required: node js, scss)

Open terminal
- cd to project folder
- npm install
- bower install
- grunt run

once the 'build' folder has appeared:
navigate browser to localhost/puzzle-game/build


Development notes:
All the source ins source contains lots of comments - so here is just a brief overview:

1. source/app/js/__entry.js:

contains all the application JS. __entry.js is the entry point JS, defines a simple single page app structure JSON and initilises 
a new single application, passing in the site model JSON.


2. source/app/js/core

Although I see the benefit of front end frameworks Backbone, Angular etc, for this I have just used my own bespoke lightweight single page 
app framework as it contains just two views and I can achieve everything I need to whilst still having enough scalability should I extend the app later.
The code for this is source/app/js/core - basically consists of just two classes:

app-controller.js - manages listening for url changes and initialising of view controllers
_page-view-controller.js - base class containig view controller functionality. Individual view controllers in source/app/js/views
extend this class and override certain functions (see 3)


3. source/app/js/views
Just two views: home-view-controller.js (manages home related functionality) and puzzle-view-controller.js (manages creation of
a new puzzle)


4. source/app/js/components/puzzle
Contains all the puzzle game logic. Have made it a re-usable class which accepts number of pieces and breaks the image into this number


