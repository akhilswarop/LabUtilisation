        // Generate seat grid
        const rows = 9; // Number of rows
        const cols = 9; // Number of columns
        const seatGrid = document.getElementById("seatGrid");

        for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        const seat = document.createElement("div");
        seat.classList.add("seat");
        seat.setAttribute("data-row", i + 1);
        seat.setAttribute("data-col", j + 1);
        seat.textContent = `${(i * cols) + j + 1}`; // Example: 1, 2, 3...
        seatGrid.appendChild(seat);
    }
}

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


        function completeBooking() {
            // Retrieve selected seats (assuming stored locally)
            const selectedSeats = document.querySelectorAll(".seat.booked");
    
            // Create an array to hold the booking data
            const bookingData = [];
            selectedSeats.forEach(seat => {
                const seatData = {
                    row: seat.dataset.row,
                    col: seat.dataset.col
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
            const seatElement = document.querySelector(`.seat[data-row="${seat.row}"][data-col="${seat.col}"]`);
            if (seatElement) {
                seatElement.classList.add('booked');
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
