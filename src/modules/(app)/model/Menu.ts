import MenuItem from "./MenuItem";

class Menu {
    constructor(
        public menuName: string,
        public menuIcon: any,
        public expanded: boolean,
        public menuItems: MenuItem[]
    ) { }

    public allowedForRole(role: string | undefined): boolean {
        return role ? this.menuItems.some(menuItem => menuItem.allowedRole.includes(role)) : false
    }
}

export default Menu;