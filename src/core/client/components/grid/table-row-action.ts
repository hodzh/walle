import { Type } from '@angular/core';

export interface TableRowAction {
  type?: 'remove' | 'refresh' | 'custom';
  factory?: Type<any>;
  bind?: string;
  name?: string;
  text?: string;
  show?: any;
}
