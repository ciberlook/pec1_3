const container = document.querySelector(".container");
const seats = document.querySelectorAll(".row .seat:not(.occupied)");
const count = document.getElementById("count");
const total = document.getElementById("total");
const movieSelect = document.getElementById("movie");
const currency = document.getElementById("currency-one");
let ticketPrice = getTicketPrice(movieSelect);
populateUI();
function setMovieData(movieIndex, moviePrice) {
    localStorage.setItem("selectedMovieIndex", movieIndex);
    localStorage.setItem("selectedMoviePrice", moviePrice);
}
function getTicketPrice(movieList) {
    const reg = new RegExp(/\(\d+\.?\d*/);
    const selectedMovie = movieList.options[movieList.selectedIndex].textContent;
    const price = +reg.exec(selectedMovie)[0].slice(1);
    return price;
}
function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll(".row .seat.selected");
    const seatsIndex = [
        ...selectedSeats
    ].map((seat)=>[
            ...seats
        ].indexOf(seat));
    localStorage.setItem("selectedSeats", JSON.stringify(seatsIndex));
    const selectedSeatsCount = selectedSeats.length;
    count.innerText = selectedSeatsCount;
    total.innerText = selectedSeatsCount * ticketPrice;
}
function updateList() {
    const myPromise = new Promise((res)=>{
        setTimeout(()=>{
            res(movieSelect);
        }, 500);
    });
    return myPromise;
}
container.addEventListener("click", (e)=>{
    if (e.target.classList.contains("seat") && !e.target.classList.contains("occupied")) {
        e.target.classList.toggle("selected");
        updateSelectedCount();
    }
});
function populateUI() {
    const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));
    if (selectedSeats !== null && selectedSeats.length > 0) seats.forEach((seat, index)=>{
        if (selectedSeats.indexOf(index) > -1) seat.classList.add("selected");
    });
    const selectedMovieIndex = localStorage.getItem("selectedMovieIndex");
    if (selectedMovieIndex !== null) movieSelect.selectedIndex = selectedMovieIndex;
    const selectedCurrencyIndex = localStorage.getItem("selectedCurrencyIndex");
    const selectedCurrency = localStorage.getItem("selectedCurrency");
    if (selectedCurrencyIndex !== null) {
        currency.selectedIndex = selectedCurrencyIndex;
        updateMoviesPrice(selectedCurrency);
        ticketPrice = getTicketPrice(movieSelect);
        updateSelectedCount();
        updateList().then((generatedList)=>{
            ticketPrice = getTicketPrice(generatedList);
            updateSelectedCount();
        });
    }
}
movieSelect.addEventListener("change", (e)=>{
    ticketPrice = getTicketPrice(e.target);
    setMovieData(e.target.selectedIndex, e.target.value);
    updateSelectedCount();
});
currency.addEventListener("change", (e)=>{
    const targetCurrency = e.target.value;
    localStorage.setItem("selectedCurrency", e.target.value);
    localStorage.setItem("selectedCurrencyIndex", e.target.selectedIndex);
    updateMoviesPrice(targetCurrency);
    updateList().then((generatedList)=>{
        ticketPrice = getTicketPrice(generatedList);
        updateSelectedCount();
    });
});
function updateMoviesPrice(newCurr) {
    Array.from(movieSelect.options).forEach((op)=>{
        fetch(`https://v6.exchangerate-api.com/v6/d7e5572616b37260972fdaca/pair/USD/${newCurr}/${op.value}`).then((res)=>{
            if (!res.ok) throw new Error("Error, Server response", {
                cause: response
            });
            else return res.json();
        }).then((data)=>{
            op.innerText = op.textContent.replace(/\d+\.?\d* [A-Z]{3}/, data.conversion_result + " " + data.target_code);
        }).catch((err)=>{
            console.log("Network connection error:" + err.message);
        });
    });
}
updateSelectedCount();

//# sourceMappingURL=index.579125c3.js.map
