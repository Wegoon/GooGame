class Settings {
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
                    <div class= "my_game_settings_others_login">
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
                    <div class= "my_game_settings_others_login">
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

        this.root.$my_game.append(this.$settings);

        this.start();
    }
    start() {
        this.getinfo();
        this.add_listening_events();
    }

    add_listening_events() {
        this.add_listening_events_login();
        this.add_listening_events_register();
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
                console.log(resp);
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
                console.log(resp);
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
                console.log(resp);
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
        let outer = this;
        $.ajax({
            url: "https://game.wegoon.top/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            success: function (resp) {
                console.log(resp);
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

    hide() {
        this.$settings.hide();
    }

    show() {
        this.$settings.show();
    }
}