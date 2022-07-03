class DataBase {
    constructor(name="anonymous"){
        this.name = name;
        if (localStorage.getItem(this.name) == undefined){
            localStorage.setItem(this.name, JSON.stringify({}));
        }
    }
    setName(name){
        this.name = name;
    }
    getName(){
        return this.name;
    }
    getItem(key){
        return JSON.parse(localStorage.getItem(this.getName()))[key];
    }
    setItem(key, value){
        let data = JSON.parse(localStorage.getItem(this.getName()));
        data[key] = value;
        localStorage.setItem(this.getName(), JSON.stringify(data));
    }
    deleteItem(key){
        let data = JSON.parse(localStorage.getItem(this.getName()));
        delete data[key];
        localStorage.setItem(this.getName(), JSON.stringify(data));
    }
    deleteThis(){
        localStorage.removeItem(this.getName());
        this.name = "anonymous";
    }
    getAll(){
        return JSON.parse(localStorage.getItem(this.getName()));
    }
    setAll(data){
        localStorage.setItem(this.getName(), JSON.stringify(data));
    }
    hasItem(key){
        let data = JSON.parse(localStorage.getItem(this.getName()));
        return data.hasOwnProperty(key);
    }
}