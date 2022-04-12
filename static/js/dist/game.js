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
                        退出（后面会改为设置）
                    </div>
                </div>
            </div>
        `);
        this.$menu.hide();
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
            outer.root.settings.logout_on_remote();
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
    on_destroy() { // 在被销毁前执行一次

    }
    destroy() { // 删掉该物体
        this.on_destroy();
        for (let i = 0; i < MY_GAME_OBJECT.length; i++) {
            if (MY_GAME_OBJECT[i] === this) {
                MY_GAME_OBJECT.splice(i, 1);
                break;
            }
        }
    }
    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
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
}class Particle extends MyGameObject {
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.friction = 0.9;
        this.eps = 1;
    }
    start() {

    }
    update() {
        if (this.speed < this.eps || this.move_length < this.eps) {
            this.destroy();
            return false;
        }
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.friction;
        this.move_length -= moved;
        this.render();
    }
    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}let num = 0;
class Player extends MyGameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x, this.y = y;
        this.vx = 0, this.vy = 0;
        this.damage_x = 0, this.damage_y = 0;
        this.damage_speed = 0;
        this.move_length = 0;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.1;
        this.friction = 0.9;
        this.cur_skill = null;
        this.spent_time = 0;
        this.died = false;
        this.start();
    }
    start() {
        if (this.is_me) {
            this.img = new Image();
            this.img.src = this.playground.root.settings.photo;
            this.add_listening_events();
        } else {
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);
        }
    }
    on_destroy() {
        this.died = true;
        for (let i = 0; i < this.playground.players.length; i++) {
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
            }
        }
    }
    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function () {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function (e) {
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if (!outer.died) {
                if (e.which === 3) {
                    outer.move_to(e.clientX - rect.left, e.clientY - rect.top);
                } else if (e.which === 1) {
                    if (outer.cur_skill === "fireball" && outer.spent_time > 2) {
                        outer.shoot_fireball(e.clientX - rect.left, e.clientY - rect.top);
                    }
                    outer.cur_skill = null;
                }
            }
        });
        $(window).keydown(function (e) {
            if (!outer.died) {
                if (e.which === 81) { // Q键
                    outer.cur_skill = "fireball";
                    return false;
                } else if (e.which === 87) { // W键
                    let tx = outer.x, ty = Math.max(0, outer.y - 0.1 * outer.playground.height);
                    outer.move_to(tx, ty);
                } else if (e.which === 65) { // A键
                    let tx = Math.max(0, outer.x - 0.1 * outer.playground.width), ty = outer.y;
                    outer.move_to(tx, ty);
                } else if (e.which === 83) { // S键
                    let tx = outer.x, ty = Math.min(outer.playground.height, outer.y + 0.1 * outer.playground.height);
                    outer.move_to(tx, ty);
                } else if (e.which === 68) { // D键
                    let tx = Math.min(outer.playground.width, outer.x + 0.1 * outer.playground.width), ty = outer.y;
                    outer.move_to(tx, ty);
                }
            }
        });
    }
    shoot_fireball(tx, ty) {
        let x = this.x, y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - y, tx - x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 0.7;
        let damage = this.playground.height * 0.01;
        new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, damage)
    }
    is_attacked(angle, damage) {
        for (let i = 0; i < 20 + Math.random() * 10; i++) {
            let x = this.x, y = this.y;
            let radius = this.radius * 0.1 * Math.random();
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 20;
            let move_length = this.radius * 10 * Math.random();
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
        }
        this.radius -= damage;
        if (this.radius < 10) {
            this.destroy();
            return true;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 100;
        this.speed *= 0.8;
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    update() {
        let outer = this;
        this.spent_time += this.timedelta / 1000;
        if (!this.is_me && this.spent_time > 4 && Math.random() < 1.0 / 300) {
            if (this.playground.players.length > 1) {
                let player = this.playground.players[0]; // this将要攻击的人
                if (Math.random() < 0.3 && player.is_me) { // 攻击真人玩家
                    let tx = player.x + player.vx * player.speed * 0.7;
                    let ty = player.y + player.vy * player.speed * 0.7;
                    this.shoot_fireball(tx, ty);
                } else { // 攻击所有可以攻击的玩家（包括真人和电脑）
                    let len = this.playground.players.length;
                    if (len) {
                        let id = Math.floor(Math.random() * len);
                        if (this.playground.players[id] != this) {
                            player = this.playground.players[id];
                            let tx = player.x + player.vx * player.speed * 0.7;
                            let ty = player.y + player.vy * player.speed * 0.7;
                            this.shoot_fireball(tx, ty);
                        }
                    }
                }
            }
        }
        if (this.damage_speed > 20) {
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.x = Math.min(Math.max(this.x, 0), this.playground.width);
            this.y = Math.min(Math.max(this.y, 0), this.playground.height);
            this.damage_speed *= this.friction;
        } else {
            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if (!this.is_me) {
                    let tx = Math.random() * this.playground.width;
                    let ty = Math.random() * this.playground.height;
                    this.move_to(tx, ty);
                }
            } else {
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }
        this.render();
    }
    render() {
        if (this.is_me) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
            this.ctx.restore();
        }
        else {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
    }
}class FireBall extends MyGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x, this.y = y;
        this.vx = vx, this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.1;
        this.start();
    }
    start() {

    }
    update() {
        if (this.move_length < this.eps) {
            this.destroy();
            return false;
        }
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
        for (let i = 0; i < this.playground.players.length; i++) {
            let player = this.playground.players[i];
            if (this.player !== player && !player.died && this.is_collision(player)) {
                this.attack(player);
            }
        }
        this.render();
    }
    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        if (distance < this.radius + player.radius) return true;
        return false;
    }
    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);
        this.destroy();
    }
    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}let st = [false, false, false, false, false, false, false, false, false];
class MyGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
            <div class="my_game_playground">
            </div>
        `);
        this.hide();

        this.start();
    }
    get_random_color() {
        let colors = ["DeepSkyBlue", "green", "Blue", "Chartreuse", "Crimson", "pink", "Yellow", "Cyan", "Magenta"];
        while (true) {
            let id = Math.floor(Math.random() * 9);
            if (!st[id]) {
                st[id] = true;
                return colors[id];
            }
        }
    }
    start() {

    }
    show() { // 显示playground界面
        this.$playground.show();
        this.root.$my_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));
        for (let i = 0; i < 9; i++) st[i] = false;
        for (let i = 0; i < 5; i++) {
            this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, this.get_random_color(), this.height * 0.15, false));
        }
    }
    hide() { // 关闭playground界面
        this.$playground.hide();
    }
}class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        if (this.root.MyGameOS) this.platform = "ACAPP";
        this.username = "";
        this.photo = "";
        this.$settings = $(`            
            <div class= "my_game_settings">
                <div class= "my_game_settings_login">
                    <div class= "my_game_settings_title">
                        登录
                    </div>
                    <div class= "my_game_settings_username">
                        <div class= "my_game_settings_item">
                            <input type="text" placeholder="用户名">
                        </div>
                    </div>
                    <div class= "my_game_settings_password">
                        <div class= "my_game_settings_item">
                            <input type="password" placeholder="密码">
                        </div>
                    </div>
                    <div class= "my_game_settings_submit">
                        <div class= "my_game_settings_item">
                            <button>登录</button>
                        </div>
                    </div>
                    <div class= "my_game_settings_error_messages">
                        
                    </div>
                    <div class= "my_game_settings_option">
                        注册
                    </div>
                    <br>
                    <div class= "my_game_settings_others_login_acwing">
                        <img width="30" src="https://game.wegoon.top/static/image/settings/submit_logo.png">
                        <br>
                        <div>
                            第三方一键登录
                        </div>
                    </div>
                </div>
                <div class= "my_game_settings_register">
                    <div class= "my_game_settings_title">
                        注册
                    </div>
                    <div class= "my_game_settings_username">
                        <div class= "my_game_settings_item">
                            <input type="text" placeholder="用户名">
                        </div>
                    </div>
                    <div class= "my_game_settings_password my_game_settings_password_first">
                        <div class= "my_game_settings_item">
                            <input type="password" placeholder="密码">
                        </div>
                    </div>
                    <div class= "my_game_settings_password my_game_settings_password_second">
                        <div class= "my_game_settings_item">
                            <input type="password" placeholder="确认密码">
                        </div>
                    </div>
                    <div class= "my_game_settings_submit">
                        <div class= "my_game_settings_item">
                            <button>注册</button>
                        </div>
                    </div>
                    <div class= "my_game_settings_error_messages">
                        
                    </div>
                    <div class= "my_game_settings_option">
                        登录
                    </div>
                    <br>
                    <div class= "my_game_settings_others_login_acwing">
                        <img width="30" src="https://game.wegoon.top/static/image/settings/submit_logo.png">
                        <br>
                        <div>
                            第三方一键登录
                        </div>
                    </div>
                </div>
        `);
        this.$login = this.$settings.find(".my_game_settings_login");
        this.$login_username = this.$login.find(".my_game_settings_username input");
        this.$login_password = this.$login.find(".my_game_settings_password input");
        this.$login_submit = this.$login.find(".my_game_settings_submit button");
        this.$login_error_message = this.$login.find(".my_game_settings_error_messages");
        this.$login_register = this.$login.find(".my_game_settings_option");

        this.$login.hide();

        this.$register = this.$settings.find(".my_game_settings_register");
        this.$register_username = this.$register.find(".my_game_settings_username input");
        this.$register_password = this.$register.find(".my_game_settings_password_first input");
        this.$register_password_confirm = this.$register.find(".my_game_settings_password_second input");
        this.$register_submit = this.$register.find(".my_game_settings_submit button");
        this.$register_error_message = this.$register.find(".my_game_settings_error_messages");
        this.$register_login = this.$register.find(".my_game_settings_option");

        this.$register.hide();

        this.$acwing_login = this.$settings.find('.my_game_settings_others_login_acwing img');


        this.root.$my_game.append(this.$settings);

        this.start();
    }
    start() {
        this.getinfo();
        if (this.platform === "WEB") {
            this.add_listening_events();
        } 
    }

    add_listening_events() {
        let outer = this;
        this.add_listening_events_login();
        this.add_listening_events_register();

        this.$acwing_login.click(function () {
            outer.acwing_login();
        });
    }

    acwing_login() {
        $.ajax({
            url: "https://game.wegoon.top/settings/acwing/web/apply_code/",
            type: "GET",
            success: function (resp) {
                if (resp.result === "success") {
                    window.location.replace(resp.apply_code_url);
                }
            }
        });
    }

    add_listening_events_login() {
        let outer = this;
        this.$login_submit.click(function () {
            outer.login_on_remote();
        });
        this.$login_register.click(function () {
            outer.register();
        });

    }

    add_listening_events_register() {
        let outer = this;
        this.$register_submit.click(function () {
            outer.register_on_remote();
        });
        this.$register_login.click(function () {
            outer.login();
        });

    }

    login_on_remote() { // 在远程服务器上登录
        let outer = this;
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_error_message.empty();

        $.ajax({
            url: "https://game.wegoon.top/settings/login/",
            type: "GET",
            data: {
                username: username,
                password: password,
            },
            success: function (resp) {
                if (resp.result === "success") {
                    // outer.hide();
                    // outer.root.menu.show();
                    location.reload();
                } else {
                    outer.$login_error_message.html(resp.result);
                }
            }
        });
    }

    logout_on_remote() { // 在远程服务器上登出
        if (this.platform === "ACAPP") return false;

        $.ajax({
            url: "https://game.wegoon.top/settings/logout/",
            type: "GET",
            success: function (resp) {
                if (resp.result === "success") {
                    location.reload();
                }
            }
        });
    }

    register_on_remote() { // 在远程服务器上注册
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_error_message.empty();

        $.ajax({
            url: "https://game.wegoon.top/settings/register/",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: function (resp) {
                if (resp.result === "success") {
                    // outer.hide();
                    // outer.root.menu.show();
                    location.reload(); // 刷新页面
                } else {
                    outer.$register_error_message.html(resp.result);
                }
            }
        });
    }



    register() { // 打开注册界面
        this.$login.hide();
        this.$register.show();
    }
    login() { // 打开登录界面
        this.$register.hide();
        this.$login.show();
    }

    getinfo() {
        if (this.platform === "WEB") {
            this.getinfo_web();
        } else if (this.platform === "ACAPP") {
            this.getinfo_acapp();
        }
    }

    getinfo_web() {
        let outer = this;
        $.ajax({
            url: "https://game.wegoon.top/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            success: function (resp) {
                if (resp.result === "success") {
                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    outer.hide();
                    outer.root.menu.show();
                } else {
                    outer.login();
                    // outer.register();
                }
            }
        });
    }

    getinfo_acapp() {
        let outer = this;
        $.ajax({
            url: "https://game.wegoon.top/settings/acwing/acapp/apply_code/",
            type: "GET",
            success: function(resp) {
                if (resp.result === "success") {
                    outer.acapp_login(resp.appid, resp.redirect_uri, resp.scope, resp.state);
                }
            }
        });
    }

    acapp_login(appid, redirect_uri, scope, state) {
        let outer = this;
        this.root.MyGameOS.api.oauth2.authorize(appid, redirect_uri, scope, state, function(resp){
            console.log(resp);
            if (resp.result === "success") {
                outer.username = resp.username;
                outer.photo = resp.photo;
                outer.hide();
                outer.root.menu.show();
            }
        });
    }

    hide() {
        this.$settings.hide();
    }

    show() {
        this.$settings.show();
    }
}export class MyGame {
    constructor(id, MyGameOS) {
        this.id = id;
        this.$my_game = $('#' + id);
        this.MyGameOS = MyGameOS;

        this.settings = new Settings(this);
        this.menu = new MyGameMenu(this);
        this.playground = new MyGamePlayground(this);

        this.start();
    }
    start() {

    }
}