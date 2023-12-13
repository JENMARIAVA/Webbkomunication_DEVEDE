//denna module fokuserar med att hämta , visa, och hantera filmer från firestore database
// dessutom här finns function med alla movie elementer som  är skapade med javascript (append method),
// och functionen som söker filmer med specifik titel i databasen.

import { db } from './firebaseConfig.js';
import { collection, getDocs, doc, updateDoc,deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";



const getMoviesButton=document.querySelector('#getMoviesButton');
const moviesElem=document.querySelector('#movies')

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
});

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
        {  
             movies.forEach((movie)=>{createMovieElement(movie)});
        }
}

function createMovieElement(movie)
{
    const containerElem=document.createElement('article');
    const textElem1 = document.createElement('h4');
    const textElem2 = document.createElement('h4');
    const removeButton = document.createElement('button');
    const headingElem = document.createElement('h3');
    const watched= movie.watched? '_status_:watched' : '_status_:Not watched';

    headingElem.addEventListener('click',async ()=>{
        const confirmed= confirm(`Have you seen the "${movie.title}" movie? Click:
        - OK for: Watched
        - Cancel for: Not Watched`);
        if (confirmed){
            await haveWatched(movie.id, true);
            movie.watched= true;
        }
        else{
            await haveWatched(movie.id, false);
            movie.watched= false;
        }
    });

    headingElem.innerText = `Title: ${movie.title} - ${watched}`;
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

async function deleteMovie(movieId){
    try {
        const moviesRef = collection(db, 'Movies');
        await deleteDoc(doc(moviesRef,movieId));
        console.log("Movie deleted succesfully");
        } 
        catch(error){
            console.error("Error deleting movie: ", error);
        }
}

async function haveWatched(movieId,status){
    try {
        const moviesRef = doc(collection(db, 'Movies'), movieId);
        await updateDoc(moviesRef, { watched: status });
        console.log("Watched status updated!");
        }
        catch (error) {
        console.error("Error updating watched status: ", error);
        }
}


const searchButton = document.querySelector('#searchButton');
const searchInput = document.querySelector('#searchTitle');

searchButton.addEventListener('click', async () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm !== '') {
        await searchMoviesByTitle(searchTerm);
    } 
    else {
        const containerElem=document.createElement('article');
        const textElem3 = document.createElement('p');
        textElem3.innerText = `Please enter a title to search`;
        containerElem.append(textElem3);
        moviesElem.append(containerElem);
        console.log('Please enter a title to search.');
    }});

async function searchMoviesByTitle(title) {
    try {
        const moviesRef = collection(db, 'Movies');
        const querySnapshot = await getDocs(moviesRef);
        const matchingMovies = [];

        querySnapshot.forEach((doc) => {
            const movieData = doc.data();
            if (movieData.title.toLowerCase().includes(title)) {
                matchingMovies.push({ id: doc.id, ...movieData });
            }});

            if (matchingMovies.length > 0) {
                displayMovies(matchingMovies);
            } 
            else {
                const containerElem=document.createElement('article');
                const textElem3 = document.createElement('p');
                textElem3.innerText = `No movies found with that title.`;
                containerElem.append(textElem3);
                moviesElem.append(containerElem);
                console.log('No movies found with that title.');
            }
        } 
        catch (error) {
        console.log(`Error searching for movies: ${error}`);
        }
}

export{ getMoviesButton, getMovies, moviesElem, displayMovies,
        createMovieElement, haveWatched, searchMoviesByTitle,
        searchButton, searchInput};