//on.. -> corresponds an event listener
document.addEventListener('DOMContentLoaded', function(e) {
    handleOnSearchSubmit()
})
// wait until content loads then fire off the function
function handleOnSearchSubmit() {
    const submitButton = document.getElementById('search-button')
    submitButton.addEventListener('click', function() {
        const inputValue = document.getElementById('search-input').value// find the search input
        console.log('@@input', inputValue)
    })
}
