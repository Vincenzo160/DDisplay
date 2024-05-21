# DDisplay
A simple online Digital Signage Software
## Current features
- Image and gif slide support
- Text slide support
- PSA banner
- Weather extension
- Dashboard for slide management
## Setup a DDisplay Sign
DDisplay should work on any device that can run an up to date browser, it is recommended to use the kiosk mode of your browser and set it up to execute at startup for sign usage
### Browser kiosk mode
Use this flag to run the browser in kiosk mode, make sure to replace "YOURIDHERE" with your DDisplay Code
- Firefox: `firefox -kiosk https://ddisplay.sgtbots.com/display?id=YOURIDHERE` [[documentation]](https://support.mozilla.org/en-US/kb/firefox-enterprise-kiosk-mode)
- Chromium based: `chrome --kiosk https://ddisplay.sgtbots.com/display?id=YOURIDHERE`
# WARNING
The backend software [hosted on sgtbots.com](https://ddisplay.sgtbots.com) is NOT yet ready for production use as i can't gurantee the security of the data stored due to the very early experimental stage, if you want to use it on a production enviorment please consider self-hosting and using your own firebase project
