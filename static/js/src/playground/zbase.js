let st = [false, false, false, false, false, false, false, false, false];
class MyGamePlayground {
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
        for (let i = 0; i < 9; i++) st[i] = false;
        for (let i = 0; i < 5; i++) {
            this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, this.get_random_color(), this.height * 0.15, false));
        }
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
    }
    hide() { // 关闭playground界面
        this.$playground.hide();
    }
}