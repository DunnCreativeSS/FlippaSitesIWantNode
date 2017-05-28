Run node flippa2.js to see a list of open flippa auctions with some output to tell you how great they are, after replacing 'yourflippaemail' and 'yourflippapassword' in the flippa2.js file.

https://www.screencast.com/t/4n3eiBG3p8ya

Version 2 is an Express.js server running on localhost:3000 (follow above directions then navigate browser to said address):

https://www.screencast.com/t/Oaa5MYDmvmE

Version 3 has a variable minimum revenues GET param thru standard form:

https://www.screencast.com/t/Serekpy7nP

V4. has a variable maximum months ROI GET param thru standard form:

https://www.screencast.com/t/TwWhq3ZLzKDU

V5. has a variable dropdown for whether or not to consider Buy It Now values or traditional auctions:

https://www.screencast.com/t/6M55Y14EEGnz  

V6. shows those listings that have met reserve with a shiny green indicator:

https://www.screencast.com/t/5sfX9HTpIOT3

V7. shows listings sorted by those (auctions) ending soonest:

https://www.screencast.com/t/hW0vt6rd

V8. ended dependency on Flippa node module other than authentication and now uses requests library to get initial as well as additional Flippa results, so we can now sort by [min]s and [max]s of stuff. Added [min] uniques_per_month:

https://www.screencast.com/t/O8IYSmJU

V9. implements a strategy for winning auctions (doesn't really apply to BIN) whereby underappreciated adsense or other ad potential can be identified and then capitalized on. The theory is that those sites with many verified uniques but not that much verified revenue can probably be easily capitalized on to realize near-instant increases in revenue.

https://www.screencast.com/t/wToKbCzyd7

V9.2. 'est income' is simply uniques / 100.

https://www.screencast.com/t/FcPZIc5jDz
