import models from '../models/customersModel.js';

export default {
    async customerRegistration(req, res) {
        try {
            const {firstName, lastName, phoneNumber, row, seat} = req.body;

            const customer = await models.registration({
                firstName,
                lastName,
                phoneNumber,
                row,
                seat
            })

            const customerProfile =await models.getCustomer(row, seat)
            res.json({
                message: 'Successfully registered',
                "Booking History":
                    customerProfile[0].first_name + ' ' +
                    customerProfile[0].last_name  +
                    ' ' + customerProfile[0].phone_number +
                    ' ' + customerProfile[0].row +
                    '/' + customerProfile[0].seat +
                    ' ' + customerProfile[0].booking_time,
            })
        }catch(err) {
            console.log(err);
            res.status(500).json({ message: err.message });
        }
    }
}