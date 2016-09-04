#About
##Idea
When you need to know how many times the goo.gl URL was clicked in the one day and the three days after posted, you have to check the number from the web manually. But by that way, it's easy to forget.
If you use this way, you will be free.

##How to Use
1. Upload the goo.gl-counter.xlsx in your Google Drive.
2. To create a container-bound script, select Tools > Script editor from within Google Sheet.
3. Replace the code by BotCounter.js.
4. Set the triggers, one for _setBase_, one for _detectClick_.
5. ***setBase***: From spreadsheet, after changed.
6. ***detectClick***: Time-driven, day, 00:00 ~ 01:00 AM.
7. Run!	