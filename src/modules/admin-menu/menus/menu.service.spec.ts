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

    it('Листовой узел без ссылки должен быть удален', () => {
      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 10,
        name: 'foo',
      });
      expect(menuService.getMenu()).toHaveLength(0);
    });

    it('Узлы с одинаковым ID перетирают друг дурга', () => {
      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 10,
        name: 'foo',
        href: 'https://foo.com'
      });

      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 20,
        name: 'foo',
        href: 'https://foo.com'
      });
      const menu = menuService.getMenu();
      expect(menu).toHaveLength(1);
      expect(menu[0].sortOrder).toBe(20);
    });

    it('Узлы выстраиваются в иерархию', () => {
      menuService.add({
        id: 'bar',
        parentId: 'foo',
        sortOrder: 10,
        name: 'bar',
        href: 'https://bar.com'
      });

      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 20,
        name: 'foo',
        href: 'https://foo.com'
      });
      const menu = menuService.getMenu();
      expect(menu).toHaveLength(1);
      expect(menu[0].id).toBe('foo');
      expect(menu[0].children).toHaveLength(1);
      expect(menu[0].children[0].id).toBe('bar');
    });

    it('Вложенные узлы добавляются с привязкой к родителю', () => {
      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 20,
        name: 'foo',
        href: 'https://foo.com',
        children: [
          {
            id: 'bar',
            parentId: ROOT_MENU_NODE_ID,
            sortOrder: 10,
            name: 'bar',
            href: 'https://bar.com'
          }
        ]
      });

      const menu = menuService.getMenu();
      expect(menu).toHaveLength(1);
      expect(menu[0].id).toBe('foo');
      expect(menu[0].children).toHaveLength(1);
      expect(menu[0].children[0].id).toBe('bar');
    });
  });

  describe('Patch node', () => {
    it('Добавленный узел можно переписать' +
      ' независимо от очередности вызова', () => {
      menuService.patch({
        id: 'foo',
        sortOrder: 77
      });
      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 20,
        name: 'foo',
        href: 'https://foo.com',
      });

      const menu = menuService.getMenu();
      expect(menu[0].sortOrder).toBe(77);
      expect(menu[0].name).toBe('foo');
    });

    it('Patch не добавляет узел, а лишь модифицирует', () => {
      menuService.patch({
        id: 'foo',
        sortOrder: 77
      });

      const menu = menuService.getMenu();
      expect(menu).toHaveLength(0);
    });

    it('Можно иметь более 1 патча', () => {
      menuService.patch({
        id: 'foo',
        sortOrder: 77,
        href: 'https://bar.com'
      });
      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 20,
        name: 'foo',
        href: 'https://foo.com',
      });
      menuService.patch({
        id: 'foo',
        sortOrder: 13,
        name: 'bar'
      });

      const menu = menuService.getMenu();
      expect(menu[0].sortOrder).toBe(13);
      expect(menu[0].href).toBe('https://bar.com');
      expect(menu[0].name).toBe('bar');
    });
  });

  describe('Remove node', () => {
    it('Узел может быть удален по его ID', () => {
      menuService.remove('foo', 'bar');
      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 20,
        name: 'foo',
        href: 'https://foo.com',
      });

      expect(menuService.getMenu()).toHaveLength(0);
    });

    it('Patch может отменить удаление', () => {
      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 20,
        name: 'foo',
        href: 'https://foo.com',
      });
      menuService.remove('foo', 'bar');
      menuService.patch({
        id: 'foo', removed: false
      }, {
        id: 'bar', removed: false
      });

      expect(menuService.getMenu()).toHaveLength(1);
    });

    it('Patch === remove, зависят от очереди вызова', () => {
      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 20,
        name: 'foo',
        href: 'https://foo.com',
      });
      menuService.patch({
        id: 'foo', removed: false
      }, {
        id: 'bar', removed: false
      });
      menuService.remove('foo', 'bar');

      expect(menuService.getMenu()).toHaveLength(0);
    });
  });

  describe('Sorting', () => {
    it('Узлы должны сортироваться', () => {
      menuService.add({
        id: 'bar',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 20,
        name: 'bar',
        href: 'https://bar.com',
      });
      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 10,
        name: 'foo',
        href: 'https://foo.com',
      });
      const menu = menuService.getMenu();
      expect(menu[0].id).toBe('foo');
    })
  })
});
