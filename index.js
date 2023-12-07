

import {db} from './firebaseConfig.js';
import { getFirestore, collection, addDoc, getDocs,where,query, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";



const postMoviesButton= document.querySelector('#postMoviesButton');
const getMoviesButton=document.querySelector('#getMoviesButton');
const moviesElem=document.querySelector('#movies')

async function postMoviesToFirebase(movie)
{
    try{
        const moviesRef = collection(db, 'Movies');
        const moviesSnapshot = await getDocs(moviesRef);
        const movies = [];
        moviesSnapshot.forEach((doc)=>{
            movies.push(doc.data().title.toLowerCase());
        });
        
        const movieTitle= movie.title.toLowerCase();
        if(!movies.includes(movieTitle)){
            await addDoc(moviesRef,movie);
            console.log('Movie added successfully!');  
        }
       /**/ else{
            console.log('This movie exist already!');
        }
        
          
    }catch (error){
        console.log(`ERROR: ${error}`);
    }
}

/**/postMoviesButton.addEventListener('click',async ()=> {
    console.log("Post Movies button clicked.");
    const movie= {
        title: document.querySelector('#titlePost').value,
        genre: document.querySelector('#genre').value,
        releaseDate: document.querySelector('#releaseDate').value,
        watched: false 
    };
    await postMoviesToFirebase(movie);
    
});


/**/async function getMovies(){
    console.log("Fetching movies from Firestore...");
    try {    
        const moviesRef = collection(db, 'Movies');
        const querySnapshot = await getDocs(moviesRef);
        const movies = [];
            querySnapshot.forEach((doc)=>{
          
            movies.push({ id: doc.id, ...doc.data() });
        });
            return movies;
        }catch(error)
        {
            console.log( `ERROR: ${error}`);
        }
}

/**/getMoviesButton.addEventListener('click', async ()=>{
    console.log("Get Movies button clicked.");
   /* const title=document.querySelector('#title').value;*/
    const movies = await getMovies();
    displayMovies(movies);
})


function displayMovies(movies) {
    console.log("Displaying movies...");
    moviesElem.innerHTML = "";
    movies.forEach((movie)=>{
        const containerElem=document.createElement('article');
        const headingElem = document.createElement('h3');
        const textElem = document.createElement('p');
        const removeButton = document.createElement('button');
        const updateInput = document.createElement('input');
        const updateButton = document.createElement('button');

        headingElem.innerText=movie.title;
        textElem.innerText = `Genre: ${movie.genre}, Release Date: ${movie.releaseDate}`;

   

    containerElem.append(headingElem);
    containerElem.append(textElem);
    containerElem.append(removeButton);
    moviesElem.append(containerElem);
});
}




async function deleteMovie(id){
    
    try{
        const moviesRef = collection(db, 'Movies');
        await deleteDoc(doc(moviesRef,id));
        console.log("Movie deleted succesfully");
    } catch(error){
        console.error("Error deleting movie: ", error);
    }
}


 removeButton.addEventListener('click',()=> {
    const movieId= movie.id;
    deleteMovie(movieId);
    containerElem.remove();
 });

async function updateMovie(movieText, id)
{
    try{
        const moviesRef = collection(db, 'Movies');
        await updateDoc(moviesRef,{movie: movieText});
        console.log("Movie Updated!")
    }catch(error){
        console.error("Error updating movie: ", error);
    }
}

updateButton.addEventListener('click',()=>{
    const movieText=updateInput.value;
    const movieId= movie.id;
    updateMovie(movieText,movieId);
});