class MyGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class="my_game_menu">
                <div class="my_game_menu_field">
                    <div class="my_game_menu_field_item my_game_menu_field_item_single_mode">
                        单人模式
                    </div>
                    <br>
                    <div class="my_game_menu_field_item my_game_menu_field_item_multi_mode">
                        多人模式
                    </div>
                    <br>
                    <div class="my_game_menu_field_item my_game_menu_field_item_settings">
                        设置
                    </div>
                </div>
            </div>
        `);
        this.root.$my_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.my_game_menu_field_item_single_mode');
        this.$multi_mode = this.$menu.find('.my_game_menu_field_item_multi_mode');
        this.$settings = this.$menu.find('.my_game_menu_field_item_settings');

        this.start();
    }

    start() {
        this.add_listening_events();
    }
    add_listening_events() {
        let outer = this;
        this.$single_mode.click(function () {
            outer.hide();
            outer.root.playground.show();
        });
        this.$multi_mode.click(function () {
            console.log("click multi mode");
        });
        this.$settings.click(function () {
            console.log("click settings");
        });
    }
    show() { // 显示menu界面
        this.$menu.show();
    }
    hide() { // 关闭menu界面
        this.$menu.hide();
    }
}let MY_GAME_OBJECT = [];

class MyGameObject {
    constructor() {
        MY_GAME_OBJECT.push(this);
        this.has_called_start = false; // 是否执行过start函数
        this.timedelta = 0; // 当前帧距离上一帧的时间间隔
    }
    start() { // 只会在第一帧执行一次

    }
    update() { // 每一帧都会执行一次

    }
    on_destory() { // 在被销毁前执行一次

    }
    destory() { // 删掉该物体
        this.on_destory();
        for (let i = 0; i < MY_GAME_OBJECT.length; i++) {
            if (MY_GAME_OBJECT[i] === this) {
                MY_GAME_OBJECT.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;
let MY_GAME_ANIMATION = function (timestamp) {
    for (let i = 0; i < MY_GAME_OBJECT.length; i++) {
        let obj = MY_GAME_OBJECT[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
        last_timestamp = timestamp;
    }

    requestAnimationFrame(MY_GAME_ANIMATION);
}

requestAnimationFrame(MY_GAME_ANIMATION);class GameMap extends MyGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $('<canvas></canvas>');
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }
    start() {

    }
    update() {
        this.render();
    }
    render() {
        this.ctx.fillStyle = "rgba(0, 0, 0)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}class MyGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
            <div class="my_game_playground">
            </div>
        `);

        // this.hide();
        this.root.$my_game.append(this.$playground);
        this.width = this.$playground.width();
        // console.log(this.width);
        this.height = this.$playground.height();
        // console.log(this.height);
        this.game_map = new GameMap(this);

        this.start();
    }
    start() {

    }
    show() { // 显示playground界面
        this.$playground.show();
    }
    hide() { // 关闭playground界面
        this.$playground.hide();
    }
}export class MyGame {
    constructor(id) {
        this.id = id;
        this.$my_game = $('#' + id);
        // this.menu = new MyGameMenu(this);
        this.playground = new MyGamePlayground(this);

        this.start();
    }
    start() {

    }
}