import {
    firebaseConfig,
    initializeApp,
    getFirestore,
    onAuthStateChanged,
    getAuth,
    createUserWithEmailAndPassword,
    collection,
    addDoc,
    getDocs,
    app,
    auth,
    db,
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    storageRef,
    storage
} from "/utils/utils.js";


const signup_email = document.getElementById('signup_email');
const signup_password = document.getElementById('signup_password');
const user_img = document.getElementById('user_img');
const signup_username = document.getElementById('signup_username');
const signup_btn = document.getElementById('signup_btn');




onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
    } else {
        console.log('not logged in');
    }
});



signup_btn.addEventListener('click', (e) => {
    e.preventDefault();

    if (!user_img.files[0]) {
        Swal.fire("Please ulpoad your profile picture");
    } else if (!signup_username.value) {
        Swal.fire("Please Enter your Username");
    } else {
        createUserWithEmailAndPassword(auth, signup_email.value, signup_password.value)
            .then((userCredential) => {
                console.log('Account created');
                console.log(user_img.files[0]);
                signup_btn.disabled = true;
                signup_btn.innerText = "Creating Account...";

                const user = userCredential.user;
                const userRef = ref(storage, `user/${user.uid}`)

                uploadBytes(userRef, user_img.files[0])
                    .then((snapshot) => {
                        console.log('Uploaded a blob or file!');

                        getDownloadURL(userRef)
                            .then((url) => {
                                console.log('URL => ', url);
                                onAuthStateChanged(auth, (user) => {
                                    if (user) {
                                        const uid = user.uid;
                                        saveUserInfo(signup_email.value, url, signup_username.value, uid);
                                    }
                                });
                                const user = userCredential.user;
                            })
                            .catch((err) => {
                                console.log(err);
                                signup_btn.disabled = false;
                                signup_btn.innerText = "Create Account";
                            });
                    })
                    .catch((err) => {
                        alert(err);
                        signup_btn.disabled = false;
                        signup_btn.innerText = "Create Account";
                    });


            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                signup_btn.disabled = false;
                signup_btn.innerText = "Create Account";

                if (!signup_email.value) {
                    Swal.fire("Please enter an Email!");
                } else if (signup_password.value.length < 6) {
                    Swal.fire("Password too short!");
                } else if (errorMessage == 'Firebase: Error (auth/email-already-in-use).') {
                    Swal.fire("Email already in use!");
                }
            });
    }
});

async function saveUserInfo(email, profilePic, username, uid) {
    try {
        const docRef = await addDoc(collection(db, "userInfo"), {
            email: email,
            profilePic: profilePic,
            username: username,
            uid: uid
        });
        console.log("Document written with ID: ", docRef.id);
        window.location.pathname = '../index.html';
    } catch (e) {
        console.error("Error adding document: ", e);
        signup_btn.disabled = false;
        signup_btn.innerText = "Create Account";
    }
}