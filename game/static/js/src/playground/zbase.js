class MyGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
            <div class="my_game_playground">
                <h1>游戏界面</h1>
            </div>
        `);

        // this.hide();
        this.root.$my_game.append(this.$playground);

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