import db from '../clients/db.mysql.js'

export default {
    async getCustomer(row,seat) {
        const [existingCustomers] = await db.query(
            'SELECT * FROM customers WHERE `row` = ? AND seat = ? LIMIT 1',
            [row, seat]
        );

        if (existingCustomers.length > 0) {
            return existingCustomers
        }
            return false
    },

    async registration({firstName, lastName, phoneNumber, row, seat}) {
        if (await this.getCustomer(row, seat)) {
            throw new Error('The seat is already taken');
        }

        const [raws] = await db.query(
            'INSERT INTO customers (first_name, last_name, phone_number,  \`row\`, seat) VALUES (?,?,?,?,?)',
            [firstName, lastName, phoneNumber, row, seat]
        );

        return {raws}
    }
}