    // Registration
    const enrollmentForm = document.getElementById('enrollment-form');
    const invalidForm = document.getElementById('invalid');
    
    if(enrollmentForm) {
        enrollmentForm.onsubmit = ($event) => {
            $event.preventDefault();

            const firstName = document.getElementById('student-fname').value;
            const lastName = document.getElementById('student-lname').value;
            const email = document.getElementById('student-email').value;
            const password = document.getElementById('student-password').value;

            const enrolStudent = {
                firstName,
                lastName,
                email,
                password
            };
            console.log("Student Details", enrolStudent);

            // Make API Call
            fetch('http://localhost:4000/studentRegistration', {
                    method: 'POST',
                    body: JSON.stringify(enrolStudent),
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8"
                    },
                }).then(response => response.json())
                .then(data => {
                    if(data.status != 200){
                        console.log('Data Insertion Not Success:', data);
                        console.log('Data Insertion Not Success:', invalidForm.innerHTML = data.details.body[0].message);
                        invalidForm.innerHTML = data.details.body[0].message;
                    } else {
                        console.log('Success:', data);
                    }
                    
                })
                .catch((err) => {
                    console.error("Failed Operation ", err);
                })
        }
    }

    // Login Functionality
    const loginForm = document.getElementById('login-form');

    if(loginForm) {
        loginForm.onsubmit = ($event) => {
            $event.preventDefault();
    
            const email = document.getElementById('student-email').value;
            const password = document.getElementById('student-password').value;
            const _data = {
                email,
                password
            }
    
            fetch('http://localhost:4000/studentLogin', {
                    method: "POST",
                    body: JSON.stringify(_data),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Data from Auth :', data);
                    if(data.status != 200){
                        console.log('Invalid Credentials', data);
                    } else {
                        console.log('Success:', data);
                        window.location.href = '/getStudentsList';
                    }
                })
                .catch(err => console.log(JSON.stringify(err)));
        }
    }

    