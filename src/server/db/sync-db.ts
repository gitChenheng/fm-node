import {createDbContext} from "./db_context";

createDbContext().sync({
    // alter: true
}).then(() => {
    console.log("entities sync finished");
    process.exit(0);
});
