const Assignment = require("../Models/AssignmentModel");
const AssignAssignments = require("../Models/AssignAssignments");
const User = require("../Models/UserModel");
const multer = require('multer');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const Stripe = require('stripe');
const stripe = new Stripe('sk_test_51OyfljGQ4hnFke5n7hOj6jngpiK4Vs0SsjYxwwnisDBn0Co8qnBJwx4I2rz90cD4P70H3YN5lGdxwp2LxiXX65lu00vDXvCmam');

module.exports = async (req, res) => {
  try {
    // const { clientSecret, assignmentId } = req.body;
    var assignmentId=req.params.id;
    var clientSecret=req.query.payment_intent_client_secret;
    console.log(req.params,req.query);
    console.log("Request body:", req.body);

    if (!clientSecret || !assignmentId) {
      return res.status(400).send({ success: false, error: 'Missing clientSecret or assignmentId' });
    }

    console.log("get id for payment: " + assignmentId);
    console.log("get clientSecret: " + clientSecret);

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(clientSecret.split('_secret')[0]);

    if (paymentIntent.status === 'succeeded') {
      // Find the assignment by ID
      const assignment = await AssignAssignments.findOne({ _id: assignmentId });

      if (!assignment) {
        return res.status(404).send({ success: false, error: 'Assignment not found' });
      }

      // Update the assignment status to isPaid: "true"
      assignment.isPaid = "true";
      await assignment.save();
      res.redirect("http://192.168.68.78:3006/viewassignments")
    //   res.status(200).send({ success: true, message: 'Status updated successfully' });
    } else {
      res.status(400).send({ success: false, error: 'Payment not successful' });
    }
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).send({ success: false, error: 'Failed to update status' });
  }
};