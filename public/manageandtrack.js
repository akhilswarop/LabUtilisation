// Define lab details and associated grid data
const labDetails = {
    lab1: { rows: 9, cols: 9 },
    lab2: { rows: 8, cols: 8 },
    lab3: { rows: 7, cols: 7 }
    // Add more labs as needed
};

// Function to generate grid for selected lab
function generateGrid(selectedLab) {
    const lab = labDetails[selectedLab];
    const rows = lab.rows;
    const cols = lab.cols;
    const elements = document.querySelectorAll(".grid");
    elements.forEach(element => {
        element.style.gridTemplateColumns = `repeat(${rows}, 1fr)`;
    });
    
    // Clear existing grid
    const seatGrid = document.getElementById("seatGrid");
    seatGrid.innerHTML = "";

    // Generate new grid for selected lab
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const seat = document.createElement("div");
            seat.classList.add("seat");
            seat.setAttribute("data-row", i + 1);
            seat.setAttribute("data-col", j + 1);
            seat.textContent = `${(i*cols) + j + 1}`; // Example: A1, A2, A3...
            seatGrid.appendChild(seat);
        }
    }
}

// Event listener for lab dropdown change
document.getElementById("labName").addEventListener("change", function() {
    const selectedLab = this.value;
    generateGrid(selectedLab);
});

// Toggle seat selection
seatGrid.addEventListener("click", function(event) {
    const seat = event.target;
    if (seat.classList.contains("seat") && !seat.classList.contains("booked")) {
        if (seat.classList.contains("selected")) {
            // If the seat is already selected, deselect it
            seat.classList.remove("selected");
        } else {
            // If the seat is not selected, select it
            seat.classList.add("selected");
        }
    }
});

// Initialize grid for default selected lab
generateGrid(document.getElementById("labName").value);
