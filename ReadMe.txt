Assuming the user has a basic PHP and web server environment, from career_launch directory, run the following commands in terminal:

```
brew services start php
php -S localhost:8000
```

Next, open the browser and run:
http://localhost:8000/

Sort button with name and email can be used for sorting in either ascending or descending order.
Search card handles search functionality.
In order to change the number of items displayed on the page, you can change itemsPerPage in script.js.
The default value is 4 to show pagination.
You can click on details button which will pop up a modal view to show user details.
Implemented spinner that is visible till the data is fetched from the API.
Implemented tooltip for better user experience.
