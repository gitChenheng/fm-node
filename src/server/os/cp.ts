import cp from "child_process";
import path from "path";


// https://example.com/downloads?file=user1.txt;
// https://example.com/downloads?file=%3Bcat%20/etc/passwd




// const param = "inet";
// cp.exec(`ifconfig | grep ${param};`, (e, stdout) => {
//     if (e)
//         console.log("err", e);
//     console.log(stdout);
// });




const source = path.join(__dirname, "/osInject.sh");
const param = "inet"
cp.execFile(source, [param], (e, stdout, stderr) => {
    if (e)
        console.log("e", e)
    console.log(stdout)
    console.log(stderr)
})

