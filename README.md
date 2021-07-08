# project-genesys
Project Assignment on user management and authentication system
**User-management-static-content** folder consists of static HTML,CSS and JS used for user-management portal
**lambda_function.py** is for CRUD operations in dynamodb using python

**URL for user-management portal:** http://user-management-portal.s3-website.ap-south-1.amazonaws.com/

User Registraion, Sign-in and user management with validations are enabled.

**Sign Up form** - User registration and link to sign-in
**User Login Portal** - For user to login with registered credentials
**User Management Portal** - to list, search, update, delete and create users. 

For the CRUD operations, Rest APIs are manually enabled and integrated with lambda function. Data has  been stored and managed in dynamodb.

 **Instructions to access the portal**:
 
 1. a. If accessing from local, Download the static code from https://github.com/sakthimuthuvel/project-genesys/tree/main/user-management-static-content
and open https://github.com/sakthimuthuvel/project-genesys/blob/main/user-management-static-content/register.html in any webserver.
 1. b. If accessing the S3 website, open the URL **http://user-management-portal.s3-website.ap-south-1.amazonaws.com/** in any web browser.
 2. We will land in **Sign Up** form. Perform user registration and click **Sign in** link to login.
 3. Post login, we would be landed in **User Management Portal**.
 4. Click **List Users** to list all the registered users.
 5. Using **Click Here** link, please go back to user Management Portal.
 6. Provide Email ID and click **Search User** to get the details of a particular user.
 7. Using **User Details Update Section**, we can update name and password of the registered email id.
 8. For the provided email id, we can delete the user account using  **Delete Users**
 9. With the **Create User** link, we could register the new user.
 10. **Click here to Sign Out!!!** link is to go back to user login portal form.

**Instruction to run lambda function:**

Create event in JSON (key,value pair) as below for specific CRUD operations.
----------------------------------------------------------------------------

**Event for user registraion and create user operation**,
{
  "name": username,                     //"username in string"
  "email": email,                      // "email id in string,
  "password": password,               // "password in alphanumeric"
  "action": "PUT"
}


**Event for uer login operation**,
{
  "emailid": emailid,                               // provide registed email id"
  "passwordvalue": passwordvalue,                  // password of the above specified email id"
  "lastlogin":  dformat,                          // "Format - 	6/23/2021 22:48:27"
  "action": "login"
}


**Event for List User operation**,
{
  "action": "listusers"
}

**Event for Search User operation**,
{
  "email": searchemail,                         // "registered email id to search"
  "action": "searchuser"
}

**Event for Update User operation**,

{
  "email": updateuserdetails,                         // "registered email id to update name and password"
  "name": updateusernamedetails,                     // "name to be updated with"
  "password": updateuserpassworddetails,            // "password to be updated with"
  "action": "updateuser"
}

**Event for Delete User operation**,
{
   "action": "delete",
   "email": deleteemail                   // "provide registered email that has to be deleted"
}

