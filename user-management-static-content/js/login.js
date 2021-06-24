const emailidEl = document.querySelector('#emailid');
const passwordvalueEl = document.querySelector('#passwordvalue');

const loginform = document.querySelector('#login');

const checkEmailId = () => {
    let valid = false;
    const emailid = emailidEl.value.trim();
    if (!isRequired(emailid)) {
        showErrorMsg(emailidEl, 'Email cannot be blank.');
    } else if (!isEmailIdValid(emailid)) {
        showErrorMsg(emailidEl, 'Email is not valid.')
    } else {
        showSuccessMsg(emailidEl);
        valid = true;
    }
    return valid;
};

const checkPasswordValue = () => {
    let valid = false;


    const passwordvalue = passwordvalueEl.value.trim();

    if (!isRequired(passwordvalue)) {
        showErrorMsg(passwordvalueEl, 'Password cannot be blank.');
    } else if (!isPasswordSecure(passwordvalue)) {
        showErrorMsg(passwordvalueEl, 'Password must has at least 8 characters that include at least 1 lowercase character, 1 uppercase characters, 1 number, and 1 special character in (!@#$%^&*)');
    } else {
        showSuccessMsg(passwordvalueEl);
        valid = true;
    }

    return valid;
};


const isEmailIdValid = (emailid) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(emailid);
};

const isPasswordSecure = (passwordvalue) => {
    const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return re.test(passwordvalue);
};

const isRequired = value => value === '' ? false : true;
const isBetween = (length, min, max) => length < min || length > max ? false : true;


const showErrorMsg = (input, message) => {
    // get the loginform-field element
    const loginformField = input.parentElement;
    // add the error class
    loginformField.classList.remove('success');
    loginformField.classList.add('error');

    // show the error message
    const error = loginformField.querySelector('small');
    error.textContent = message;
};

const showSuccessMsg = (input) => {
    // get the loginform-field element
    const loginformField = input.parentElement;

    // remove the error class
    loginformField.classList.remove('error');
    loginformField.classList.add('success');

    // hide the error message
    const error = loginformField.querySelector('small');
    error.textContent = '';
}




loginform.addEventListener('submit', function (e) {
    // prevent the loginform from submitting

    e.preventDefault();

    // validate fields
    let isEmailIdValid = checkEmailId(),
        isPasswordValueValid = checkPasswordValue();

    let isloginFormValid = isEmailIdValid &&
        isPasswordValueValid ;


    // submit to the server if the loginform is valid
    if (isloginFormValid) {
        const passwordvalue = passwordvalueEl.value.trim();
        const emailid = emailidEl.value.trim();

        var d = new Date,
        dformat = [d.getMonth()+1,
                d.getDate(),
                d.getFullYear()].join('/')+' '+
                [d.getHours(),
                d.getMinutes(),
                d.getSeconds()].join(':');

        const geturl = 'https://hdxgeoo21b.execute-api.ap-south-1.amazonaws.com/test/user/put'
        fetch(geturl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                //"name": removename,
                "emailid": emailid,
                "passwordvalue": passwordvalue,
                "lastlogin": dformat,
                "action": "login"
            })
        })
            .then(res => {
                return res.json()
            })
            .then(data => {
                console.log('success:', data);
                jsonData = JSON.stringify(data)
                
                Object.keys(data).forEach(function(key) {
                    var value = data[key];

                    if ( key == "body") {
            
                        if (value.includes("user exists")) {
                            console.log("value is", value);
                            document.location.href = "adminlogin.html";
                        }
                        else if (value.includes("Invalid User")) {
                            console.log("value is", value);
                            alert(value);
                        }
                        else {
                            console.log("Nothing matched");
                            document.location.href = "comingsoon.html";
                        }
                    }


                })
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }
});


const deebounce = (fn, delay = 500) => {
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

loginform.addEventListener('input', deebounce(function (e) {
    switch (e.target.id) {
        case 'emailid':
            checkEmailId();
            break;
        case 'passwordvalue':
            checkPasswordValue();
            break;
    }
}));
