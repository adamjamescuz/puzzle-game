Name: Adam Cousins
Email: cousins.aj@gmail.com
Phone: 07939342334

TO RUN:

(Assuming you have a localhost environment setup e.g. MAMP)

1. Please unzip the project into your localhost folder 
2. Direct your browser to localhost/puzzle-game/build


(If no localhost environment setup)

1. navigate your browser to: http://adamcousins.com/demos/puzzle-app/

(Also works on mobile (tested on iphone 5s portrait))


Brief app functional description:

Home screen:
Here you can customize how many pieces the puzzle is broken into

Puzzle screen:
Drag and drop the fallen pieces into the grid
Once complete you will be shown a congratulations message and a CTA to go back to the HOME screen


Build notes:

All source is in the source folder.
Runtime app is located in the build folder (once built - see below)

To build the app:
(dependencies required: node js, sass)

Open terminal
- cd to project folder
- npm install
- bower install
- grunt run

once the 'build' folder has appeared:
navigate browser to localhost/puzzle-game/build


Development notes:
All the source code contains lots of comments - so here is just a brief overview:

1. source/app/js/__entry.js:

__entry.js is the entry point JS, defines a simple single page app structure JSON and initilises 
a new single application, passing in the site model JSON.


2. source/app/js/core

Although I see the benefit of front end frameworks e.g. Backbone, Angular etc, for this I have just used my own bespoke lightweight single page 
app framework as it contains just two views and I can achieve everything I need to whilst still having enough scalability should I extend the app later.
The code for this is source/app/js/core - basically consists of just two classes:

app-controller.js - manages listening for url hash changes and subsequent initialising of view controllers
_page-view-controller.js - base class containing view controller functionality. Individual view controllers are in source/app/js/views
and extend this class and override certain functions (see 3)


3. source/app/js/views
Just two views: home-view-controller.js (manages home related functionality) and puzzle-view-controller.js (manages creation of
a new puzzle)


4. source/app/js/components/puzzle
Contains all the puzzle game logic classes. Have made it a re-usable class which accepts number of pieces and breaks the image into this number

Thank you.

