import { Controller, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NestedTreeNode } from '../responses/nested-tree-node';

@Controller('menu')
export class MenuController {

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getProfile(): NestedTreeNode[] {
    return [
      {
        name: 'Contents',
        children: [
          {
            name: 'Pages',
            href: '/admin/grid/content/pages'
          },
          {
            name: 'Posts',
            href: '/admin/grid/content/posts'
          },
          {
            name: 'Comments',
            href: '/admin/grid/content/comments'
          },
        ]
      }, {
        name: 'Accounts',
        icon: 'perm_identity',
        children: [
          {
            name: 'Admins',
            icon: 'manage_accounts',
            href: '/admin/grid/account/admins'
          }, {
            name: 'Users',
            icon: 'face',
            href: '/admin/grid/account/users'
          },
        ]
      }, {
        name: 'Settings',
        icon: 'settings',
        children: [
          {
            name: 'General',
            href: '/admin/form/settings/general'
          }, {
            name: 'Catalog',
            href: '/admin/form/settings/catalog'
          },
        ]
      }
    ];
  }
}
