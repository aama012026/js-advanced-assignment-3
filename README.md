### DOTA performance view
- Write your 9 digit steam account-id (friend-code) or search for it with your persona-name
- Get a summary of recent matches and detailed performance analysis for selected match (not available to expand match view on website)
- Request a parse of a match, wait a bit, and try to view the same match. It should contain more information (not available on website)
You need to have allowed your information to be accessed by third parties in the Dota 2 client. If you have not or don't play the game - Here's a known accountId: 86176724.

## Learnings
Working with this in typescript has been a steep learning curve in data-piping and validation. The website only displays a tiny amount of the data fetched and transformed (a summary of a player's matches), but there are actually multiple calls made after an initial search that fetches profile info, and infrastructure to get more details on every match. I will use this project as the basis for the next one, and continue to work it towards a portfolio piece. Check the code and console log messages for a bit more insight.
