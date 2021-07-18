import { Injectable } from '@nestjs/common';
import { MenuNode, PatchMenuNode, ROOT_MENU_NODE_ID } from './menu-node';

@Injectable()
export class MenuService {
  private nodes: {[id: string]: MenuNode} = {};
  private patches: PatchMenuNode[] = [];
  /**
   * Получить древовидное меню.
   *
   * Если меню не найдено, то вернется пустой массив.
   * Все меню строится от корня.
   * Листовые узлы обязаны иметь ссылку или будут удалены.
   * Ветки не могут иметь ссылку, она будет очищена.
   */
  getMenu(): MenuNode[] {
    const nodeMap: {[id: string]: MenuNode} = {};
    let src = Object.values(this.nodes).map(node => {
      const copy = {...node};
      nodeMap[copy.id] = copy;
      return copy;
    });

    this.patches.forEach(patch => {
      if (nodeMap[patch.id]) {
        Object.assign(nodeMap[patch.id], patch);
      }
    })

    src = src.filter(node => !node.removed);
    // отсортировать (нет теста)

    return this.getMenuForNode(ROOT_MENU_NODE_ID, src);
  }

  private getMenuForNode(id: string, src: MenuNode[]): MenuNode[] {
    const res = src.filter(node => node.parentId === id)
      .map(({href, ...node}) => {
        const children = this.getMenuForNode(node.id, src);

        if (children.length > 0) {
          return {
            ...node,
            children
          };
        }

        return {
          ...node,
          href,
          removed: !href,
          children: []
        };
      }).filter(node => !node.removed);

    res.sort((a, b) => a.sortOrder - b.sortOrder);

    return res;
  }

  /**
   * Добавить конфигурацию узла
   *
   * Дочерние узлы будут связаны с родителем даже если
   *   они имеют свой признак parentId
   */
  add(...nodes: MenuNode[]): void {
    nodes.forEach(node => {
      const sanitizedChildren = node.children?.map(child => ({
        ...child,
        parentId: node.id
      })) || [];

      const {children, ...sanitizedNode} = node;
      this.add(...sanitizedChildren);

      this.nodes[node.id] = sanitizedNode;
    });
  }

  /**
   * Модифицировать конфигурацию узла
   *
   * Древовидная модификация не поддерживается
   */
  patch(...patches: PatchMenuNode[]): void {
    this.patches = [
      ...this.patches,
      ...patches
    ];
  }

  /**
   * По ID удаляется узел из дерева
   *
   * При потере ссылки на корень все дети также не попадут в результат
   */
  remove(...ids: string[]): void {
    this.patch(...ids.map(id => ({
      id,
      removed: true
    })));
  }
}
