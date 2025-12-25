class MenuItem {
    constructor(
        public menuItemName: string,
        public menuItemIcon: any,
        public menuItemPath: string,
        public allowedRole: string[]
    ) { }

    public allowedForRole(role: string | undefined): boolean {
        return role ? this.allowedRole.includes(role) : false
    }
}

export default MenuItem;