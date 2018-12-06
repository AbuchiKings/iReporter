
const modal = document.getElementById('editModal');
const btn = document.getElementById("modalBtn");
const span = document.getElementsByClassName("close")[0];

btn.addEventListener('click', () => {
    modal.style.display = "block";
})

span.addEventListener('click', () => {
    modal.style.display = "none";
})

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
