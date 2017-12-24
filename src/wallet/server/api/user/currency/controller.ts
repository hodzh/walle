import { Currency } from '../../../model/currency';
import { RouteControllerCollection } from '../../../../../core/server/web/collection-controller';

export class CurrencyController extends RouteControllerCollection {
  constructor() {
    super(Currency);
  }
}
