import { SkillsItem } from "./skillItem";

export class Skills {
    constructor(el) {
        this.DOM = {el: el};
        this.DOM.menuItems = this.DOM.el.querySelectorAll('.col.skill');
        this.menuItems = [];
        this.DOM.menuItems.forEach(menuItem => this.menuItems.push(new SkillsItem(menuItem)));
    }
}