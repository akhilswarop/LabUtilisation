// Define lab details and associated grid data
const labDetails = {
    lab1: { rows: 9, cols: 9 },
    lab2: { rows: 8, cols: 8 },
    lab3: { rows: 7, cols: 7 }
    // Add more labs as needed
};

let selectedLab = document.getElementById("labName").value;
let selectedSlotFrom = document.getElementById("fromSlot").value;
let selectedSlotTo = document.getElementById("toSlot").value;
let selectedDate = document.getElementById("bookingDate").value;
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
            seat.textContent = `${(i*cols)+j + 1}`; // Example: A1, A2, A3...
            seatGrid.appendChild(seat);
        }
    }
}

// Event listener for lab dropdown change
document.getElementById("labName").addEventListener("change", function() {
    const selectedLab = this.value;
    generateGrid(selectedLab);
});

// Function to handle resource allocation
function allocateResource() {
    const selectedSeats = document.querySelectorAll(".seat.selected");
    if (selectedSeats.length === 0) {
        alert("Please select at least one seat.");
        return;
    }

    // Example: You can implement further logic here to handle allocation
    // For now, just display the allocation in the list
    const allocationList = document.getElementById("allocationList");
    const allocationItem = document.createElement("div");
    allocationItem.textContent = "Booked Seats: " + Array.from(selectedSeats).map(seat => seat.textContent).join(", ");
    allocationList.appendChild(allocationItem);

    // Reset selected seats
    selectedSeats.forEach(seat => {
        seat.classList.remove("selected");
        seat.classList.add("booked");
    });
}

// Function to handle complete booking
function completeBooking() {

    // Retrieve selected seats (assuming stored locally)
    const selectedSeats = document.querySelectorAll(".seat.booked");

    // Retrieve selected lab, time from, and time to information
    const selectedDate = document.getElementById("bookingDate").value;
    const selectedLab = document.getElementById("labName").value;
    const selectedSlotFrom = document.getElementById("fromSlot").value;
    const selectedSlotTo = document.getElementById("toSlot").value;
    if (selectedLab == '' || selectedDate == '' || selectedSlotFrom == '' || selectedSlotTo == '') {
        alert("Please select lab, date, time slots before completing the booking.");
        return;
    }
    // Create an array to hold the booking data
    const bookingData = [];
    selectedSeats.forEach(seat => {
        const seatData = {
            row: seat.dataset.row,
            col: seat.dataset.col,
            lab: selectedLab,
            slotFrom: selectedSlotFrom,
            slotTo: selectedSlotTo,
            date: selectedDate
        };
        bookingData.push(seatData);
        console.log(bookingData);
    });

    // Send booking data to the server
    fetch('/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
    })
    .then(response => {
        if (response.ok) {
            console.log('Booking completed successfully');
            // Optionally, clear selected seats locally or show a confirmation message
        } else {
            console.error('Failed to complete booking');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to fetch and display booked seats
async function fetchAndDisplayBookedSeats() {
    try {
        const response = await fetch('/bookings');
        const bookedSeats = await response.json();
        // Iterate through bookedSeats and mark the corresponding seats on the interface
        bookedSeats.forEach(seat => {
            const lab = seat.lab;
            const slotFrom = parseInt(seat.slotFrom);
            const slotTo = parseInt(seat.slotTo);
            const date = seat.date;
            const labSelector = `.seat[data-row="${seat.row}"][data-col="${seat.col}"]`;

            // Check if the booked seat belongs to the selected lab and time slot range
            if (
                lab === selectedLab &&
                (
                    (selectedSlotFrom >= slotFrom && selectedSlotFrom <= slotTo) ||  // Check if selected from time is within booked slot
                    (selectedSlotTo >= slotFrom && selectedSlotTo <= slotTo) ||      // Check if selected to time is within booked slot
                    (selectedSlotFrom <= slotFrom && selectedSlotTo >= slotTo)       // Check if selected slot fully contains booked slot
                )
                &&
                date === selectedDate
            ) {
                const seatElement = document.querySelector(labSelector);
                if (seatElement) {
                    seatElement.classList.add('booked');
                }
            } else {
                // If the seat is not in the booked slot, remove the 'booked' class
                const seatElement = document.querySelector(labSelector);
                if (seatElement && seatElement.classList.contains('booked')) {
                    seatElement.classList.remove('booked');
                }
            }
        });
    } catch (error) {
        console.error('Error fetching booked seats:', error);
    }
}


// Call fetchAndDisplayBookedSeats when the page loads
window.addEventListener('load', fetchAndDisplayBookedSeats);

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
document.getElementById("labName").addEventListener("change", function() {
    selectedLab = this.value; // Update selectedLab when the dropdown changes
    fetchAndDisplayBookedSeats(); // Call fetchAndDisplayBookedSeats to update the booked seats display
});
document.getElementById("fromSlot").addEventListener("change", function() {
    selectedSlotFrom = this.value; // Update selectedLab when the dropdown changes
    fetchAndDisplayBookedSeats(); // Call fetchAndDisplayBookedSeats to update the booked seats display
});
document.getElementById("toSlot").addEventListener("change", function() {
    selectedSlotTo = this.value; // Update selectedLab when the dropdown changes
    fetchAndDisplayBookedSeats(); // Call fetchAndDisplayBookedSeats to update the booked seats display
});
document.getElementById("bookingDate").addEventListener("change", function() {
    selectedDate = this.value; // Update selectedLab when the dropdown changes
    fetchAndDisplayBookedSeats(); // Call fetchAndDisplayBookedSeats to update the booked seats display
});
// Initialize grid for default selected lab
generateGrid(document.getElementById("labName").value);
