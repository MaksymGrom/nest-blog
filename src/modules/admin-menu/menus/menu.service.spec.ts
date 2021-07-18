import { MenuService } from './menu.service';
import { ROOT_MENU_NODE_ID } from './menu-node';

describe('MenuService Unit Test', () => {
  let menuService: MenuService
  beforeEach(() => {
    menuService = new MenuService();
  });

  describe('Add Node', () => {
    it('Пустой сервис вернет пустой массив', () => {
      expect(menuService.getMenu()).toHaveLength(0);
    });

    it('Узел без связи к корню не вернется', () => {
      menuService.add({
        id: 'foo',
        parentId: 'bar',
        sortOrder: 10,
        name: 'foo',
        href: 'https://foo.com'
      });
      expect(menuService.getMenu()).toHaveLength(0);
    });

    it('Узел со связью к корню должен быть добавлен', () => {
      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 10,
        name: 'foo',
        href: 'https://foo.com'
      });
      expect(menuService.getMenu()).toHaveLength(1);
    });
  });
});
