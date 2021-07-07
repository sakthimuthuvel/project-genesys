# project-genesys
Project Assignment on user management and authentication system
**User-management-static-content** folder consists of static HTML,CSS and JS used for user-management portal
**lambda_function.py** is for CRUD operations in dynamodb using python

**URL for user-management portal:** http://user-management-portal.s3-website.ap-south-1.amazonaws.com/

User Registraion, Sign-in and user management with validations are enabled.

**Sign Up form** - User registration and link to sign-in
**User Login Portal** - For user to login with registered credentials
**User Management Portal** - to list, search, update, delete and create users. 

For the CRUD operations, Rest APIs are enabled and request processing is done through lambda function and data is stored in dynamodb.

 **Instructions for kind reference**:
 
 1. Open the URL **http://user-management-portal.s3-website.ap-south-1.amazonaws.com/** in any web browser.
 2. We will land in **Sign Up** form. Perform user registration and click **Sign in** link to login.
 3. Post login, we would be landed in **User Management Portal**.
 4. Click **List Users** to list all the registered users.
 5. Using **Click Here** link, please go back to user Management Portal.
 6. Provide Email ID and click **Search User** to get the details of a particular user.
 7. Using **User Details Update Section**, we can update name and password of the registered email id.
 8. For the provided email id, we can delete the user account using  **Delete Users**
 9. With the **Create User** link, we could register the new user.
 10. **Click here to Sign Out!!!** link is to go back to user login portal form.
 
