import {
    auth,
    getFirestore,
    initializeApp,
    getAuth,
    createUserWithEmailAndPassword,
    collection,
    addDoc,
    getDocs,
    app,
    db,
    updateDoc,
    getStorage,
    ref,
    storage,
    uploadBytes,
    getDownloadURL,
    storageRef,
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    query,
    where
} from '../utils/utils.js';


const add_recipe_form = document.getElementById('add_recipe_form');
const recipe_img = document.getElementById('recipe_img');
const recipe_title = document.getElementById('recipe_title');
const recipe_ingredients = document.getElementById('recipe_ingredients');
const recipe_procedure = document.getElementById('recipe_procedure');
const add_recipe_btn = document.getElementById('add_recipe_btn');
const profile_pic = document.getElementById('profile_pic');
const home_btn = document.getElementById('home_btn');



onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log('logged in');
        let y = `${await getProfilePic(uid)}`;
        console.log(y);
        profile_pic.src = y;

    } else {
        console.log('not logged in');
        window.location.pathname = 'login/index.html';
    }
});


home_btn.addEventListener('click', (() => {
    window.location.pathname = './index.html'
}));


add_recipe_form.addEventListener('submit', async function (e) {
    e.preventDefault();
    add_recipe_btn.innerText = 'Uploading... Please wait!';
    add_recipe_btn.style.backgroundColor = 'hsla(39, 100%, 40%, 0.863)';
    add_recipe_btn.disabled = true;
    
    const recipeRef = ref(storage, recipe_title.value);

    uploadBytes(recipeRef, recipe_img.files[0])
        .then((snapshot) => {
            console.log('Uploaded Recipe image');

            getDownloadURL(recipeRef)
                .then((url) => {
                    console.log('URL => ', url);

                    onAuthStateChanged(auth, async (user) => {
                        if (user) {
                            let username = await getUsername(user.uid);
                            let currentUserEmail = user.email;
                            saveRecipe(url, recipe_title.value, recipe_ingredients.value, recipe_procedure.value, username, currentUserEmail);
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Your Recipe has been uploaded",
                                showConfirmButton: false,
                                timer: 1500
                            });

                            setTimeout(() => {
                                window.location.pathname = '../index.html'
                            }, 1500);
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!",
                    });

                    add_recipe_btn.innerText = 'Upload Recipe';
                    add_recipe_btn.style.backgroundColor = 'hsl(211, 100%, 50%)';
                    add_recipe_btn.disabled = false;
                });
        })
        .catch((err) => {
            alert(err);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            });

            add_recipe_btn.innerText = 'Upload Recipe';
            add_recipe_btn.style.backgroundColor = 'hsl(211, 100%, 50%)';
            add_recipe_btn.disabled = false;
        });

});


async function saveRecipe(image, title, ingredients, procedure, username, userEmail) {
    try {
        const docRef = await addDoc(collection(db, "Recipe"), {
            foodImage: image,
            foodTitle: title,
            foodIngredients: ingredients,
            foodProcedure: procedure,
            recipeByUsername: username,
            userEmail: userEmail,
        });
        await updateDoc(docRef, { recipeId: docRef.id });
        
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}






async function getUsername(uid) {
    const q = query(collection(db, "userInfo"), where("uid", "==", uid));

    let x;
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        x = doc.data().username;
    });
    return x;
}


async function getProfilePic(uid) {
    const q = query(collection(db, "userInfo"), where("uid", "==", uid));

    let x;
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        x = doc.data().profilePic;
    });
    return x;
}


profile_pic.addEventListener('click', (() => {
    window.location.pathname = '/my profile/index.html';
}));