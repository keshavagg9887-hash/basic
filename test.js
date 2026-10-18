
const { pool } = require("./connection");

async function testDatabase() {
    try {
        // 1. Check which database and schema Node.js is using
        const dbInfo = await pool.query(`
            SELECT
                current_database() AS database_name,
                current_schema() AS schema_name,
                current_user AS username
        `);

        console.log("\n--- DATABASE CONNECTION ---");
        console.log(dbInfo.rows[0]);

        // 2. Check where the users table actually exists
        const tables = await pool.query(`
            SELECT table_schema, table_name
            FROM information_schema.tables
            WHERE table_name = 'users'
        `);

        console.log("\n--- USERS TABLE LOCATION ---");

        if (tables.rows.length === 0) {
            console.log("No users table found in this database.");
        } else {
            console.table(tables.rows);
        }

        // 3. Try querying the table directly
        console.log("\n--- TESTING USERS QUERY ---");

        try {
            const result = await pool.query(
                "SELECT * FROM users LIMIT 5"
            );

            console.log("Query successful!");
            console.table(result.rows);
        } catch (error) {
            console.error("Query failed:", error.message);
            console.error("PostgreSQL error code:", error.code);
        }
    } catch (error) {
        console.error("Database test failed:", error.message);
    } finally {
        await pool.end();
    }
}

testDatabase();
