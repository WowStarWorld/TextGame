include = (
    (url) => {
        let tag = document.createElement('script');
        tag.src = url;
        document.body.appendChild(tag);
    }
);


function inventory_add_item (item={"id":"text:air","nbt":{name:'空气'}},quan=1){
    if (database.hasItem('accounts') && database.hasItem('current_account')){
        if (database.getItem("accounts")[database.getItem('current_account')].hasOwnProperty('inventory')){
            let accounts = database.getItem("accounts");
            let current_account = database.getItem("current_account");
            let inventory = accounts[current_account]['inventory'];
            if (inventory.length+quan > 1024*128){
                return false;
            }
            for (let i = 0; i < quan; i++){
                inventory.push(item);
            }
            accounts[current_account]['inventory'] = inventory;
            database.setItem("accounts",accounts);
        }
        else {
            let accounts = database.getItem("accounts");
            let current_account = database.getItem("current_account");
            let inventory = [];
            for (let i = 0; i < quan; i++){
                inventory.push(item);
            }
            accounts[current_account]['inventory'] = inventory;
            database.setItem("accounts",accounts);
        }
    }
    return true;
}
function inventory_delete_item(id,nbt,quan){
    if (quan === undefined){
        quan = 1;
    }
    if (quan > 0){
        for (var i = 0; i < quan; i){
            if (database.hasItem("accounts") && database.hasItem("current_account")) {
                if (database.getItem("accounts").hasOwnProperty(database.getItem("current_account"))){
                    let accounts = database.getItem("accounts");
                    let _inventory = accounts[database.getItem("current_account")]["inventory"];
                    if (_inventory instanceof Object){
                        for (let _item in _inventory){
                            if (JSON.stringify(_inventory[_item]["nbt"]) === JSON.stringify(nbt) && _inventory[_item]["id"] === id){
                                _inventory.splice(_item,1);
                                break;
                            }
                        }
                        accounts[database.getItem("current_account")]["inventory"] = _inventory;
                        database.setItem("accounts",accounts);
                    }
                    i++;
                }
            }
        }
    }
}

function inventory_length_item(id,nbt){
    let length = 0;
    if (database.hasItem("accounts") && database.hasItem("current_account")) {
        if (database.getItem("accounts").hasOwnProperty(database.getItem("current_account"))){
            let accounts = database.getItem("accounts");
            let _inventory = accounts[database.getItem("current_account")]["inventory"];
            if (_inventory instanceof Object){
                for (let _item in _inventory){
                    if (JSON.stringify(_inventory[_item]["nbt"]) === JSON.stringify(nbt) && _inventory[_item]["id"] === id){
                        length++;
                    }
                }
            }
        }
    }
    return length;
}
randnum = function(start,end){ return Math.floor(Math.random() * (end - start + 1)) + start; }


!(function () {
    include("./javascripts/database.js");
    include("./javascripts/actions.js");
    include("./javascripts/context.js");
    include("./resources/crafting.js");
}());

delete_account = function(uuid){
    (function () {
        let tmp = database.getItem("accounts");
        delete tmp[uuid];
        database.setItem("accounts",tmp);
        database.deleteItem("current_account");
        window.location.hash = "#";
    }
    )();
};


rename = (function (_uuid){
    let modal = $("<div>").addClass("modal fade");
    let modalDialog = $("<div>").addClass("modal-dialog").attr("role", "document");
    let modalContent = $("<div>").addClass("modal-content");
    let modalHeader = $("<div>").addClass("modal-header");
    let modalTitle = $("<h5>").addClass("modal-title").html("<p style='color: #000;'>请输入角色名称<p>");
    let modalBody = $("<div>").addClass("modal-body");
    let modalFooter = $("<div>").addClass("modal-footer");
    let modalSubmit = $("<button>").addClass("btn btn-outline-dark").attr("type", "button").html("确定");
    let modalInput = $("<input>").addClass("form-control").attr("type", "text").attr("placeholder", _uuid);
    modalHeader.append(modalTitle);
    modalBody.append(modalInput);
    modalFooter.append(modalSubmit);
    modalContent.append(modalHeader).append(modalBody).append(modalFooter);
    modalDialog.append(modalContent);
    modal.append(modalDialog);
    $("body").append(modal);
    modal.modal("show");
    modalSubmit.click(function (){
        if (modalInput.val().replaceAll(" ","") !== ""){
            let accounts = database.getItem("accounts");
            account = accounts[_uuid];
            account["name"] = modalInput.val();
            accounts[_uuid] = account;
            database.setItem("accounts",accounts);
            modal.modal("hide");
        }else {
            cocoMessage.warning("请输入昵称",1000);
            $(".coco-msg-content").css("color","black");
        }
    });
});


uuid = (
    () => {
        let d = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
);

function select_account(){
    let modal = $("<div>").addClass("modal fade");
    let modal_dialog = $("<div>").addClass("modal-dialog");
    let modal_content = $("<div>").addClass("modal-content");
    let modal_header = $("<div>").addClass("modal-header");
    let modal_body = $("<div>").addClass("modal-body");
    let modal_footer = $("<div>").addClass("modal-footer");
    let modal_title = $("<h5>").addClass("modal-title").html("<p style='color: #000000;'>请选择账号<p>");
    let modal_ok_button = $("<button>").addClass("btn btn-outline-primary").attr("data-dismiss", "modal").html("确定");
    let accounts = database.getItem("accounts");
    let modal_body_ul = $("<ul>").addClass("list-group");
    let create_new_button = $("<button>").addClass("btn btn-outline-success").attr("data-dismiss", "modal").html("新建账号");
    let delete_selected_button = $("<button>").addClass("btn btn-outline-danger").attr("data-dismiss", "modal").html("删除账号");
    current_account = null;
    for(let i in accounts){
        let modal_body_li = $("<li>").addClass("list-group-item");
        let modal_body_li_a = $("<a>").addClass("text-dark").attr("onclick", "current_account = this.innerText.split(' ')[this.innerText.split(' ').length-1];").text(`${database.getItem('accounts')[i]['name']} - ${i}`);
        modal_body_li.append(modal_body_li_a);
        modal_body_ul.append(modal_body_li);
    }
    modal_header.append(modal_title);
    modal_body.append(modal_body_ul);
    modal_footer.append(create_new_button);
    modal_footer.append(delete_selected_button);
    modal_footer.append(modal_ok_button);
    modal_content.append(modal_header);
    modal_content.append(modal_body);
    modal_content.append(modal_footer);
    modal_dialog.append(modal_content);
    modal.append(modal_dialog);
    modal.modal("show");
    modal_ok_button.click(function () {
        if (current_account != null){
            modal.modal("hide");
            database.setItem("current_account",current_account);
            window.location.hash = "#";
        }
    });
    create_new_button.click(function () {
        _uuid = uuid();
        database.setItem("accounts",Object.assign(database.getItem("accounts"),{[_uuid]:{"name":_uuid}}));
        modal.modal("hide");
        select_account();
        setTimeout(function(){rename(_uuid)},1000);
        
    });
    delete_selected_button.click(function () {
        if (current_account != null){
            delete_account(current_account);
            modal.modal("hide");
            select_account();
        }
    });
}

window.onload = function () {
    onhashchange = function () { window.location.reload(); };
    database = new DataBase("gamedata");
    $("body").fadeIn(1000);
    
    let nav = $("<nav>").addClass("navbar navbar-expand-md bg-dark navbar-dark").html(
        `
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="collapsibleNavbar">
            <ul class="navbar-nav">
            <li class="nav-item active">
                <a class="nav-link" href="#">菜单</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#settings">设置</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#inventory">背包</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#crafting">合成</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#about">关于</a>
            </li>
            </ul>
        </div> 
        `
    );
    $("body").append(nav);
    let msg = $("<div>").addClass("container").attr("id","title-bar").html(`
        <br/>
        <h1 id="game-title"> 文字游戏 </h1>
        <p class="status-message"></p>
    `);
    $("body").append(msg);
    if (!database.hasItem("current_account")) {
        $(".status-message").html("欢迎来到文字游戏")
        let _uuid = uuid();
        if ((!database.hasItem("accounts")) || !(database.getItem("accounts") instanceof Object)) { 
            database.setItem("accounts",{});
        }
        if (database.accounts == {}){
            let usr = database.getItem("accounts");
            usr[_uuid] = {"name":_uuid};
            database.setItem("accounts",Object.assign(database.getItem("accounts"),usr));
            database.setItem("current_account",_uuid);
            rename(_uuid);
        }else {
            select_account();
        }
    }else {
        $(".status-message").html("欢迎回来，" + database.getItem("accounts")[database.getItem("current_account")]["name"]);
    }
    $("<div class=container id='title-bar'><br/><h1 id='game-title'> 文字游戏 </h1><p class='status-message'></p></div>")
    $("<div class='container' id='main'></div>").appendTo($("body"));
    switch (window.location.hash){
        case "#settings":
            $("#main").html(`
            <button class="btn btn-outline-primary" style="display: none;" onclick="void(window.location.hash='';)">返回</button>
            <hr/>
            <button onclick="void(rename(database.getItem('current_account')));" class="btn btn-outline-light">重命名</button>
            <button onclick="void(select_account());" class="btn btn-outline-light">选择账号</button>
            `);
            $(".status-message").html("设置页面");
            break;
        case "#mine":
            action_go_mine();
            break;
        case "#forage":
            action_go_forage();
            break;
        case "#inventory":
            action_show_inventory();
            break;
        case "#crafting":
            action_crafting();
            break;
        case "#about":
            $("#main").html(
                `
                <hr style="color: white;"/>
                <p>当前版本：1.0.0</p>
                `
            );
            $(".status-message").html("关于");
            break;
        case "":
            $("#main").html(
                `
                <hr style="color: white;"/>
                <button class="btn btn-outline-light" onclick="void(action_go_mine());">挖矿</button>
                <button class="btn btn-outline-light" onclick="void(action_go_forage());">砍树</button>
                `
            );
            
            break;
        default:
            $("#main").html(``);
            $(".status-message").html("页面未找到");
            break;
    }

};
