// Registration
const enrollmentForm = document.getElementById('enrollment-form');
const invalidForm = document.getElementById('invalid');

if (enrollmentForm) {
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
        fetch(`${host}/studentRegistration`, {
            method: 'POST',
            body: JSON.stringify(enrolStudent),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
        }).then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    window.location.href = '/login';
                    console.log('Success:', data);
                } else if (data.statusCode === 400) {
                    console.log('Data Insertion Not Success:', data);
                    console.log('Data Insertion Not Success:', data.details.body[0].message);
                    invalidForm.innerHTML = data.details.body[0].message;
                } else {
                    invalidForm.innerHTML = data.message;
                }

            })
            .catch((err) => {
                console.error("Failed Operation ", err);
            })
    }
}

// Login Functionality
const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.onsubmit = ($event) => {
        $event.preventDefault();

        const email = document.getElementById('student-email').value;
        const password = document.getElementById('student-password').value;
        const _data = {
            email,
            password
        }

        fetch(`${host}/studentLogin`, {
            method: "POST",
            body: JSON.stringify(_data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log('Data from Auth :', data);
                if (data.status != 200) {
                    console.log('Invalid Credentials', data);
                } else {
                    console.log('Success:', data);
                    window.location.href = '/getStudentsList';
                }
            })
            .catch(err => console.log(JSON.stringify(err)));
    }
}

/** Payment gateway */
const host = 'http://localhost:4000';
const userDetails = {
    _id: '641fb9268ded19dab3c6323a',
    name: 'Srihari Balgam',
    email: 'eruditeskids.in@gmail.com',
    contact: '9030996600'
}


/** ---Start  ----Payment Related functionality */
async function buyCourse(courseId) {
    // const course = await getSelectedPackage(courseId);

    // initiate Order with Payment Gateway
    // await initiateOrder(course);
    await initiateOrder(courseId);
}

// make payments
function initiateOrder(course) {
    
    const paymentURL = `${host}/initiateOrder`;
    // const receiptNumber = `#Receipt_${Math.ceil(Math.random() * 1000)}`;

    // Get OrderID with by Details to Server 
    const order_options = {
        // amount: course.offer_price,
        // receipt: receiptNumber,
        // user: userDetails
        course_id: course
    };

    // make Service Request for Payment
    fetch(paymentURL, {
        method: "POST",
        body: JSON.stringify(order_options),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            "x_user_data": userDetails._id
        }
    })
    .then(response => response.json())
    .then(orderDetails => {
        console.log('orderDetails', orderDetails.order);
        if (orderDetails.order?.order_id && orderDetails.order?.status === 'created') {
            initiateCheckout(orderDetails);
        }
    })
    .catch(err => console.log(JSON.stringify(err)));
}

// Prepare payment and checkout with rzp
function initiateCheckout(orderDetails) {
    console.log('Order Details initiateCheckout: ', orderDetails, orderDetails.key);
    // Get Payment Types
    const paymentTypes = getPaymentTypes();

    const order = orderDetails.order;

    // Prepare checkout options
    const checkoutOptions = {
        key: orderDetails.key,
        amount: order.amount,
        currency: "INR",
        name: "EruditeKids English Mastery",
        description: orderDetails.course_name,
        image: "https://s3.amazonaws.com/rzp-mobile/images/rzp.png",
        prefill: {
            email: userDetails.email,
            contact: userDetails.contact
        },
        order_id: order.order_id,
        config: paymentTypes,
        handler: (response) => {            
            console.log('Successful Payment Response:IN_HANDLER:', response);
            // Save Payment Details in Database
            savePaymentDetails(response, 'SUCCESS');
        },
        modal: {
            ondismiss: () => {
                if (confirm('Are you sure, you want to cancel the payment?')) {
                    console.log('Payment cancelled by the user');
                } else {
                    console.log('Payment cancelled')
                }
            }
        }
    };

    if (order.order_id) {
        console.log('Initiating Checkout with RZP', order);
        // Create Connection with Razorpay
        let razorPay = new Razorpay(checkoutOptions);
        // Open Payment Modal
        razorPay.open();

        // Payment Failed Details 
        razorPay.on('payment.failed', (response) => {
            const failedDetails =  {
                code: response.error.code,
                description: response.error.description,
                metadata: response.error.metadata,
                reason: response.error.reason,
                source: response.error.source,
                step: response.error.step
            }
            console.log('Payment Failed::', failedDetails);
            savePaymentDetails(failedDetails, 'FAILED');
        });

        razorPay.on('payment.captured', (response) => {
            console.log('Payment Captured::', response);
            savePaymentDetails(response);
        });
    }
}

// Payment types Configuration
function getPaymentTypes() {
    const paymentTypesConfig = {
        display: {
            blocks: {
                banks: {
                    name: 'All payment methods',
                    instruments: [{
                        method: 'upi',
                        apps: ['google_pay', 'bhim', 'paytm', 'phonepe', 'amazon'],
                        flows: ['qr', 'collect', 'intent']
                    }, {
                        method: 'card',
                        networks: ['MasterCard', 'Visa'],
                        types: ['debit', 'credit']
                    }, {
                        method: 'wallet',
                        wallets: ['amazonpay', 'phonepe', 'airtelmoney', 'freecharge']
                    }, {
                        method: 'netbanking'
                    }, {
                        method: 'emi'
                    }]
                }
            },
            sequence: ['block.banks'],
            preferences: {
                show_default_blocks: false,
            }
        }
    };
    return paymentTypesConfig;
}

// Save Details in Database on Successful Payment
function savePaymentDetails(response, responseType) {
    const savePaymentURL = `${host}/savePayment`;

    const paymentInfo = { ...response, status: responseType };
    console.log('savePaymentDetails: ', paymentInfo);

    fetch(savePaymentURL, {
        method: "POST",
        body: JSON.stringify(paymentInfo),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Access-Control-Allow-Origin": "*"
        }
    })
    .then(response => response.json())
    .then(orderDetails => {
        console.log('SavedOrderDetails::', orderDetails);
    })
    .catch(err => console.log('Error Saving Payment info: ', JSON.stringify(err)));
}
/** ---END ----Payment Related functionality */


/** --START --- Packages Related functionality */
// Get Packages
async function getPackages() {
    return new Promise((resolve, reject) => {
        const packagesURL = `${host}/list-packages`;
        fetch(packagesURL)
            .then(data => data.json())
            .then(data => {
                return resolve(data.message);
            }).catch((err) => {
                console.log(`Error: ${err}`)
            });
    });
}

async function getSelectedPackage(pkgId) {
    return new Promise((resolve, reject) => {
        const packagesURL = `${host}/get-package`;
        fetch(packagesURL + '?' + new URLSearchParams({ id: pkgId }))
            .then(data => data.json())
            .then(data => {
                return resolve(data.message[0]);
            }).catch((err) => {
                console.log(`Error: ${err}`)
            });
    });
}

/** ---END ----Packages Related functionality */
