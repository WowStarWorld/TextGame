function action_crafting(){
    $("#main").html('<hr/>');
    $(".status-message").html("合成台");
    let group = $("<div class='btn-group' role='group'>");
    for(__crafting in crafting) {
        let current = crafting[__crafting];
        let button = $("<button>").addClass("btn btn-outline-light");
        button.attr("onclick",`action_show_crafting(${__crafting})`);
        button.html(`${current["result"]["nbt"]["name"]}`);
        button.appendTo(group);
    }
    $("#main").append(group);
}
function action_show_crafting(craft_id){
    let inventory = database.getItem("accounts")[database.getItem("current_account")]["inventory"];
    let current_craft=crafting[craft_id];
    let current_recipe=current_craft["recipe"];
    let result=current_craft["result"];
    let can_craft=true;
    let item;
    for(__item in current_recipe){
        item=current_recipe[__item];
        if(inventory_length_item(item["id"],item["nbt"])>=item["count"]){continue;}
        else{can_craft=false;break;};
    }
    craft = function(){
        for(__item in current_recipe){
            item=current_recipe[__item];
            if(inventory_length_item(item["id"],item["nbt"])>=item["count"]){continue;}
            else{can_craft=false;break;};
        }
        if(can_craft){
            action_get_item("合成",result["id"],result["nbt"],result["count"],result["count"]);
            for(__item in current_recipe){
                item=current_recipe[__item];
                inventory_delete_item(item["id"],item["nbt"],item["count"]);
            }
        }
        else{
            action_get_item("合成",result["id"],result["nbt"],0,0);
        }
        return can_craft;
    }
    let modal = $("<div>").addClass("modal fade");
    let modal_dialog = $("<div>").addClass("modal-dialog");
    let modal_content = $("<div>").addClass("modal-content");
    let modal_header = $("<div>").addClass("modal-header");
    let modal_body = $("<div>").addClass("modal-body");
    let modal_footer = $("<div>").addClass("modal-footer");
    let cancel_button = $("<button>").addClass("btn btn-primary").html("取消");
    let modal_title;
    let range = $("<input>").addClass("form-control").attr("value","1");
    if (can_craft){
        range.appendTo(modal_body);
        $("<br/>").appendTo(modal_body);
    }
    let button;
    let body_content = $("<ul>").addClass("list-group");
    for(__item in current_recipe){
        item=current_recipe[__item];
        let li = $("<li>").addClass("list-group-item");
        li.append(`${item["nbt"]["name"]}`);
        li.append($("<span>").addClass("badge").css("color","#000000").html(`${item["count"]}`));
        li.appendTo(body_content);
    }
    if(can_craft){
        modal_title = $("<h5>").attr("id","adi-title").addClass("modal-title").html(`<p style='color: #000;'>确认合成 ${result["nbt"]["name"]} * ${result["count"]}?</p>`);
        button = $("<button>").addClass("btn btn-primary").html("确定");
        button.click(function(){
            try{
                let i = 0;
                while (i < parseInt(range.val())){
                    if (!craft()){
                        break;
                    }
                    i++;
                }
            }catch (e){
                cocoMessage.warn("合成失败",1000);
                $(".coco-msg-content").css("color","black");
            }
            modal.modal("hide");
            setTimeout(modal.remove,100);
        });
    }
    else {
        modal_title = $("<h5>").attr("id","adi-title").addClass("modal-title").html(`<p style='color: #000;'>材料不足!</p>`);
        button = $("<button>").addClass("btn btn-primary").css("display","none");
    }
    modal_title.appendTo(modal_header);
    modal_header.appendTo(modal_content);
    body_content.appendTo(modal_body)
    modal_body.appendTo(modal_content);
    cancel_button.appendTo(modal_footer);
    button.appendTo(modal_footer);
    modal_footer.appendTo(modal_content);
    modal_content.appendTo(modal_dialog);
    modal_dialog.appendTo(modal);
    modal.modal("show");
    cancel_button.click(function(){
        modal.modal("hide");
        modal.remove();
    })
}
function action_get_item (action,id,nbt,min=0,max=16) {
    let _rng = randnum(min,max);
    let status = inventory_add_item({"id":id,"nbt":nbt},_rng);
    if (status === true){
        if (_rng === 0) { cocoMessage.info(`${action}失败，未获得${nbt.name}`,1000); }
        else{ cocoMessage.info(`${action}成功，获得了` + _rng + String(nbt.name),1000); }
    }else {cocoMessage.info("背包满了",1000);}
    $(".coco-msg-content").css("color","black");
}
function action_go_forage(){
    if (window.location.hash !== "#forage") {
        window.location.hash = "#forage";
    }
    $("#main").html(
        `
            <button class="btn btn-outline-light" onclick="action_get_item('砍树','text:oak_log',{name:'橡木'},0,16*(inventory_length_item('text:wooden_axe',{'name': '木斧'})+1));">采集橡木</button>
        `
    );
}

function action_go_mine() {
    if (window.location.hash !== "#mine") {
        window.location.hash = "#mine";
    }
    $(".status-message").html("挖掘矿物")
    if (inventory_length_item("text:wooden_pickaxe",{"name": "木镐"})>0) {
        $("#main").html(
            `
            <button class="btn btn-outline-light" onclick="void(action_get_item('挖掘','text:cobblestone',{name:'圆石'},0,128))">挖掘圆石</button>
            <button class="btn btn-outline-light" onclick="void(action_get_item('挖掘','text:coal',{name:'煤炭'},0,64))">挖掘煤炭</button>
            `
        );
    }
    else {$("#main").html("<p>你需要木镐才能挖矿!</p>")}
}
function action_show_inventory(){
    if (window.location.hash !== "#inventory") {
        window.location.hash = "#inventory";
    }
    $(".status-message").html("背包");
    if (database.hasItem("accounts") && database.hasItem("current_account")) {
        if (database.getItem("accounts").hasOwnProperty(database.getItem("current_account"))){
            let _inventory = database.getItem("accounts")[database.getItem("current_account")]["inventory"];
            let inventory_quans = {};
            if (_inventory instanceof Array){
                for (let _item in _inventory){
                    if (inventory_quans.hasOwnProperty(_inventory[_item]["nbt"]['name'])){
                        if (JSON.stringify(inventory_quans[_inventory[_item]["nbt"]['name']]["nbt"]) != JSON.stringify(_inventory[_item]["nbt"])){
                            _uuid = uuid();
                            inventory_quans[`${_inventory[_item]["nbt"]['name']} <p style='display: none;'>${_uuid}</p>`] = {};
                            inventory_quans[`${_inventory[_item]["nbt"]['name']} <p style='display: none;'>${_uuid}</p>`]["quan"] = 1;
                            inventory_quans[`${_inventory[_item]["nbt"]['name']} <p style='display: none;'>${_uuid}</p>`]["name"] = _inventory[_item]["id"];
                            inventory_quans[`${_inventory[_item]["nbt"]['name']} <p style='display: none;'>${_uuid}</p>`]["nbt"] = _inventory[_item]["nbt"];
                            inventory_quans[`${_inventory[_item]["nbt"]['name']} <p style='display: none;'>${_uuid}</p>`]["uuid"] = _uuid;
                            
                        }else{
                            inventory_quans[_inventory[_item]["nbt"]['name']]["quan"] += 1;
                        }
                    }else{
                        inventory_quans[_inventory[_item]["nbt"]['name']] = {};
                        inventory_quans[_inventory[_item]["nbt"]['name']]["quan"] = 1;
                        inventory_quans[_inventory[_item]["nbt"]['name']]["name"] = _inventory[_item]["id"];
                        inventory_quans[_inventory[_item]["nbt"]['name']]["nbt"] = _inventory[_item]["nbt"];
                        inventory_quans[_inventory[_item]["nbt"]['name']]["uuid"] = uuid();
                    }
                }
                let table = $("<table>").addClass("table table-dark");
                let thead = $("<thead>").appendTo(table);
                let tr = $("<tr>").appendTo(thead);
                $("<th>").html("#").appendTo(tr);
                $("<th>").html("名称").appendTo(tr);
                $("<th>").html("数量").appendTo(tr);
                $("<th>").html("命名空间").appendTo(tr);
                $("<th>").html("排序标签").appendTo(tr);
                $("<th>").html("命名标签").appendTo(tr);
                $("<th>").html("操作").appendTo(tr);
                let tbody = $("<tbody>").appendTo(table);
                for (let _item in Object.keys(inventory_quans)){
                    let num = inventory_quans[Object.keys(inventory_quans)[_item]]["quan"];
                    let id = inventory_quans[Object.keys(inventory_quans)[_item]]["name"];
                    let name = Object.keys(inventory_quans)[_item];
                    let nbt = inventory_quans[Object.keys(inventory_quans)[_item]]["nbt"];
                    let tr = $("<tr>").appendTo(tbody);
                    let _uuid = inventory_quans[Object.keys(inventory_quans)[_item]]["uuid"];
                    $("<td>").html(Number(_item)+1).appendTo(tr);
                    $("<td>").html(name).appendTo(tr);
                    $("<td>").html(num).appendTo(tr);
                    $("<td>").html(id).appendTo(tr);
                    $("<td>").html(_uuid).appendTo(tr);
                    $("<td>").html(JSON.stringify(nbt)).appendTo(tr);
                    $("<td>").html(`<a class="text-light" onclick='void(action_delete_item(${JSON.stringify(id)},${JSON.stringify(nbt)},${num}));'>丢弃</a>`).appendTo(tr);
                }
                $("#main").html("<hr/>");
                table.appendTo("#main");
                $("<button>").addClass("btn btn-outline-light").html("清空背包").appendTo("#main").click(function(){
                    let accounts = database.getItem("accounts")
                    let inventory = [];
                    accounts[database.getItem("current_account")]["inventory"] = inventory;
                    database.setItem("accounts",accounts);
                    action_show_inventory();
                });
            }else {
                let accounts = database.getItem("accounts");
                accounts[database.getItem("current_account")]["inventory"] = [];
                database.setItem("accounts",accounts);
                action_show_inventory();
            }
        }
    }
}
function action_delete_item(_id,_nbt,_max=1) {
    let modal = $("<div>").addClass("modal fade");
    let modal_dialog = $("<div>").addClass("modal-dialog").appendTo(modal);
    let modal_content = $("<div>").addClass("modal-content").appendTo(modal_dialog);
    let modal_header = $("<div>").addClass("modal-header").appendTo(modal_content);
    let modal_title = $("<h5>").attr("id","adi-title").addClass("modal-title").html("<p style='color: #000;'>请输入丢弃物品数量</p>").appendTo(modal_header);
    let modal_body = $("<div>").addClass("modal-body").appendTo(modal_content);
    let modal_footer = $("<div>").addClass("modal-footer").appendTo(modal_content);
    let modal_button = $("<button>").addClass("btn btn-primary").html("确定").appendTo(modal_footer);
    let modal_input = $("<input>").addClass("form-range").attr("id","adi-input").attr("type","range").attr("min","0").attr("max",_max).attr("value","1").appendTo(modal_body);
    modal.appendTo("body");
    modal.modal("show");
    modal_input.on("change",function () {
        $("#adi-title").html(`<p style='color: #000;'>请输入丢弃物品数量：${modal_input.val()}</p>`);
    });
    modal_button.click(function () {
        inventory_delete_item(_id,_nbt,Number(modal_input.val()));
        modal.modal("hide");
        action_show_inventory();
    });
}
