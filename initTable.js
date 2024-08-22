import db from './clients/db.mysql.js';

async function main() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS customers
        (
                id bigint not null auto_increment,
                first_name varchar(100) not null,
                last_name varchar(100) not null,
                phone_number varchar(30) not null,
                \`row\` varchar(2) not null,
                seat varchar(2) not null,
                booking_time DATETIME NOT NULL DEFAULT NOW(),
                primary key (id)
        )   
    `);
    console.log('Database is changed.')
}

main().catch(console.error);
