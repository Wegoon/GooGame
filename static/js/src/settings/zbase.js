class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        if (this.root.MyGameOS) this.platform = "ACAPP";
        this.username = "";
        this.photo = "";

        this.$settings = $(`            
            <div class= "my_game_settings">
            
            </div>
        `);
        this.root.$my_game.append(this.$settings);

        this.start();
    }
    start() {
        this.getinfo();
    }
    register() { // 打开注册界面

    }
    login() { // 打开登录界面

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