import { CURRENCY_TEXT_CONVERTER } from "../../../common/currency-text-converter";
export const TRANSACTION_LIST_SCHEMA = [
  {
    title: 'create date',
    field: 'created',
    sortable: 'both',
    sort: 'desc'
  },
  {
    title: 'update date',
    field: 'updated',
    sortable: 'both'
  },
  {
    title: 'status',
    field: 'status'
  },
  {
    title: 'category',
    field: 'category'
  },
  {
    title: 'currency',
    field: 'currency'
  },
  {
    title: 'amount',
    field: 'amount',
    sortable: 'both',
    converter: CURRENCY_TEXT_CONVERTER
  },
  {
    title: 'address',
    field: 'bitcoin.address'
  },
  {
    title: 'actions',
    type: 'actions',
    actions: [
      {type: 'remove'},
      {type: 'refresh'},
    ]
  }
];
