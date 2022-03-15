class MyGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class="my_game_menu">
                <div class="my_game_menu_field">
                    <div class="my_game_menu_field_item my_game_menu_field_item_single">
                        单人模式
                    </div>
                    <br>
                    <div class="my_game_menu_field_item my_game_menu_field_item_multi">
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
        this.$single = this.$menu.find('.my_game_menu_field_item_single');
        this.$multi = this.$menu.find('.my_game_menu_field_item_multi');
        this.$settings = this.$menu.find('.my_game_menu_field_item_settings');
    }
}
