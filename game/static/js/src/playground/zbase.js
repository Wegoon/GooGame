let st = [false, false, false, false, false, false, false, false, false];
class MyGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
            <div class="my_game_playground">
            </div>
        `);
        this.hide();
        this.root.$my_game.append(this.$playground);
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
        let outer = this;
        $(window).resize(function () {
            outer.resize();
        });
    }

    resize() {
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;

        if (this.game_map) this.game_map.resize();
    }

    show(mode) { // 显示playground界面
        this.$playground.show();
        // this.width = this.$playground.width();
        // this.height = this.$playground.height();

        this.game_map = new GameMap(this);
        this.mode = mode;
        this.state = "waiting";     // waiting -> fighting -> over
        this.notice_board = new NoticeBoard(this);
        this.player_count = 0;
        this.resize();

        this.players = [];
        this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "white", 0.15, "me", this.root.settings.username, this.root.settings.photo));

        if (mode === "single mode") {
            this.show_single_mode();
        } else if (mode === "multi mode") {
            this.show_multi_mode();
        }
    }

    show_single_mode() {
        for (let i = 0; i < 9; i++) st[i] = false;
        for (let i = 0; i < 5; i++) {
            this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, this.get_random_color(), 0.15, "robot"));
        }
    }

    show_multi_mode() {
        let outer = this;
        this.chat_field = new ChatField(this);
        this.mps = new MultiPlayerSocket(this);
        this.mps.uuid = this.players[0].uuid;
        this.mps.ws.onopen = function () {
            outer.mps.send_create_player(outer.root.settings.username, outer.root.settings.photo);
        };
    }

    hide() { // 关闭playground界面
        this.$playground.hide();
    }
}