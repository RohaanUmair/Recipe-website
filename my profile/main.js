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
    doc,
    storage,
    query,
    where,
    deleteDoc,
    signOut
} from "../utils/utils.js";


const profile_pic = document.getElementById('profile_pic');
const recipe_overview = document.querySelector('.recipe-overview');
const home_btn = document.getElementById('home_btn');
const menu = document.querySelector('.menu');
const menu_btn = document.getElementById('menu_btn');
const logout_btn = document.getElementById('logout_btn');


let y;
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        let x = `${await getProfilePic(uid)}`;
        profile_pic.src = x;
        console.log('logged in');
        y = user.email;
        getRecipes(y);
    } else {
        console.log('not logged in');
        window.location.pathname = 'login/index.html';
    }
});


home_btn.addEventListener('click', (() => {
    window.location.pathname = '../index.html';
}));


async function getRecipes(email) {
    
    let x = '';
    const q = query(collection(db, "Recipe"), where("userEmail", "==", `${email}`));
    
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        console.log(doc);
        
        x += `
    <div class="recipe-card" id="${doc.data().recipeId}">
        <img src="${doc.data().foodImage}">
        <div class="recipe-title">${doc.data().foodTitle}</div>
        <button class="remove_recipe_btn">Remove</button>
    </div>
        `
        console.log(doc.data().foodImage);
    });
    
    recipe_overview.innerHTML = x;

    removeRecipe();
}


async function removeRecipe() {
    const remove_recipe_btn = document.querySelectorAll('.remove_recipe_btn');

    remove_recipe_btn.forEach((btn) => {
        btn.addEventListener('click', async function () {

            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        await deleteDoc(doc(db, "Recipe", `${this.parentElement.id}`));
                        
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your Recipe has been deleted.",
                            icon: "success"
                        });
                        getRecipes(y);
                    }
                });
        });
    });

}


let isMenuOpen = false;
menu_btn.addEventListener('click', (() => {
    if (isMenuOpen){
        menu.style.display = 'none';
        isMenuOpen = false;
    } else {
        menu.style.display = 'flex';
        isMenuOpen = true;
    }
}));


menu.children[0].addEventListener('click', (() => {
    window.location.pathname = '../index.html'
}));

menu.children[2].addEventListener('click', (() => {
    window.location.pathname = '../my profile/index.html'
}));

menu.children[4].addEventListener('click', (() => {
    window.location.pathname = '../add recipe/index.html'
}));

menu.children[6].addEventListener('click', (() => {
    signOut(auth)
        .then(() => {
            console.log('Logged Out');
        })
        .catch((error) => {
        });
}));


logout_btn.addEventListener('click', (() => {
    signOut(auth)
        .then(() => {
            console.log('Logged Out');
        })
        .catch((error) => {
        });
}));


async function getProfilePic(uid) {
    const q = query(collection(db, "userInfo"), where("uid", "==", uid));

    let x;
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        x = doc.data().profilePic;
    });
    return x;
}