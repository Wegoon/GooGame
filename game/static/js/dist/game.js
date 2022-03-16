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
    }
    last_timestamp = timestamp;
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
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}class Player extends MyGameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {
        super();
        // console.log(playground.height);
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x, this.y = y;
        this.vx = 0, this.vy = 0;
        this.move_length = 0;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.1;
        // this.start();
    }
    start() {
        if (this.is_me) {
            this.add_listening_events();
        }
    }
    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function () {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function (e) {
            if (e.which === 3) {
                outer.move_to(e.clientX, e.clientY);
                // console.log(e.clientX, e.clientY);
            }
        });
    }
    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        // console.log(dx, dy);
        return Math.sqrt(dx * dx + dy * dy);
    }
    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        // console.log(this.move_length);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        // console.log(angle);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
        // console.log(this.vx, this.vy);
    }

    update() {
        // console.log(this.timedelta);
        if (this.move_length < this.eps) {
            this.move_length = 0;
            this.vx = this.vy = 0;
        } else {
            // console.log(this.speed);
            let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
            // console.log(this.speed * this.timedelta / 1000);
            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.move_length -= moved;
        }
        this.render();
    }
    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
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
        this.players = [];
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));

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