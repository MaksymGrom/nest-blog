import { Injectable } from '@nestjs/common';
import { MenuNode, PatchMenuNode } from './menu-node';

@Injectable()
export class MenuService {

  /**
   * Получить древовидное меню.
   *
   * Если меню не найдено, то вернется пустой массив.
   * Все меню строится от корня.
   * Листовые узлы обязаны иметь ссылку или будут удалены.
   * Ветки не могут иметь ссылку, она будет очищена.
   */
  getMenu(): MenuNode[] {
    return [];
  }

  /**
   * Добавить конфигурацию узла
   *
   * Дочерние узлы будут связаны с родителем даже если
   *   они имеют свой признак parentId
   */
  add(...nodes: MenuNode[]): void {
    // TODO add nodes
  }

  /**
   * Модифицировать конфигурацию узла
   *
   * Древовидная модификация не поддерживается
   */
  patch(...nodes: PatchMenuNode[]): void {
    // TODO patch node
  }

  /**
   * По ID удаляется узел из дерева
   *
   * При потере ссылки на корень все дети также не попадут в результат
   */
  remove(...ids: string[]): void {
    // TODO remove
  }
}
