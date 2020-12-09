import DbSingleton from "./db_context";

DbSingleton.dbCtx().sync({
    // alter: true
}).then(() => {
    console.log("entities sync finished");
    process.exit(0);
});
