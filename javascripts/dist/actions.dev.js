"use strict";

function action_crafting() {
  $("#main").html('');
  $(".status-message").html("合成台");
  var group = $("<div class='btn-group' role='group'>");

  for (__crafting in crafting) {
    var current = crafting[__crafting];
    var button = $("<button>").addClass("btn btn-outline-light");
    button.click(function () {
      action_show_crafting(__crafting);
    });
    button.html("".concat(current["result"]["nbt"]["name"]));
    button.appendTo(group);
  }

  $("#main").append(group);
}

function action_show_crafting(craft_id) {
  var inventory = database.getItem("accounts")[database.getItem("current_account")]["inventory"];
  var current_craft = crafting[craft_id];
  var current_recipe = current_craft["recipe"];
  var result = current_craft["result"];
  var can_craft = true;

  for (item in current_recipe) {
    if (inventory_length_item(item["id"], item["nbt"]) >= item["count"]) {
      continue;
    } else {
      can_craft = false;
      break;
    }

    ;
  }

  craft = function craft() {
    action_get_item("合成", result["id"], result["nbt"], result["count"], result["count"]);

    for (item in current_recipe) {
      inventory_delete_item(item["id"], item["nbt"], item["count"]);
    }
  };

  var modal = $("<div>").addClass("modal fade");
  var modal_dialog = $("<div>").addClass("modal-dialog");
  var modal_content = $("<div>").addClass("modal-content");
  var modal_header = $("<div>").addClass("modal-header");
  var modal_body = $("<div>").addClass("modal-body");
  var modal_footer = $("<div>").addClass("modal-footer");
  var cancel_button = $("<button>").addClass("btn btn-primary").html("取消");
  var modal_title;
  var button;
  var body_content = $("<ul>").addClass("list-group");

  for (item in current_recipe) {
    var li = $("<li>").addClass("list-group-item");
    li.append($);
    li.append($("<button>").addClass("btn btn-outline-light").html("".concat(item["count"])));
  }

  if (can_craft) {
    modal_title = $("<h5>").attr("id", "adi-title").addClass("modal-title").html("<p style='color: #000;'>\u786E\u8BA4\u5408\u6210 ".concat(result["nbt"]["name"], " * ").concat(result["count"], "?</p>"));
    button = $("<button>").addClass("btn btn-primary").html("确定");
    button.click(craft);
  } else {
    modal_title = $("<h5>").attr("id", "adi-title").addClass("modal-title").html("<p style='color: #000;'>\u6750\u6599\u4E0D\u8DB3!</p>");
    button = $("<button>").addClass("btn btn-primary").css("display", "none");
  }

  modal_title.appendTo(modal_header);
  modal_header.appendTo(modal_content);
  body_content.appendTo(modal_body);
  modal_body.appendTo(modal_content);
  cancel_button.appendTo(modal_footer);
  button.appendTo(modal_footer);
  modal_footer.appendTo(modal_content);
  modal_content.appendTo(modal_dialog);
  modal_dialog.appendTo(modal);
  modal.modal("show");
  cancel_button.click(function () {
    modal.modal("hide");
    modal.remove();
  });
}

function action_get_item(action, id, nbt) {
  var min = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var max = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 16;

  var _rng = randnum(min, max);

  var status = inventory_add_item({
    "id": id,
    "nbt": nbt
  }, _rng);

  if (status === true) {
    if (_rng === 0) {
      cocoMessage.info("".concat(action, "\u5931\u8D25\uFF0C\u672A\u83B7\u5F97").concat(nbt.name), 1000);
    } else {
      cocoMessage.info("".concat(action, "\u6210\u529F\uFF0C\u83B7\u5F97\u4E86") + _rng + String(nbt.name), 1000);
    }
  } else {
    cocoMessage.info("背包满了", 1000);
  }

  $(".coco-msg-content").css("color", "black");
}

function action_go_forage() {
  var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  if (window.location.hash !== "#forage") {
    window.location.hash = "#forage";
  }

  if (status === null) {
    $("#main").html("\n            <button class=\"btn btn-outline-light\" onclick=\"void(action_get_item('\u780D\u6811','text:oak_log',{name:'\u6A61\u6728'},0,16));\">\u91C7\u96C6\u6A61\u6728</button>\n            ");
  }
}

function action_go_mine() {
  var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  if (window.location.hash !== "#mine") {
    window.location.hash = "#mine";
  }

  if (status === null) {
    $("#main").html("\n            <button class=\"btn btn-outline-light\" onclick=\"void(action_go_mine('cobblestone'))\">\u6316\u6398\u5706\u77F3</button>\n            <button class=\"btn btn-outline-light\" onclick=\"void(action_go_mine('coal'))\">\u6316\u6398\u7164\u70AD</button>\n            ");
    $(".status-message").html("挖掘矿物");
  } else if (status === "cobblestone") {
    var _rng = randnum(0, 128);

    var _status = inventory_add_item({
      "id": "text:cobblestone",
      "nbt": {
        name: '圆石'
      }
    }, _rng);

    if (_status === true) {
      if (_rng === 0) {
        cocoMessage.info("挖掘失败，未获得圆石", 1000);
      } else {
        cocoMessage.info("挖掘成功，获得了" + _rng + "个圆石", 1000);
      }
    } else {
      cocoMessage.info("背包满了", 1000);
    }

    $(".coco-msg-content").css("color", "black");
  } else if (status === "coal") {
    var _rng2 = randnum(0, 64);

    if (_rng2 <= 16) {
      var _status2 = inventory_add_item({
        "id": "text:coal",
        "nbt": {
          name: '煤炭'
        }
      }, _rng2);

      if (_status2 === true) {
        if (_rng2 === 0) {
          cocoMessage.info("挖掘失败，未获得煤炭", 1000);
        } else {
          cocoMessage.info("挖掘成功，获得了" + _rng2 + "个煤炭", 1000);
        }
      } else {
        cocoMessage.info("背包满了", 1000);
      }
    } else {
      cocoMessage.info("挖掘失败，未获得煤炭", 1000);
    }

    $(".coco-msg-content").css("color", "black");
  }
}

function action_show_inventory() {
  if (window.location.hash !== "#inventory") {
    window.location.hash = "#inventory";
  }

  $(".status-message").html("背包");

  if (database.hasItem("accounts") && database.hasItem("current_account")) {
    if (database.getItem("accounts").hasOwnProperty(database.getItem("current_account"))) {
      var _inventory = database.getItem("accounts")[database.getItem("current_account")]["inventory"];
      var inventory_quans = {};

      if (_inventory instanceof Array) {
        for (var _item in _inventory) {
          if (inventory_quans.hasOwnProperty(_inventory[_item]["nbt"]['name'])) {
            if (JSON.stringify(inventory_quans[_inventory[_item]["nbt"]['name']]["nbt"]) != JSON.stringify(_inventory[_item]["nbt"])) {
              _uuid = uuid();
              inventory_quans["".concat(_inventory[_item]["nbt"]['name'], " <p style='display: none;'>").concat(_uuid, "</p>")] = {};
              inventory_quans["".concat(_inventory[_item]["nbt"]['name'], " <p style='display: none;'>").concat(_uuid, "</p>")]["quan"] = 1;
              inventory_quans["".concat(_inventory[_item]["nbt"]['name'], " <p style='display: none;'>").concat(_uuid, "</p>")]["name"] = _inventory[_item]["id"];
              inventory_quans["".concat(_inventory[_item]["nbt"]['name'], " <p style='display: none;'>").concat(_uuid, "</p>")]["nbt"] = _inventory[_item]["nbt"];
              inventory_quans["".concat(_inventory[_item]["nbt"]['name'], " <p style='display: none;'>").concat(_uuid, "</p>")]["uuid"] = _uuid;
            } else {
              inventory_quans[_inventory[_item]["nbt"]['name']]["quan"] += 1;
            }
          } else {
            inventory_quans[_inventory[_item]["nbt"]['name']] = {};
            inventory_quans[_inventory[_item]["nbt"]['name']]["quan"] = 1;
            inventory_quans[_inventory[_item]["nbt"]['name']]["name"] = _inventory[_item]["id"];
            inventory_quans[_inventory[_item]["nbt"]['name']]["nbt"] = _inventory[_item]["nbt"];
            inventory_quans[_inventory[_item]["nbt"]['name']]["uuid"] = uuid();
          }
        }

        var table = $("<table>").addClass("table table-dark");
        var thead = $("<thead>").appendTo(table);
        var tr = $("<tr>").appendTo(thead);
        $("<th>").html("#").appendTo(tr);
        $("<th>").html("名称").appendTo(tr);
        $("<th>").html("数量").appendTo(tr);
        $("<th>").html("命名空间").appendTo(tr);
        $("<th>").html("排序标签").appendTo(tr);
        $("<th>").html("命名标签").appendTo(tr);
        $("<th>").html("操作").appendTo(tr);
        var tbody = $("<tbody>").appendTo(table);

        for (var _item2 in Object.keys(inventory_quans)) {
          var num = inventory_quans[Object.keys(inventory_quans)[_item2]]["quan"];

          var id = inventory_quans[Object.keys(inventory_quans)[_item2]]["name"];

          var name = Object.keys(inventory_quans)[_item2];

          var nbt = inventory_quans[Object.keys(inventory_quans)[_item2]]["nbt"];

          var _tr = $("<tr>").appendTo(tbody);

          var _uuid2 = inventory_quans[Object.keys(inventory_quans)[_item2]]["uuid"];

          $("<td>").html(Number(_item2) + 1).appendTo(_tr);
          $("<td>").html(name).appendTo(_tr);
          $("<td>").html(num).appendTo(_tr);
          $("<td>").html(id).appendTo(_tr);
          $("<td>").html(_uuid2).appendTo(_tr);
          $("<td>").html(JSON.stringify(nbt)).appendTo(_tr);
          $("<td>").html("<a class=\"text-light\" onclick='void(action_delete_item(".concat(JSON.stringify(id), ",").concat(JSON.stringify(nbt), ",").concat(num, "));'>\u4E22\u5F03</a>")).appendTo(_tr);
        }

        $("#main").html("");
        table.appendTo("#main");
        $("<button>").addClass("btn btn-outline-light").html("清空背包").appendTo("#main").click(function () {
          var accounts = database.getItem("accounts");
          var inventory = [];
          accounts[database.getItem("current_account")]["inventory"] = inventory;
          database.setItem("accounts", accounts);
          action_show_inventory();
        });
      } else {
        var accounts = database.getItem("accounts");
        accounts[database.getItem("current_account")]["inventory"] = [];
        database.setItem("accounts", accounts);
        action_show_inventory();
      }
    }
  }
}

function action_delete_item(_id, _nbt) {
  var _max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  var modal = $("<div>").addClass("modal fade");
  var modal_dialog = $("<div>").addClass("modal-dialog").appendTo(modal);
  var modal_content = $("<div>").addClass("modal-content").appendTo(modal_dialog);
  var modal_header = $("<div>").addClass("modal-header").appendTo(modal_content);
  var modal_title = $("<h5>").attr("id", "adi-title").addClass("modal-title").html("<p style='color: #000;'>请输入丢弃物品数量</p>").appendTo(modal_header);
  var modal_body = $("<div>").addClass("modal-body").appendTo(modal_content);
  var modal_footer = $("<div>").addClass("modal-footer").appendTo(modal_content);
  var modal_button = $("<button>").addClass("btn btn-primary").html("确定").appendTo(modal_footer);
  var modal_input = $("<input>").addClass("form-range").attr("id", "adi-input").attr("type", "range").attr("min", "0").attr("max", _max).attr("value", "1").appendTo(modal_body);
  modal.appendTo("body");
  modal.modal("show");
  modal_input.on("change", function () {
    $("#adi-title").html("<p style='color: #000;'>\u8BF7\u8F93\u5165\u4E22\u5F03\u7269\u54C1\u6570\u91CF\uFF1A".concat(modal_input.val(), "</p>"));
  });
  modal_button.click(function () {
    inventory_delete_item(_id, _nbt, Number(modal_input.val()));
    modal.modal("hide");
    action_show_inventory();
  });
}