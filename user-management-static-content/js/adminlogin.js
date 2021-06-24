const listuserform = document.querySelector('#listuser');

const searchuserform = document.querySelector('#searchuser');
const searchuserEl = document.querySelector('#searchbyemail');

const updateuserform = document.querySelector('#updateuser');
const updateuserEl = document.querySelector('#updateuserbyemail');
const updateusernameEl = document.querySelector('#updatename');
const updateuserpasswordEl = document.querySelector('#updatepassword');

const deleteuserform = document.querySelector('#deleteuser');
const deleteuserEl = document.querySelector('#deletebyemail');



const checkUsername = (usernameEl) => {

    let valid = false;

    const min = 3,
        max = 25;

    const username = usernameEl.value.trim();

    if (!isRequired(username)) {
        showError(usernameEl, 'Username cannot be blank.');
    } else if (!isBetween(username.length, min, max)) {
        showError(usernameEl, `Username must be between ${min} and ${max} characters.`)
    } else {
        showSuccess(usernameEl);
        valid = true;
    }
    return valid;
};


const checkEmail = (emailEl) => {
    let valid = false;
    const email = emailEl.value.trim();
    if (!isRequired(email)) {
        showError(emailEl, 'Email cannot be blank.');
    } else if (!isEmailValid(email)) {
        showError(emailEl, 'Email is not valid.')
    } else {
        showSuccess(emailEl);
        valid = true;
    }
    return valid;
};

const checkPassword = (passwordEl) => {
    let valid = false;


    const password = passwordEl.value.trim();

    if (!isRequired(password)) {
        showError(passwordEl, 'Password cannot be blank.');
    } else if (!isPasswordSecure(password)) {
        showError(passwordEl, 'Password must has at least 8 characters that include at least 1 lowercase character, 1 uppercase characters, 1 number, and 1 special character in (!@#$%^&*)');
    } else {
        showSuccess(passwordEl);
        valid = true;
    }

    return valid;
};

const isEmailValid = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

const isPasswordSecure = (password) => {
    const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return re.test(password);
};

const isRequired = value => value === '' ? false : true;
const isBetween = (length, min, max) => length < min || length > max ? false : true;

const showError = (input, message) => {
    // get the form-field element
    const formField = input.parentElement;
    // add the error class
    formField.classList.remove('success');
    formField.classList.add('error');

    // show the error message
    const error = formField.querySelector('small');
    error.textContent = message;
};

const showSuccess = (input) => {
    // get the form-field element
    const formField = input.parentElement;

    // remove the error class
    formField.classList.remove('error');
    formField.classList.add('success');

    // hide the error message
    const error = formField.querySelector('small');
    error.textContent = '';
}


listuserform.addEventListener('submit', function (e) {
    
    // prevent the loginform from submitting
    e.preventDefault();

    
    const geturl = 'https://hdxgeoo21b.execute-api.ap-south-1.amazonaws.com/test/users'
    fetch(geturl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "action": "listusers"
            })
    })
    .then(response =>  {
        return response.json();

    })
    .then(body => {        
        const bodyobj = JSON.parse(body.body);
        appendData(bodyobj);
        function appendData(bodyobj) {
            document.write("<html><head><title>List Users</title><link rel=\"stylesheet\" type=\"text/css\" href=\"css/style.css\"></head><body><div class=\"container\"><form class=\"form\"><h1>Users Detail</h1><div class=\"listdiv\"></div><div class=\"form-field\"><br></br><p>Wish to go back to User Management Portal? <a href=\"adminlogin.html\">Click Here</a></p></div></form></div></body></html>");

            const userDiv = document.querySelector("div.listdiv") 
            let tableHeaders = ["Email", "Name", "Lastlogin"]

            const createUserlistTable = () => {
                while (userDiv.firstChild) userDiv.removeChild(userDiv.firstChild) 
                let usermgmtTable = document.createElement('table') 
                usermgmtTable.className = 'usermgmtTable'
                let usermgmtTableHead = document.createElement('thead')
                usermgmtTableHead.className = 'usermgmtTableHead'
                let usermgmtTableHeaderRow = document.createElement('tr') 
                usermgmtTableHeaderRow.className = 'usermgmtTableHeaderRow'
    
    
                tableHeaders.forEach(header => {
                let userHeader = document.createElement('th') 
                userHeader.innerText = header
                usermgmtTableHeaderRow.append(userHeader)
                })
    
                usermgmtTableHead.append(usermgmtTableHeaderRow) 
                usermgmtTable.append(usermgmtTableHead)
                let usermgmtTableBody = document.createElement('tbody') 
                usermgmtTableBody.className = "usermgmtTable-Body"
                usermgmtTable.append(usermgmtTableBody)
                userDiv.append(usermgmtTable) 
            }

            const appendUsers = (singleUser, singleUserIndex) => {
                const usermgmtTable = document.querySelector('.usermgmtTable') 
                let usermgmtTableBodyRow = document.createElement('tr') 
                usermgmtTableBodyRow.className = 'usermgmtTableBodyRow'

                let emailData = document.createElement('td')
                emailData.innerText = singleUser.email
                let usernameData = document.createElement('td')
                usernameData.innerText = singleUser.name
                let lastloginData = document.createElement('td')
                lastloginData.innerText = singleUser.lastlogin

                usermgmtTableBodyRow.append(emailData, usernameData, lastloginData) 
                usermgmtTable.append(usermgmtTableBodyRow) 
            }

            createUserlistTable() 

            for (const user of bodyobj) {
                let userIndex = bodyobj.indexOf(user) + 1 
                appendUsers(user, userIndex) 
            }

        }
    })
})


searchuserform.addEventListener('submit', function (e) {
    
    // prevent the loginform from submitting
    e.preventDefault();
    console.log("into search action");

    const searchemail = searchuserEl.value.trim();
    const geturl = 'https://hdxgeoo21b.execute-api.ap-south-1.amazonaws.com/test/user/search'
    fetch(geturl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "email": searchemail,
                "action": "searchuser"
            })
    })
    .then(response =>  {
        return response.json();

    })
    .then(body => {        
        console.log("body value is", body.body);
        const bodyobj = JSON.parse(body.body);
        if (bodyobj.includes("Invalid User")){
            console.log("value is", bodyobj);
            alert(bodyobj + "  Please enter correct email ID");
        }
        else {
            appendData(bodyobj);
        }
        

        function appendData(bodyobj) {
            document.write("<html><head><title>List Users</title><link rel=\"stylesheet\" type=\"text/css\" href=\"css/style.css\"></head><body><div class=\"container\"><form class=\"form\"><h1>Users Detail</h1><div class=\"searchdiv\"></div><div class=\"form-field\"><br></br><p>Wish to go back to User Management Portal? <a href=\"adminlogin.html\">Click Here</a></p></div></form></div></body></html>");
            

            const userDiv = document.querySelector("div.searchdiv") 
            let tableHeaders = ["Email", "Name", "Lastlogin"]

            const createUserlistTable = () => {
                while (userDiv.firstChild) userDiv.removeChild(userDiv.firstChild) 
                let usermgmtTable = document.createElement('table') 
                usermgmtTable.className = 'usermgmtTable'
                let usermgmtTableHead = document.createElement('thead')
                usermgmtTableHead.className = 'usermgmtTableHead'
                let usermgmtTableHeaderRow = document.createElement('tr') 
                usermgmtTableHeaderRow.className = 'usermgmtTableHeaderRow'
    
    
                tableHeaders.forEach(header => {
                let userHeader = document.createElement('th') 
                userHeader.innerText = header
                usermgmtTableHeaderRow.append(userHeader)
                })
    
                usermgmtTableHead.append(usermgmtTableHeaderRow) 
                usermgmtTable.append(usermgmtTableHead)
                let usermgmtTableBody = document.createElement('tbody') 
                usermgmtTableBody.className = "usermgmtTable-Body"
                usermgmtTable.append(usermgmtTableBody)
                userDiv.append(usermgmtTable) 
            }

            const appendUsers = (singleUser, singleUserIndex) => {
                const usermgmtTable = document.querySelector('.usermgmtTable') 
                let usermgmtTableBodyRow = document.createElement('tr') 
                usermgmtTableBodyRow.className = 'usermgmtTableBodyRow'

                let emailData = document.createElement('td')
                emailData.innerText = singleUser.email
                let usernameData = document.createElement('td')
                usernameData.innerText = singleUser.name
                let lastloginData = document.createElement('td')
                lastloginData.innerText = singleUser.lastlogin

                usermgmtTableBodyRow.append(emailData, usernameData, lastloginData) 
                usermgmtTable.append(usermgmtTableBodyRow) 
            }

            createUserlistTable() 

            for (const user of bodyobj) {
                let userIndex = bodyobj.indexOf(user) + 1 
                appendUsers(user, userIndex) 
            }
        }



    })
})


updateuserform.addEventListener('submit', function (e) {
    
    // prevent the loginform from submitting
    e.preventDefault();
    console.log("into update action");

    const updateuserdetails = updateuserEl.value.trim();
    const updateusernamedetails = updateusernameEl.value.trim();
    const updateuserpassworddetails = updateuserpasswordEl.value.trim();
    
    const geturl = 'https://hdxgeoo21b.execute-api.ap-south-1.amazonaws.com/test/user/update'
    fetch(geturl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "email": updateuserdetails,
                "name": updateusernamedetails,
                "password": updateuserpassworddetails,
                "action": "updateuser"
            })
    })
    .then(response =>  {
        return response.json();

    })
    .then(body => {        
        console.log("body value is", body.body);
        const bodyobj = JSON.parse(body.body);
        console.log("bodyobj value", bodyobj)
        alert(bodyobj);

    })
})



deleteuserform.addEventListener('submit', function (e) {
    
    // prevent the loginform from submitting
    e.preventDefault();

    const deleteemail = deleteuserEl.value.trim();
    const geturl = 'https://hdxgeoo21b.execute-api.ap-south-1.amazonaws.com/test/user/delete'
    fetch(geturl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "action": "delete",
                "email": deleteemail
            })
    })
    .then(response =>  {
        return response.json();

    })
    .then(body => {        
        console.log("body value is", body.body);
        const bodyobj = JSON.parse(body.body);
        console.log("bodyobj value", bodyobj)
        alert(bodyobj);

    })
})


const debounce = (fn, delay = 500) => {
    let timeoutId;
    return (...args) => {
        // cancel the previous timer
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // setup a new timer
        timeoutId = setTimeout(() => {
            fn.apply(null, args)
        }, delay);
    };
};


searchuserform.addEventListener('input', debounce(function (e) {
    switch (e.target.id) {
        case 'searchbyemail':
            checkEmail(searchuserEl);
            break;

    }
}));

updateuserform.addEventListener('input', debounce(function (e) {
    switch (e.target.id) {
        case 'updatename':
            checkUsername(updateusernameEl);
            break;
        case 'updateuserbyemail':
            checkEmail(updateuserEl);
            break;
        case 'updatepassword':
            checkPassword(updateuserpasswordEl);
            break;
    }
}));

deleteuserform.addEventListener('input', debounce(function (e) {
    switch (e.target.id) {
        case 'deletebyemail':
            checkEmail(deleteuserEl);
            break;
    }
}));
