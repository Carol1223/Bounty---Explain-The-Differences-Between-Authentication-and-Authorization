// Full Code Implementation

// Import necessary modules
const express = require('express');
const UserModel = require('./models/user'); // Make sure this path is correct
const app = express();
const port = 4001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication and authorization middleware
const authentication = (req, res, next) => {
    // Authentication logic here
    next();
};

const authorisation = ({ isAdmin }) => (req, res, next) => {
    // Authorization logic here, assuming user role checking
    next();
};

// Controller function to delete a user by username
const delete_user_by_username = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ ok: false, message: "Username is required" });
        }

        const result = await UserModel.destroy({
            where: { username }
        });

        if (result === 0) {
            return res.status(404).json({ ok: false, message: "User not found" });
        }

        return res.status(200).json({ ok: true, message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ ok: false, message: "Failed to delete user", error: error.message });
    }
};

// Route to handle user deletion by username
app.post(
    "/auth/delete/user",
    authentication,
    authorisation({ isAdmin: false }),
    (req, res) => delete_user_by_username(req, res)
);

// Serve a simple HTML form for user deletion
app.get('/profile', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User Profile</title>
    </head>
    <body>
        <h1>User Profile</h1>

        <!-- Form to delete a user by username -->
        <form id="delete-user-form">
            <label for="other-username">Enter Username to Delete:</label>
            <input type="text" id="other-username" name="other-username" required>
            <button type="submit">Delete User</button>
        </form>

        <script>
            document.getElementById("delete-user-form").addEventListener("submit", async (event) => {
                event.preventDefault();
                const username = document.getElementById("other-username").value;

                // Sending a POST request to delete the user by username
                const response = await fetch('/auth/delete/user', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username }),
                    credentials: "include"
                });

                const result = await response.json();

                // Handling the response
                if (result.ok) {
                    alert('User deleted successfully');
                } else {
                    alert(result.message);
                }
            });
        </script>
    </body>
    </html>
    `);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
