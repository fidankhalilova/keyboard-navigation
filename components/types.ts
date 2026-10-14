export interface MenuItemData {
  id: string;
  label: string;
  disabled?: boolean;
  items?: MenuItemData[];
}
