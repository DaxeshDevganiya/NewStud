const Refferal = require("../Models/Refferal");
const User = require("../Models/UserModel");
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    try {
        const token = req.header('Authorization');
        const decoded = jwt.verify(token, 'assignment');
        const sid = decoded.userId;

        // Find all referrals where refferalBy matches sid
        const referrals = await Refferal.find({ refferalBy: sid });

        // Check if there are any referrals
        if (referrals.length > 0) {
            const response = [];

            // Iterate over each referral
            for (let i = 0; i < referrals.length; i++) {
                const referral = referrals[i];

                // Fetch logged user details
                const loggedUser = await User.findOne({ _id: referral.refferalBy });

                // Fetch accepted user details
                const acceptedUser = await User.findOne({ _id: referral.acceptedBy });

                // Prepare response object
                response.push({
                    LoggedUser: loggedUser ? loggedUser.firstname + ' ' + loggedUser.lastname : "Unknown User",
                    AcceptedHistory: acceptedUser ? acceptedUser.firstname + ' ' + acceptedUser.lastname : "Unknown User"
                });
            }

            res.status(200).json({
                referrals: response,
                status: 200
            });
        } else {
            // No referrals found for the logged-in user
            res.status(404).json({ message: "No Referral History", status: 404 });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message, status: 500 });
    }
};
