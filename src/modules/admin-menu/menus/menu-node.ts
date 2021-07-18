export const ROOT_MENU_NODE_ID = 'root';
export interface MenuNode {
  name: string;
  href?: string;
  icon?: string;
  children?: MenuNode[];
  id: string;
  parentId: string;
  sortOrder: number;
  removed?: boolean;
}

export type PatchMenuNode = Pick<MenuNode, 'id'>
  & Partial<Omit<MenuNode, 'id' | 'children'>>
