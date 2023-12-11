

import {db} from './firebaseConfig.js';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";



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
        else{ 
                const containerElem=document.createElement('article');
                const textElem3 = document.createElement('p');
                textElem3.innerText = `This movie exist already!`;
                containerElem.append(textElem3);
                moviesElem.append(containerElem);
                console.log('This movie exist already!');
        }
    }catch (error){
        console.log(`ERROR: ${error}`);
    }
}

postMoviesButton.addEventListener('click',async ()=> {
    console.log("Post Movies button clicked.");
    const movie= {
        title: document.querySelector('#titlePost').value,
        genre: document.querySelector('#genre').value,
        releaseDate: document.querySelector('#releaseDate').value,
       
    };
    await postMoviesToFirebase(movie);
    
});


async function getMovies(){
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

getMoviesButton.addEventListener('click', async ()=>{
    console.log("Get Movies button clicked.");
   
    const movies = await getMovies();
    displayMovies(movies);
})



function createMovieElement(movie)
{
    const containerElem=document.createElement('article');
    const headingElem = document.createElement('h3');
    const watched= movie.watched? 'watched' : 'Not watched';

    headingElem.addEventListener('click',async ()=>{
        const confirmed= confirm(`Have you seen the "${movie.title}" movie? Click:
        - OK for: Watched
        - Cancel for: Not Watched`);
        if (confirmed)
        {
            await haveWatched(movie.id, true);
            movie.watched= true;
        }
        else{
            await haveWatched(movie.id, false);
            movie.watched= false;
        }
    });

    headingElem.innerText = `Title: ${movie.title} - ${watched}`;

    const textElem1 = document.createElement('h4');
    const textElem2 = document.createElement('h4');
    const removeButton = document.createElement('button');
   
    

    headingElem.innerText=`Title: - ${movie.title} -`;
    textElem1.innerText = `Genre: - ${movie.genre } -`;
    textElem2.innerText = `ReleaseDate: - ${movie.releaseDate} -`;
    removeButton.innerText = 'Delete Movie';


    containerElem.append(headingElem);
    containerElem.append(textElem1);
    containerElem.append(textElem2);
    containerElem.append(removeButton);
    moviesElem.append(containerElem);
    containerElem.append(watched);


removeButton.addEventListener('click',()=> {
    const movieId= movie.id;
    deleteMovie(movieId);
    containerElem.remove();
 });
 
}


    function displayMovies(movies) {
        console.log("Displaying movies...");
        moviesElem.innerHTML = "";
       
            if (movies.length===0){
                const containerElem=document.createElement('article');
                const textElem3 = document.createElement('p');
                textElem3.innerText = `There is no movies in database`;
                containerElem.append(textElem3);
                moviesElem.append(containerElem);
            }
            else
            {   movies.forEach((movie)=>
                { createMovieElement(movie)
            });
    }
    }


    async function haveWatched(movieId,status)
    {
        try{
            const moviesRef = doc(collection(db, 'Movies'), movieId);
            await updateDoc(moviesRef, { watched: status });
         console.log("Watched status updated!");
        }catch (error) {
        console.error("Error updating watched status: ", error);
    }
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
/*gia to vg /////////////////////////////////////////////////////////////////////*/
const searchButton = document.querySelector('#searchButton');
const searchInput = document.querySelector('#searchTitle');

searchButton.addEventListener('click', async () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm !== '') {
        await searchMoviesByTitle(searchTerm);
    } else {
        console.log('Please enter a title to search.');
    }
});

async function searchMoviesByTitle(title) {
    try {
        const moviesRef = collection(db, 'Movies');
        const querySnapshot = await getDocs(moviesRef);

        const matchingMovies = [];
        querySnapshot.forEach((doc) => {
            const movieData = doc.data();
            if (movieData.title.toLowerCase().includes(title)) {
                matchingMovies.push({ id: doc.id, ...movieData });
            }
        });

        if (matchingMovies.length > 0) {
            displayMovies(matchingMovies);
        } else {
            const containerElem=document.createElement('article');
            const textElem3 = document.createElement('p');
            textElem3.innerText = `No movies found with that title.`;
            containerElem.append(textElem3);
            moviesElem.append(containerElem);
            console.log('No movies found with that title.');
        }
    } catch (error) {
        console.log(`Error searching for movies: ${error}`);
    }
}




