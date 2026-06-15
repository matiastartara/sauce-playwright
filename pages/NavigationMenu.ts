import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';


export class NavigationMenu extends BasePage {
    readonly openButton: Locator;
    readonly closeButton: Locator;
    readonly allItemsLink: Locator;
    readonly aboutLink: Locator;
    readonly logoutLink: Locator;
    readonly resetAppStateLink: Locator;

    constructor(page: Page) {
        super(page);
        this.openButton = page.locator('#react-burger-menu-btn');
        this.closeButton = page.locator('#react-burger-cross-btn');
        this.allItemsLink = page.locator('#inventory_sidebar_link');
        this.aboutLink = page.locator('#about_sidebar_link');
        this.logoutLink = page.locator('#logout_sidebar_link');
        this.resetAppStateLink = page.locator('#reset_sidebar_link');
     }

     async openMenu() {
        await this.openButton.click();
     }

     async closeMenu() {
        await this.closeButton.click();
     }

     async navigateToAllItems() {
        await this.allItemsLink.click();
     }

     async navigateToAbout() {
        await this.aboutLink.click();
     }

     async logout() {
        await this.logoutLink.click();
     }

     async resetAppState() {
        await this.resetAppStateLink.click();
     }  
}