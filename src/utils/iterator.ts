export const next_id = function *(){
    let current_id = 0;
    while (true) {
        current_id++;
        yield current_id;
    }
}
