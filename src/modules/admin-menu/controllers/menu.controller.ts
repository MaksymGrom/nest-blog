import { Controller, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NestedTreeNode } from '../responses/nested-tree-node';
import { MenuService } from '../menus/menu.service';

@Controller('menu')
export class MenuController {

  constructor(private menuService: MenuService) {
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getProfile(): NestedTreeNode[] {
    return this.menuService.getMenu();
  }
}
