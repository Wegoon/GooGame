export class MyGame {
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