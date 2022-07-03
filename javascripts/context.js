
var context = {
    menu: [
        {
            type: "text",
            content:{
                text: '文字游戏',
                action: function(e) {},
            },
        },
        {
            type: "separator",
        },
        {
            type: "text",
            content:{
                text: '打开背包',
                action: function(e) {
                    action_show_inventory();
                },
            },
        },
    ]
}


$(document).bind("contextmenu", function(e) {
    $(".context-menu").fadeOut(300);
    setTimeout($(".context-menu").remove,400);
    let menu = $('<ul class="list-group context-menu">');
    for (let i = 0; i < context.menu.length; i++) {
        let item = context.menu[i];
        if (item.type === "separator") {
            let sep = $('<li class="list-group-item">')
            sep.css({background: "transparent",});
            sep.appendTo(menu);
        }else{
            let li = $('<li class="list-group-item">');
            li.text(item.content.text);
            if (item.content.hasOwnProperty('style')) {
                li.css(item.content.style);
            };
            if (item.content.hasOwnProperty('class')) {
                li.addClass(item.content.class);
            };
            li.hover(function(){
                li.css("background-color","rgb(154 157 157 / 50%)");
            },function(){
                li.css("background-color","transparent");
            });
            li.css({background: "transparent",color: "#fff"});
            li.click(function(){item.content.action(e)});
            li.appendTo(menu);
        }
    }
    menu.css({
        left: e.pageX,
        top: e.pageY,
        position: 'absolute',
        opacity: 1,
        color: "#fff",
        background: 'rgb(95 101 102 / 50%)',
        display: "none",
        'box-shadow': '0 0 10px rgba(0, 0, 0, 0.5)',
    });
    menu.appendTo('body');
    menu.fadeIn(400);
    $(document).click(function() {
        $(".context-menu").fadeOut(300);
        setTimeout(function(){$(".context-menu").remove();},400);
    });
    return false;
});