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
}