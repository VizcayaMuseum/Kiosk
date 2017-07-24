<h1 align="center">Custom UI Potree Viewer</h1>

![Sample screenshot](https://github.com/ceciliaconsta3/kiosk/blob/master/assets/img/readme-pic.PNG?raw=true "Screenshot")

<p align="center">This is a simplified proof-of-concept UI for the Potree WebGL point cloud viewer.</p>
<p align="center">This project includes custom pointclouds converted with PotreeConverter.</p>

## Features
* Fullscreen HTML5 API
* Starting home page using Bootstrap
* Simple and readible sidebar
* Info overlays
* Slowed annotation camera rotations
* Single click annotations
* Touchscreen modification (pending)

## Prerequisites
Make sure you have the following installed and working in order to reproduce the project. You can view detailed installation guidelines within the following links:
* [Xampp / Apache server](https://www.apachefriends.org/index.html)
* [PotreeConverter and binaries](https://github.com/potree/PotreeConverter/releases)

## Installation
Coming soon - though it's a similar process outline by [Potree](http://potree.org/)

## Performance
Examples work best and are supported with Firefox 51, Chrome 56, and Chrome on Android

## License
For continuity sake, this project carries the same license as the original Potree project

## Task List 
- [x] When user lands on site displays 5-10s edited video 
- [x] Video redirects to landing page on end 
- [x] Increase video playback speed 
- [x] Display functional "skip" button over video 
- [x] Create scene view slider above controlbar 
- [x] Add hotspot to barge: center looking to back + back looking to center  
- [x] Update style of slider chevron icons 
- [x] Solid thinner controlbar 
- [x] Add language flag icon 
- [x] Add home icon at start of ul 
- [x] Change color of annotations to Vizcaya blue 
- [x] Set annotations links to disappear if user is inside that annotation/ reappear once user cycles out 
- [x] barge experience with nav  
- [x] Center controlbar 
- [x] Add favicon 
- [x] Combine overlays and navigation bars into one html page, reference by IDs 
- [x] Add images to slider that redirect to those scenes 
- [x] Map 1 annotation per scene to reset button – needs to display differently depending on what scene you are in 
- [x] Swap top scroll with actual exhibit images (dinosaur-prehistoric + powerful you - screen) 
- [x] Clicking "help" displays right overlay - toggle close 
- [ ] User must be able to Toggle scene view from controlbar - now  set to perform without page refresh 
- [ ] When user clicks on hotspot image in scene view becomes active 
- [ ] Add functionality to reset button – map to original annotation camera position 
- [ ] Clicking image in scene view opens that scene's "about" information overlay - toggle close 
- [ ] Toggle barge point cloud with 1917/2017 option from scene view scrollbar 
- [ ] Controlbar turns into animated hamburger icon that toggles menu on smaller viewports 
- [ ] Add hide functionality when inside scenes 
- [ ] Evaluate organizing external links for faster page load and faster slider reactions 
- [ ] Add text under scrollbar items – background dark – no border – will be the text that gets dynamically updated, triggered by flag icon 
- [ ] Add share, hide hotspots, and display info icons 
- [ ] Add flyin after pressing splash page landing buttons 
- [ ] Add time out so that screen goes back to splash page/ rotates viewer after 60 seconds of inactivity 
- [ ] Example pages feature from sliding bar (barge, house, grotto) 
- [ ] Add animation to landing page buttons 
- [ ] Create alternate black home page with scene images in place of buttons, bump title 
- [ ] Create alternate home page based on Alejandro's mockup 
 
## Issues 
- [x] controlbar getting cut off in Edge browser 
- [x]  Fix issue with hotspot carousel not showing when controlbar is above potree elements in script 
- [ ] Controlbar toggle functions do not toggle in a timely manner 
- [ ] Video playback speed not working 
- [ ] Landing page buttons not forwarding properly in Firefox (fine in edge and chrome) 
- [ ]  Fullscreen API responding in Edge browser 

