This is a simplified finance tracker, a web app that is similar in function to the popular rocket money. The application uses the Plaid api to connect to and receive data from financial institutions and then it displays the data in an easy to ready format for users. Currently, the web app uses Plaid's sandbox mode, where transaction data is simulated and no real banks are involved in the process. This project was done for a capstone project for computer science.

To test the application, connect to the website "finance-tracker-7x6.pages.dev" where you will be met with an account landing page. This page offers incredibly basic account login and creation. To create an account, enter in the desired user ID and password into the appropriately labeled fields. The user ID must be unique and accompanied with a password. If account creation is successful, following the response from the server an alert will be displayed by the browser. 

To login, the process is the same but must be done with an existing username and password and must be completed by clicking the login button. Before the dashboard is rendered, an alert will be displayed to communicate a successful login.

When navigating to the dashboard on a fresh account, or an account that has not linked a bank account, most elements will not be rendered. To link a bank account, click the link button.

After the link button is pressed, a plaid overlay will be displayed. Follow the instructions in the overlay until you reach the bank login page. This login page will be the same no matter which institution is selected.

For the username and password, enter "user_good" and "pass_good" respectively. You may then continue through the options presented by plaid for accounts to link and authorization.

You may repeat this process several times to link accounts from different institutions or link new accounts from the same bank.
